# Wasla (وصلة) — URL Shortener

> **Wasla** means *"connection"* or *"link"* in Arabic.

A production-grade URL shortener built for scale. Wasla features a distributed database architecture, sub-10ms Redis redirects, JWT authentication, and a modern Angular dashboard.

---

## ✨ Features

- ⚡ **Blazing-fast redirects** — Redis-first lookup with PostgreSQL fallback
- 🗃️ **Database sharding** — Links distributed across multiple PostgreSQL shards via consistent hashing
- 🔐 **JWT Authentication** — Stateless auth with bcrypt password hashing
- 📊 **User Dashboard** — View and manage all your shortened links in one place
- 🌍 **Bilingual** — Full Arabic (RTL) and English (LTR) support
- 🐳 **Dockerized** — Entire backend stack runs with `docker compose up`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19, Tailwind CSS v4, DaisyUI |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (sharded), Prisma ORM |
| Cache | Redis |
| Auth | JWT, bcryptjs |
| Infrastructure | Docker, Nginx |

---

## 🚀 Getting Started

### 1. Start the infrastructure
```bash
docker compose up -d
```

### 2. Run database migrations
```bash
cd backend
npx prisma migrate dev
```

### 3. Start the backend
```bash
cd backend
npm run dev
```

### 4. Start the frontend
```bash
cd frontend
npm start
```

App runs at **http://localhost:4200** · API at **http://localhost:3000**

---

## 📁 Project Structure

```
wasla/
├── backend/          # Express API, auth, URL controller
│   ├── prisma/       # Schema & migrations
│   └── src/
│       ├── config/   # Shards, Redis
│       ├── controllers/
│       └── middleware/
├── frontend/         # Angular SPA
│   └── src/app/
│       ├── auth/     # Login & Register
│       ├── dashboard/
│       └── core/     # AuthService, Interceptor
└── docker-compose.yml
```

---

## 📄 License

MIT
