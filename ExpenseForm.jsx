# Expense Tracker Dashboard

Log expenses, categorize spending, set monthly budgets, and see where your
money goes — with charts that update as you add transactions. Built as a
minimal, production-shaped reference implementation: Express on the
backend, React + Vite on the frontend, JWT auth, no external database
required to get running.

![status](https://img.shields.io/badge/status-MVP-34D399)

## Features

- **Auth** — email/password signup and login (JWT-based)
- **Quick expense entry** — amount, category, date, note, payment method;
  optional recurring flag
- **Custom categories** — seeded with 7 defaults (Food, Transport, Bills,
  Shopping, Entertainment, Health, Other), add your own anytime
- **Dashboard** — this month's total vs. last month, top spending
  category, a category breakdown donut chart, a daily spend bar chart,
  and a recent-transactions feed
- **Budgets** — set a monthly budget per category with a progress bar
  that shifts from mint → amber → red as you approach/exceed it
- **Filtering & search** — by date range, category, and note text

## Stack

| Layer    | Tech                                              |
| -------- | -------------------------------------------------- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Recharts |
| Backend  | Node.js, Express, JWT (jsonwebtoken), bcryptjs      |
| Storage  | JSON file via lowdb (swappable — see [Scaling](#scaling-notes)) |

## Project structure

```
expense-tracker/
├── server/
│   ├── src/
│   │   ├── index.js               # entry point
│   │   ├── db.js                  # lowdb JSON-file store
│   │   ├── middleware/auth.js     # JWT verify + sign
│   │   ├── routes/
│   │   │   ├── auth.js            # register, login, me
│   │   │   ├── categories.js
│   │   │   ├── expenses.js
│   │   │   ├── budgets.js
│   │   │   └── summary.js         # dashboard aggregation
│   │   ├── utils/
│   │   └── data/                  # db.json is created here at runtime
│   ├── package.json
│   └── .env.example
└── client/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                 # routes
    │   ├── context/AuthContext.jsx
    │   ├── lib/api.js              # REST client
    │   ├── components/
    │   └── pages/
    ├── index.html
    ├── package.json
    └── .env.example
```

## Getting started

Requires Node.js 18+.

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev        # nodemon, restarts on change
# or: npm start
```

Server runs at `http://localhost:4000`. On first run it creates
`server/src/data/db.json` automatically — no database setup needed.

### 2. Frontend

In a separate terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs at `http://localhost:5173` and talks to the server URL set in
`VITE_SERVER_URL` (`client/.env`), which defaults to `http://localhost:4000`.

Open `http://localhost:5173`, create an account, and start logging
expenses. Default categories are seeded automatically on signup.

## How it works

- **Auth** — `POST /api/auth/register` and `/login` return a JWT. The
  client stores it in `sessionStorage` and sends it as a `Bearer` token
  on every request. `GET /api/auth/me` restores the session on page
  refresh.
- **Expenses & categories** — straightforward REST CRUD, scoped per user
  via the JWT's `userId`.
- **Budgets** — stored per `(userId, categoryId, month)`; `PUT
  /api/budgets` upserts.
- **Dashboard** — `GET /api/summary?month=YYYY-MM` does the aggregation
  server-side (totals, category breakdown, daily series, month-over-month
  change) so the frontend just renders what it's given.

## Scaling notes

The JSON-file store (`server/src/db.js`) is intentionally dependency-light
— no native bindings, nothing extra to install — which makes it a good
fit for local dev, demos, and small single-instance deployments. It has
two real limits:

- It's not safe for concurrent writes at scale (fine for a single user or
  small team; not fine for many simultaneous users)
- It only works with one server instance — there's no shared state across
  processes

To go further, swap `db.js` for **Postgres** (e.g. via Prisma or Knex) —
the routes only ever call `db.get('expenses')...`-style methods, so the
route files themselves barely need to change. This is also where you'd
add real bank-sync (Plaid), multi-currency, or shared/household budgets,
none of which are in this MVP.

## Deployment

- **Backend** — any Node host (Render, Railway, Fly.io, a VPS). Set
  `JWT_SECRET` to a long random string and `CLIENT_ORIGIN` to your
  deployed frontend's URL. If you keep the JSON-file store, make sure the
  host has a persistent disk (not all serverless platforms do).
- **Frontend** — any static host (Vercel, Netlify, Cloudflare Pages). Set
  `VITE_SERVER_URL` to your deployed backend's URL at build time.

## License

MIT — see [LICENSE](./LICENSE).
