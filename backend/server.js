const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = "my_super_secret_key"; // 토큰 암호화 키

mongoose.connect('mongodb://db:27017/chatdb');

// --- 데이터 설계도 (Schema) ---
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const ChatSchema = new mongoose.Schema({
  room: String,
  senderName: String,
  msg: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', ChatSchema);

const server = http.createServer();
const io = socketIo(server, { cors: { origin: "*" } });

let onlineUsers = {}; // { socketId: username }

io.on('connection', (socket) => {

  // 1. 회원가입 및 로그인
  socket.on('auth', async (data) => {
    const { type, username, password } = data;

    try {
      if (type === 'register') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        socket.emit('auth_success', { message: "가입 성공! 로그인 해주세요." });
      }
      else if (type === 'login') {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
          const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
          onlineUsers[socket.id] = username;
          socket.emit('login_success', { token, username });
          io.emit('user list', onlineUsers);
        } else {
          socket.emit('auth_error', "아이디 또는 비밀번호가 틀립니다.");
        }
      }
    } catch (e) {
      socket.emit('auth_error', "이미 존재하는 아이디거나 오류가 발생했습니다.");
    }
  });

  // 2. 과거 내역 불러오기 (토큰 검증 포함)
  socket.on('get history', async (data) => {
    const { token, targetName } = data;
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const myName = decoded.username;
      const room = [myName, targetName].sort().join('-');
      const history = await Chat.find({ room }).sort({ timestamp: 1 });
      socket.emit('load history', history);
    } catch (e) {
      socket.emit('auth_error', "인증이 만료되었습니다.");
    }
  });

  // 3. 메시지 전송
  socket.on('private message', async (data) => {
    const { token, toId, msg } = data;
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const myName = decoded.username;
      const targetName = onlineUsers[toId];
      const room = [myName, targetName].sort().join('-');

      const newChat = new Chat({ room, senderName: myName, msg });
      await newChat.save();

      io.to(toId).emit('chat message', { fromName: myName, msg });
      socket.emit('chat message', { fromName: myName, msg, isMe: true });
    } catch (e) {
      socket.emit('auth_error', "인증 실패");
    }
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('user list', onlineUsers);
  });
});

server.listen(3000);