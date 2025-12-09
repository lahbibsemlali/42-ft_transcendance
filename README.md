# 🏓 ft_transcendence

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![42 Project](https://img.shields.io/badge/42-Project-000000?logo=42&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)

A real-time multiplayer Pong game with chat, user profiles, and matchmaking features built as the final project of the 42 Network curriculum.

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Installation](#-installation) •
[Usage](#-usage) •
[Architecture](#-architecture) •
[Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 About

**ft_transcendence** is a full-stack web application that recreates the classic Pong game with modern features. Built as part of the 42 Network curriculum, this project demonstrates proficiency in:

- Full-stack web development
- Real-time communication
- User authentication & authorization
- Database design & management
- DevOps & containerization
- Responsive UI/UX design

## ✨ Features

### 🎮 Game
- **Real-time Multiplayer**: Play Pong with other users in real-time
- **Matchmaking System**: Queue up and get matched with other players
- **Game Invitations**: Challenge specific users to a match
- **Live Spectating**: Watch ongoing games
- **Game History**: Track your wins, losses, and statistics

### 💬 Chat
- **Real-time Messaging**: Instant messaging using WebSockets
- **Public & Private Channels**: Create and join different chat rooms
- **Direct Messages**: Private conversations with other users
- **User Management**: Mute, ban, or make users administrators
- **Group Creation**: Create custom chat groups

### 👤 User Management
- **Profile Customization**: Upload avatars and update user information
- **Authentication**: Secure login with email/password
- **Two-Factor Authentication (2FA)**: Enhanced account security
- **Friend System**: Add friends and see their online status
- **User Statistics**: View detailed game statistics and achievements

### 🔒 Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Role-based access control
- **XSS Protection**: Input sanitization and validation

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests
- **P5.js** - Creative coding library for game rendering

### Backend
- **Node.js 20** - JavaScript runtime
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Socket.io** - WebSocket server
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for auth
- **Bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Node.js** (v20 or higher) - for local development
- **Git** - for version control

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/lahbibsemlali/42-ft_transcendance.git
cd 42-ft_transcendance
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```bash
# Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=transcendence
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# Backend
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=3000

# Frontend
VITE_DOMAIN=http://localhost:8000
VITE_API_URL=http://localhost:3000

# Optional: 42 OAuth (if implementing)
FORTY_TWO_CLIENT_ID=your_42_client_id
FORTY_TWO_CLIENT_SECRET=your_42_client_secret
FORTY_TWO_CALLBACK_URL=http://localhost:3000/auth/42/callback
```

### 3. Build and run with Docker

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

### 4. Initialize the database

The Prisma migrations will run automatically on startup. If you need to run them manually:

```bash
# Access the backend container
docker exec -it back-end bash

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

## 💻 Usage

### Access the Application

Once the containers are running:

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Development Mode

For local development with hot-reload:

```bash
# Frontend
cd client/app
npm install
npm run dev

# Backend
cd server/app
npm install
npm run start:dev
```

### Useful Commands

```bash
# View logs
docker compose logs -f

# Stop all services
docker compose down

# Remove volumes (clean slate)
docker compose down -v

# Rebuild a specific service
docker compose build backend
docker compose up -d backend

# Access container shell
docker exec -it back-end bash
docker exec -it front-end sh
```

## 🏗 Architecture

```
ft_transcendance/
├── client/                 # Frontend application
│   ├── app/
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── assets/       # Static assets
│   │   │   └── main.tsx      # Entry point
│   │   └── package.json
│   └── Dockerfile
│
├── server/                 # Backend application
│   ├── app/
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── user/         # User management
│   │   │   ├── chat/         # Chat functionality
│   │   │   ├── Game/         # Game logic & WebSockets
│   │   │   ├── two-fa/       # 2FA implementation
│   │   │   └── main.ts       # Entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma # Database schema
│   │   └── package.json
│   └── Dockerfile
│
├── docker-compose.yml      # Container orchestration
├── .gitignore
└── README.md
```

### Database Schema

```prisma
model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique
  email         String    @unique
  password      String
  avatar        String?
  twoFAEnabled  Boolean   @default(false)
  twoFASecret   String?
  status        String    @default("offline")
  createdAt     DateTime  @default(now())
  
  games         Game[]
  friends       User[]
  messages      Message[]
}

model Game {
  id            Int       @id @default(autoincrement())
  player1Id     Int
  player2Id     Int
  score1        Int
  score2        Int
  status        String
  createdAt     DateTime  @default(now())
  
  player1       User      @relation(fields: [player1Id])
  player2       User      @relation(fields: [player2Id])
}

model Message {
  id            Int       @id @default(autoincrement())
  content       String
  userId        Int
  channelId     Int
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId])
  channel       Channel   @relation(fields: [channelId])
}
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup     - Register new user
POST   /api/auth/login      - Login user
POST   /api/auth/logout     - Logout user
GET    /api/auth/profile    - Get current user profile
POST   /api/auth/2fa/enable - Enable 2FA
POST   /api/auth/2fa/verify - Verify 2FA token
```

### User Endpoints

```
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user by ID
PATCH  /api/users/:id       - Update user profile
POST   /api/users/:id/avatar - Upload user avatar
GET    /api/users/:id/stats  - Get user statistics
```

### Game Endpoints

```
GET    /api/game/history    - Get game history
GET    /api/game/:id        - Get game details
POST   /api/game/invite     - Invite user to game
```

### Chat Endpoints

```
GET    /api/chat/channels   - Get all channels
POST   /api/chat/channels   - Create new channel
GET    /api/chat/messages   - Get chat messages
POST   /api/chat/messages   - Send message
```

### WebSocket Events

```
// Game events
connect
disconnect
game:join
game:move
game:start
game:score
game:end

// Chat events
message:send
message:receive
user:typing
user:online
user:offline
```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `POSTGRES_USER` | PostgreSQL username | Yes | - |
| `POSTGRES_PASSWORD` | PostgreSQL password | Yes | - |
| `POSTGRES_DB` | Database name | Yes | - |
| `DATABASE_URL` | Full database connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | 7d |
| `PORT` | Backend server port | No | 3000 |
| `VITE_DOMAIN` | Frontend domain URL | Yes | - |
| `VITE_API_URL` | Backend API URL | Yes | - |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [lsemlali](https://github.com/lahbibsemlali)**

If you found this project helpful, please consider giving it a ⭐!

</div>
