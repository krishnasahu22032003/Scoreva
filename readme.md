<div align="center">

# 🏏 Scoreva

### Modern Real-Time Match Commentary Platform

*Live scores. Live commentary. Live emotion.*

[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-Framework-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Typed-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Realtime-FF4154?style=for-the-badge&logo=socket.io&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

</div>

---

## 📖 Overview

**Scoreva** is a modern, real-time match commentary platform built for the thrill of live sports. Admins can create matches and deliver ball-by-ball (or moment-by-moment) commentary instantly, while users watch the action unfold live — no refresh needed.

Powered by **WebSockets**, Scoreva pushes every update the moment it happens, giving your audience a live-stadium feel from anywhere in the world.

---

## ✨ Features

- 🎙️ **Live Commentary Engine** — Admins broadcast real-time match updates instantly via WebSockets
- 🏟️ **Match Management** — Create, edit, and manage matches from a dedicated admin dashboard
- 👀 **Real-Time Viewer Experience** — Users receive live updates the instant they're published, with zero page reloads
- 🔐 **Role-Based Dashboards** — Separate, purpose-built experiences for Admins and Users
- ⚡ **Blazing Fast & Type-Safe** — End-to-end TypeScript across backend and frontend
- 🎨 **Sleek, Modern UI** — Smooth animations powered by Framer Motion and clean iconography with Lucide React
- 🗄️ **Robust Data Layer** — Prisma ORM with PostgreSQL for reliable, structured match data
- 📱 **Responsive Design** — Fully optimized for mobile, tablet, and desktop viewing

---

## 🖼️ Screenshots

<div align="center">

### 🏠 Landing Page
<img src="./screenshots/landing.png" alt="Scoreva Landing Page" width="800"/>

### 🛠️ Admin Dashboard
<img src="./screenshots/admin-dashboard.png" alt="Scoreva Admin Dashboard" width="800"/>

### 📺 User Dashboard
<img src="./screenshots/user-dashboard.png" alt="Scoreva User Dashboard" width="800"/>

</div>

---

## 🧰 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express** | Web server & REST API framework |
| **TypeScript** | Static typing & safer code |
| **Prisma** | Type-safe ORM for database access |
| **PostgreSQL** | Relational database |
| **WebSockets** | Real-time bidirectional communication |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js** | React framework for the frontend |
| **React DOM** | UI rendering |
| **Framer Motion** | Smooth, elegant animations |
| **Lucide React** | Beautiful, consistent icon set |

---

## 🏗️ Architecture

```
┌─────────────────┐        WebSocket / REST        ┌──────────────────┐
│                 │◄───────────────────────────────►│                  │
│  Next.js Client │                                  │  Express Server  │
│  (Admin & User) │                                  │   (TypeScript)   │
│                 │                                  │                  │
└─────────────────┘                                  └────────┬─────────┘
                                                                │
                                                                │ Prisma ORM
                                                                ▼
                                                       ┌──────────────────┐
                                                       │   PostgreSQL     │
                                                       │    Database      │
                                                       └──────────────────┘
```

1. **Admin** creates a match and starts broadcasting live commentary
2. Commentary updates are pushed through a **WebSocket connection**
3. **Users** subscribed to that match receive updates instantly on their dashboard
4. All match & commentary data is persisted via **Prisma** to **PostgreSQL**

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- PostgreSQL database instance
- npm / yarn / pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/scoreva.git
cd scoreva
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/scoreva"
PORT=5000
JWT_SECRET="your_jwt_secret"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_WS_URL="ws://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

Visit **`http://localhost:3000`** to see Scoreva in action. 🎉

---

## 📂 Project Structure

```
scoreva/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── prisma/
│   │   └── index.ts
│   └── prisma/
│       └── schema.prisma
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
│
└── screenshots/
    ├── landing-page.png
    ├── admin-dashboard.png
    └── user-dashboard.png
```

---

## 🗺️ Roadmap

- [ ] Push notifications for match milestones
- [ ] Match statistics & analytics dashboard
- [ ] Multi-language commentary support
- [ ] Public API for third-party integrations

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues) or open a pull request.

---

## 📬 Contact

**Krishna Sahu**
📧 [krishna.sahu.work@gmail.com](mailto:krishna.sahu.work@gmail.com)

---

<div align="center">

Made with ❤️ by **Krishna Sahu**

</div>



