# 🐳 Docker 기반 1:1 실시간 채팅 애플리케이션

## 📋 프로젝트 개요

Docker를 학습하며 구현한 실시간 1:1 채팅 애플리케이션입니다. 
Docker Compose를 활용하여 프론트엔드, 백엔드, 데이터베이스를 컨테이너화하고 오케스트레이션하는 것을 목표로 합니다.

## 🎯 과제 목표

- Docker 및 Docker Compose 학습
- 마이크로서비스 아키텍처 실습
- 컨테이너 간 통신 구현
- 실시간 채팅 기능 구현

## 🏗️ 아키텍처

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │ ───> │   Backend   │ ───> │  MongoDB    │
│  (Nginx)    │      │  (Node.js)  │      │             │
│   Port 80   │      │  Port 3000  │      │ Port 27017  │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🛠️ 기술 스택

### Frontend
- **Nginx** - 정적 파일 서빙
- **HTML/CSS/JavaScript** - UI 구현
- **Socket.io Client** - 실시간 통신

### Backend
- **Node.js** - 런타임 환경
- **Socket.io** - 실시간 양방향 통신
- **Express** - 웹 프레임워크
- **JWT** - 사용자 인증
- **bcryptjs** - 비밀번호 암호화

### Database
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - ODM (Object Data Modeling)

### DevOps
- **Docker** - 컨테이너화
- **Docker Compose** - 멀티 컨테이너 오케스트레이션

## 📁 프로젝트 구조

```
chat-project/
├── docker-compose.yml          # 서비스 오케스트레이션 설정
├── .gitignore                  # Git 제외 파일 목록
├── README.md                   # 프로젝트 문서
│
├── frontend/                   # 프론트엔드 서비스
│   ├── Dockerfile             # Nginx 컨테이너 설정
│   └── index.html             # 채팅 UI
│
└── backend/                    # 백엔드 서비스
    ├── Dockerfile             # Node.js 컨테이너 설정
    ├── package.json           # npm 의존성
    └── server.js              # 채팅 서버 로직
```

## ✨ 주요 기능

### 1. 사용자 인증
- 회원가입 (비밀번호 해싱)
- 로그인 (JWT 토큰 발급)
- 세션 유지 (토큰 기반 인증)

### 2. 실시간 채팅
- Socket.io 기반 실시간 양방향 통신
- 1:1 프라이빗 메시지
- 온라인 사용자 목록 실시간 업데이트

### 3. 채팅 히스토리
- MongoDB에 채팅 내역 저장
- 과거 대화 내역 불러오기
- 사용자별 대화 룸 자동 생성

## 🚀 실행 방법

### 사전 요구사항
- Docker 설치
- Docker Compose 설치

### 1. 레포지토리 클론
```bash
git clone https://github.com/behunkydory/docker-test.git
cd docker-test
```

### 2. Docker Compose로 실행
```bash
# 모든 컨테이너 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build
```

### 3. 애플리케이션 접속
- 프론트엔드: http://localhost
- 백엔드 API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

### 4. 컨테이너 종료
```bash
# 컨테이너 중지
docker-compose down

# 볼륨까지 삭제 (데이터 초기화)
docker-compose down -v
```

## 💻 사용 방법

1. **회원가입**
   - 브라우저에서 http://localhost 접속
   - 아이디와 비밀번호 입력 후 "회원가입" 클릭

2. **로그인**
   - 생성한 계정으로 로그인
   - 채팅 메인 화면으로 이동

3. **채팅 시작**
   - 왼쪽 사이드바에서 접속 중인 사용자 선택
   - 메시지 입력 후 전송

4. **여러 사용자 테스트**
   - 시크릿 모드 또는 다른 브라우저로 추가 계정 로그인
   - 실시간 채팅 기능 확인

## 🔧 Docker Compose 설정 상세

### Services

#### 1. Backend (채팅 서버)
```yaml
backend:
  build: ./backend
  ports:
    - "3000:3000"
  depends_on:
    - db
```
- Node.js 기반 Socket.io 서버
- MongoDB 연결 필요 (depends_on)

#### 2. Frontend (웹 서버)
```yaml
frontend:
  build: ./frontend
  ports:
    - "80:80"
```
- Nginx 알파인 이미지 사용
- 정적 HTML 파일 서빙

#### 3. Database (MongoDB)
```yaml
db:
  image: mongo:latest
  ports:
    - "27017:27017"
  volumes:
    - mongo-data:/data/db
```
- 공식 MongoDB 이미지
- 데이터 영속성을 위한 볼륨 마운트

### Volumes
```yaml
volumes:
  mongo-data:
```
- 컨테이너 재시작 시에도 데이터 보존

## 🔐 보안 기능

- **비밀번호 해싱**: bcryptjs 사용
- **JWT 인증**: 토큰 기반 인증 시스템
- **세션 관리**: 토큰 유효기간 1시간
- **CORS 설정**: 클라이언트-서버 간 안전한 통신

## 📚 학습 내용

### Docker 관련
- Dockerfile 작성 방법
- 멀티 스테이지 빌드
- 컨테이너 간 네트워킹
- 볼륨을 통한 데이터 영속성
- Docker Compose 오케스트레이션

### 백엔드 개발
- Socket.io를 활용한 실시간 통신
- JWT 기반 인증 구현
- MongoDB와 Mongoose 사용
- RESTful 하지 않은 이벤트 기반 통신

### 프론트엔드 개발
- WebSocket 클라이언트 구현
- 실시간 UI 업데이트
- 토큰 관리 및 인증 처리

## 🐛 트러블슈팅

### 포트 충돌 문제
```bash
# 사용 중인 포트 확인
lsof -i :80
lsof -i :3000
lsof -i :27017

# 프로세스 종료
kill -9 <PID>
```

### 컨테이너 로그 확인
```bash
# 모든 서비스 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### 컨테이너 재시작
```bash
# 특정 서비스 재시작
docker-compose restart backend

# 모든 서비스 재시작
docker-compose restart
```

## 🎓 배운 점

1. **Docker의 필요성**: 개발 환경 통일과 배포 간소화
2. **컨테이너 오케스트레이션**: 여러 서비스를 하나의 환경으로 관리
3. **마이크로서비스**: 각 기능을 독립적인 컨테이너로 분리
4. **네트워크 관리**: Docker 내부 네트워크를 통한 컨테이너 간 통신
5. **볼륨 관리**: 데이터 영속성 확보

## 📝 향후 개선 사항

- [ ] 그룹 채팅 기능 추가
- [ ] 파일 전송 기능
- [ ] 읽음/안읽음 표시
- [ ] 푸시 알림
- [ ] 이모지 지원
- [ ] 프로필 이미지
- [ ] Docker Swarm 또는 Kubernetes 배포
- [ ] CI/CD 파이프라인 구축
- [ ] 프로덕션 환경 설정 (환경변수 분리)

## 👨‍💻 개발자

**과제 수행자**: [behunkydory](https://github.com/behunkydory)

**과제 출제**: CTO님

**기간**: 2025년 1월

## 📄 라이선스

This project is for educational purposes.

---

**Note**: 이 프로젝트는 Docker 학습을 위한 과제로 제작되었으며, 프로덕션 환경에서 사용하기 위해서는 추가적인 보안 설정이 필요합니다.
