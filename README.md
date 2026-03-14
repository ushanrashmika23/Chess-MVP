# Chess Academy Training MVP

Production-oriented MVP for a chess academy training platform with puzzle authoring, puzzle solving, progress tracking, and Lichess profile integration.

## 1) Project structure

```text
Chess-MVP/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── app.ts
│   │   ├── config.ts
│   │   ├── prisma.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── .env.local.example
│   └── package.json
└── README.md
```

## 2) Tech stack

- Frontend: Next.js + TypeScript + TailwindCSS + chessground + chess.js
- Backend: Node.js + Express.js + TypeScript
- DB: PostgreSQL + Prisma
- Auth: JWT with role based access (`admin`, `student`)

## 3) Setup locally

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

API will run at `http://localhost:4000`.

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

App will run at `http://localhost:3000`.

## 4) API routes

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Users
- `GET /users/profile`
- `GET /users/dashboard`

### Puzzles
- `GET /puzzles`
- `GET /puzzles/:id`
- `POST /puzzles`
- `PUT /puzzles/:id`
- `DELETE /puzzles/:id`

### Attempts
- `POST /attempts`
- `GET /attempts/user`

### Lichess
- `GET /lichess/:username`

## 5) MVP workflow

1. Register as student or admin.
2. Admin creates puzzles and optionally assigns to specific students.
3. Student opens puzzle and solves on interactive chessboard.
4. Move validation is enforced with chess.js against solution sequence.
5. Attempts are persisted for accuracy and solved metrics.
6. Student profile can show Lichess rating snapshot.

## 6) Example seed users

- Admin: `coach@academy.com` / `Admin@123`
- Student: `student@academy.com` / `Student@123`

## 7) Notes

- This platform is intentionally focused on puzzle training, not full game play.
- Add Redis/job queues and audit logging for production scale hardening.
