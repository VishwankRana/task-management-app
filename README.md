# Task Manager

A full-stack project and task management application. Create projects, assign tasks, track time, collaborate via comments, and monitor progress through dashboards, Kanban boards, calendars, and analytics — with role-based access, authentication, and production deployment support for **Render** (API) and **Vercel** (frontend).

![Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)
![Stack](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![Stack](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![Stack](https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=flat-square&logo=mysql)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Scripts](#scripts)
- [Frontend Routes](#frontend-routes)
- [API Overview](#api-overview)
- [Roles & Permissions](#roles--permissions)
- [Deployment](#deployment)
- [Security & Privacy](#security--privacy)
- [Further Documentation](#further-documentation)

---

## Features

### Authentication & Account
- User registration and login (JWT in HTTP-only cookies)
- Password reset via email (Resend)
- Single active session per account (`sessionVersion`)
- Protected routes and admin-only routes
- Account settings: data export (JSON) and password-confirmed account deletion

### Projects & Tasks
- Full project CRUD (Admin)
- Task CRUD with status, priority, type, due date, and assignee
- Project member management and user search (Admin)
- Task list, calendar, and analytics views per project
- Kanban board with drag-and-drop status updates
- Task details page with description, info tiles, and edit modal

### Collaboration
- Project-level comments (slide-in panel)
- Task-level comments (on task details page)
- In-app notifications with read/unread state
- Email notifications when Resend is configured (assignments, updates, reminders)

### Time Tracking & History
- Automatic time tracking on status changes (`startedAt`, `completedAt`, `timeSpent`)
- Live timer on task details when status is **In-progress**
- Vertical activity timeline (create, assign, status, priority, due date, complete)

### Checklists
- Per-task checklist items: add, toggle, edit, delete, reorder
- Progress bar and completion counter

### Dashboard
- Summary stat tiles (projects, tasks)
- Project overview, recent activity, today's focus, week-at-a-glance
- Status and priority charts
- Overdue / due-soon alert banners
- Notification panel

### Admin
- User management (`/users`) with search and role filter
- Per-user feature toggles (Calendar, Analytics views)
- Admin accounts created via seed script only (not public registration)

### UI
- Dark mode throughout (Tailwind + MUI)
- Responsive layout with collapsible sidebar
- Toast notifications and branded orange/navy design system

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, MUI v7, Joy UI, lucide-react, React Router v7, axios, react-hot-toast, Chart.js, @hello-pangea/dnd |
| **Backend** | Node.js, Express 5, Prisma 7, MariaDB adapter, bcrypt, jsonwebtoken, helmet, cors, node-cron |
| **Database** | MySQL / MariaDB |
| **Email** | Resend (optional) |
| **Deploy** | Render (API), Vercel (frontend) |

---

## Architecture

```
┌─────────────────────┐         HTTPS + cookies          ┌──────────────────────┐
│  Vercel (Frontend)  │  ─────────────────────────────► │  Render (Express API) │
│  React + Vite       │         VITE_API_URL              │  /api/*               │
└─────────────────────┘                                   └──────────┬───────────┘
                                                                     │
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │  MySQL / MariaDB      │
                                                          └──────────────────────┘
```

- **Frontend** calls the API through a centralized client (`src/frontend/utils/api.js`) using `VITE_API_URL`.
- **Auth** uses HTTP-only cookies with `SameSite=None; Secure` in production for cross-origin Vercel → Render requests.
- **All API routes** are prefixed with `/api` (task routes under `/api/taskmanager`).

---

## Project Structure

```
task-manager/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── migrations/            # SQL migrations
├── scripts/
│   ├── seed-admin.mjs           # Create/promote admin user
│   ├── check-user.mjs
│   └── test-api-token.mjs
├── src/
│   ├── backend/
│   │   ├── server.js            # Express entry point
│   │   ├── config/
│   │   │   └── env.js           # Env validation
│   │   ├── middleware/          # Auth, rate limits, access control
│   │   ├── services/            # Email, audit, sessions, notifications
│   │   ├── cron/                # Scheduled reminder jobs
│   │   └── utils/               # JWT, DTOs, validation, redaction
│   └── frontend/
│       ├── app.jsx              # Routes
│       ├── components/          # UI components
│       ├── context/             # Auth, Project, Theme providers
│       ├── hooks/               # useTasks, useChecklist, etc.
│       ├── layout/              # Pages and layouts
│       ├── pages/               # Login, Register, Account settings
│       └── utils/               # API client, redact, timeFormat
├── docs/
│   ├── feature.md               # Full feature reference
│   └── project-context.md       # Technical reference
├── render.yaml                  # Render Blueprint (API)
├── vercel.json                  # Vercel SPA config
├── .env.example
└── package.json
```

---

## Prerequisites

- **Node.js** 20+ (22 recommended)
- **npm** 9+
- **MySQL or MariaDB** (local Docker, native install, or cloud provider)
- **Resend API key** (optional — required for password reset emails)

---

## Local Development

### 1. Clone and install

```bash
git clone <repository-url>
cd task-manager
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL and a JWT secret (minimum 32 characters). See [Environment Variables](#environment-variables).

### 3. Run database migrations

```bash
npx prisma migrate deploy
# or for development:
npx prisma migrate dev
```

### 4. Seed an admin user (optional)

```bash
node scripts/seed-admin.mjs admin@example.com YourSecurePassword "Admin Name"
```

Public registration always creates a **User** role. Admin accounts must be seeded.

### 5. Start the servers

**Terminal 1 — API (port 3000):**
```bash
npm run dev:api
```

**Terminal 2 — Frontend (port 5173):**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The Vite dev server proxies `/api` requests to `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Signing key (min 32 characters) |
| `APP_URL` | Prod | Frontend URL (CORS + email links) |
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | API port (default `3000`; Render sets automatically) |
| `CORS_ORIGINS` | Prod | Comma-separated allowed origins |
| `CORS_ALLOW_VERCEL` | Prod | `true` to allow all `*.vercel.app` previews |
| `COOKIE_CROSS_SITE` | Prod | `true` for Vercel + Render cross-origin auth |
| `RESEND_API_KEY` | No | Resend email API key |
| `EMAIL_FROM` | No | Sender address for emails |
| `PASSWORD_RESET_EXPIRY_MINUTES` | No | Reset token TTL (default `30`) |
| `VITE_API_URL` | Vercel | API base URL for frontend build |

See `.env.example` for full examples including Render and Vercel values.

---

## Database

Models include: **User**, **Project**, **Task**, **ProjectMember**, **Comment**, **TaskComment**, **ChecklistItem**, **TaskHistory**, **Notification**, **AuditLog**, **PasswordResetToken**, **EmailLog**.

```bash
# Apply migrations (production)
npm run db:migrate

# Open Prisma Studio
npx prisma studio

# Regenerate client after schema changes
npx prisma generate
```

> **Render note:** Render does not host MySQL natively. Use an external provider (Aiven, Railway, PlanetScale-compatible host, etc.) and set `DATABASE_URL` on Render.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run dev:api` | Start Express API locally |
| `npm run build` | Build frontend for production |
| `npm start` | Start API |
| `npm run start:prod` | Run migrations + start API |
| `npm run db:migrate` | Deploy Prisma migrations |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

---

## Frontend Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/forgot-password` | Public | Request password reset |
| `/reset-password` | Public | Reset password with token |
| `/` | Auth | Dashboard |
| `/projects` | Auth | Project grid |
| `/projects/:projectId/tasks` | Auth | Task workspace (list / calendar / analytics) |
| `/projects/:projectId/tasks/:taskId` | Auth | Task details |
| `/projects/:projectId/board` | Auth | Kanban board |
| `/settings` | Auth | Account settings (export / delete) |
| `/users` | Admin | User management |

---

## API Overview

Base URL: `http://localhost:3000` (local) or your Render URL (production).

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (DB connectivity) |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register (User role only) |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Current user |
| `GET` | `/api/auth/me/export` | Export personal data (JSON) |
| `DELETE` | `/api/auth/account` | Delete account |
| `POST` | `/api/auth/forgot-password` | Request reset email |
| `POST` | `/api/auth/reset-password` | Reset with token |
| `GET` | `/api/auth/users` | List users (Admin) |

### Projects & Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/taskmanager/projects` | List / create projects |
| `GET/PUT/DELETE` | `/api/taskmanager/projects/:id` | Project CRUD |
| `GET/POST` | `/api/taskmanager/projects/:id/tasks` | List / create tasks |
| `GET/PUT/DELETE` | `/api/taskmanager/tasks/:id` | Task CRUD |
| `GET` | `/api/taskmanager/tasks/:id/history` | Task activity timeline |
| `GET/POST` | `/api/taskmanager/tasks/:taskId/comments` | Task comments |
| `GET/POST/PUT/PATCH/DELETE` | `/api/taskmanager/tasks/:taskId/checklist/*` | Checklist items |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | List notifications |
| `PATCH` | `/api/notifications/:id/read` | Mark one read |
| `PATCH` | `/api/notifications/read-all` | Mark all read |

All task/project routes require authentication. Access is enforced by role and project membership on the backend.

---

## Roles & Permissions

| Role | Capabilities |
|------|--------------|
| **Admin** | Owns projects; creates/edits/deletes projects and tasks; assigns tasks; adds members; manages users |
| **User** | Project member; sees only assigned tasks; can update assigned tasks |

- Admins see projects they **own** and all tasks within them.
- Users see projects they are **members** of and only tasks **assigned to them**.
- Backend middleware: `authenticate`, `authorize`, `requireProjectAccess`, `requireTaskAccess`.

---

## Deployment

### Render (API backend)

1. Connect your GitHub repo to Render (or use `render.yaml` Blueprint).
2. Create a **Web Service** with:
   - **Build:** `npm install && npx prisma generate`
   - **Start:** `npx prisma migrate deploy && node src/backend/server.js`
   - **Health check:** `/api/health`
3. Set environment variables:

```env
NODE_ENV=production
COOKIE_CROSS_SITE=true
CORS_ALLOW_VERCEL=true
DATABASE_URL=mysql://...
JWT_SECRET=<64-char-random>
APP_URL=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app
RESEND_API_KEY=re_...          # optional
EMAIL_FROM=Task Manager <...>
```

4. Note your API URL: `https://task-manager-api.onrender.com`

### Vercel (frontend)

1. Import the repo into Vercel.
2. `vercel.json` configures the build (`src/frontend/dist`) and SPA rewrites.
3. Set environment variable (Production **and** Preview):

```env
VITE_API_URL=https://task-manager-api.onrender.com
```

4. Deploy.

### Post-deploy

```bash
# Seed admin against production DB (run locally with production DATABASE_URL)
node scripts/seed-admin.mjs admin@yourdomain.com SecurePassword123
```

---

## Security & Privacy

| Area | Implementation |
|------|----------------|
| **Passwords** | bcrypt hashing; min 8 chars + letter + number |
| **Sessions** | JWT in HTTP-only cookies; single active session |
| **Rate limiting** | Login, register, forgot-password (per IP) |
| **Access control** | Role + project/task middleware on all protected routes |
| **PII** | User DTOs, email redaction in UI/logs, data export & deletion |
| **Headers** | Helmet on API responses |
| **CORS** | Allowlist + optional Vercel preview support |
| **Audit log** | Auth events recorded server-side |
| **Errors** | Generic 500 messages (no stack traces to clients) |

For a deeper breakdown of PII handling, OWASP Top 10 mitigations, and production readiness gaps, see `docs/feature.md` (Security section) and `docs/project-context.md`.

---

## Further Documentation

| Document | Description |
|----------|-------------|
| [`docs/feature.md`](docs/feature.md) | Complete feature list with behavior details |
| [`docs/project-context.md`](docs/project-context.md) | Technical reference, API, schema, conventions |
| [`.env.example`](.env.example) | All environment variables with comments |
| [`ai-context/change-log.md`](ai-context/change-log.md) | Development change history |

---

## License

Private project. All rights reserved.
