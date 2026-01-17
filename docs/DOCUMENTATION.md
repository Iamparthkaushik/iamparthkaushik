# Parth Kaushik Portfolio

<div align="center">

### Interactive Portfolio with Games, 3D Experiences & Real-Time Leaderboards

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[![GitHub](https://img.shields.io/badge/GitHub-iamparthkaushik-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/iamparthkaushik)
[![Portfolio](https://img.shields.io/badge/Live_Demo-Visit-FF3D77?style=for-the-badge&logo=vercel&logoColor=white)](https://iamparthkaushik.vercel.app)

</div>

<hr />

## 🌟 Features

### 🎮 Interactive Games
- **Flappy Bird** - Classic tap-to-fly game with smooth animations
- **Double-Headed Snake** - Unique twist: heads swap when you eat! Mobile touch controls included
- **Memory Match** - Card matching with multiple difficulty levels
- **Reaction Test** - Measure your reaction time in milliseconds
- **Typing Race** - Test your typing speed (WPM)

### 🌐 3D Experiences
- **3D World** - Interactive Three.js environment
- **Physics Simulator** - Real-time physics with Matter.js
- **Particle System** - Beautiful particle effects
- **Audio Visualizer** - Music-reactive visualizations
- **Galaxy Generator** - Procedural galaxy creation

### 🏆 Real-Time Leaderboards
- SQLite database for persistent score storage
- Personal best tracking - only saves if you beat your record
- Global leaderboards for all games
- User authentication with JWT

### 💬 Community Features
- **Message Board** - Leave public messages for visitors
- User registration and login system
- Secure password hashing with bcrypt

### 📱 Mobile Responsive
- Touch controls for games (swipe & D-pad)
- Responsive bento grid layouts
- Mobile-optimized UI

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | SQLite (better-sqlite3) |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Styling** | Tailwind CSS 3.4, Framer Motion |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **State** | Zustand, React Context |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/iamparthkaushik/iamparthkaushik.git

# Navigate to directory
cd iamparthkaushik

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/             # Login, register, me endpoints
│   │   ├── leaderboard/      # Score submission & retrieval
│   │   └── messages/         # Message board API
│   ├── components/           # Reusable components
│   ├── context/              # React context providers
│   ├── experiences/          # 3D experience pages
│   ├── games/                # Game pages
│   ├── leaderboard/          # Leaderboard page
│   └── messages/             # Message board page
├── lib/
│   ├── auth.ts               # JWT & password utilities
│   └── db.ts                 # SQLite database setup
├── data/                     # SQLite database file (auto-created)
└── public/                   # Static assets
```

## 🔒 Authentication System

The portfolio includes a complete authentication system:

- **Registration**: Username, email, password (6+ chars)
- **Login**: Email & password verification
- **JWT Tokens**: 7-day expiry, stored in localStorage
- **Protected Actions**: Score submission, message posting

## 🎯 Leaderboard Logic

Scores are only saved when users beat their personal best:
- For most games: Higher score = better
- For Reaction Test: Lower time = better

## 📱 Mobile Controls

Games are fully playable on mobile devices:
- **Snake**: Swipe gestures + on-screen D-pad
- **Flappy Bird**: Tap anywhere to flap
- **Memory/Reaction/Typing**: Touch-friendly UI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by Parth Kaushik</sub>
</div>
