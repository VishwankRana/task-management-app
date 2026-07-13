# TaskFlow — Feature List

A full-stack project and task management application with authentication, role-based access, real-time dashboards, Kanban boards, time tracking, and collaboration tools.

**Stack:** React 19 · Vite · Tailwind CSS v4 · MUI · Node.js · Express · Prisma · MySQL/MariaDB

---

## Authentication & Account

| Feature | Description |
|---------|-------------|
| **User registration** | Sign up with name, email, and password (always creates `User` role) |
| **Login / logout** | JWT stored in HTTP-only cookies |
| **Password validation** | Minimum 8 characters, must include a letter and a number |
| **Forgot password** | Email-based reset flow with expiring tokens |
| **Reset password** | Secure token verification + auto sign-in after reset |
| **Single active session** | New login invalidates previous sessions (`sessionVersion`) |
| **Session auto-logout** | Superseded sessions redirect to login with a clear message |
| **Protected routes** | Unauthenticated users redirected to login |
| **Account settings** | View profile (name, masked email, role) |
| **Data export** | Download personal data as JSON (`GET /api/auth/me/export`) |
| **Account deletion** | Password-confirmed permanent account removal |

---

## Roles & Permissions

| Role | Capabilities |
|------|--------------|
| **Admin** | Owns projects; creates/edits/deletes projects and tasks; assigns tasks; adds project members; manages users |
| **User** | Project member; sees only tasks assigned to them; can update assigned tasks |

**Access rules:**
- Admins see projects they own and all tasks within those projects
- Users see projects they are members of and only their assigned tasks
- Task edit access enforced on backend via `requireTaskAccess`

---

## Projects

| Feature | Description |
|---------|-------------|
| **Create project** | Name, description, status, priority, start/end dates (Admin only) |
| **Edit project** | Project settings modal — update metadata and dates |
| **Delete project** | Cascade-deletes all tasks in the project |
| **Project card grid** | Visual cards with status and priority badges |
| **Search projects** | Live client-side search by project name |
| **Filter projects** | Filter by status and priority with active-filter badge |
| **Project navigation** | Per-card menu: Tasks, Calendar, Analytics, Settings |
| **Project members** | Admin can search and add users to a project |
| **Member notifications** | In-app + email when added to a project |

**Project statuses:** Planning · Active · In Progress · Completed · On Hold · Cancelled  
**Project priorities:** High · Medium · Low

---

## Tasks

| Feature | Description |
|---------|-------------|
| **Create task** | Title, description, due date, priority, type, status |
| **Edit task** | Update all task fields via modal or task details page |
| **Delete task** | Remove task with confirmation dialog |
| **Task list view** | Table with priority badge, status, due date, type, assignee |
| **Status filter cards** | Click Total / Completed / Pending / In Progress to filter list |
| **Task assignment** | Admin assigns tasks to project members |
| **Task navigation** | Click task row or Kanban card → task details page |

**Task statuses:** Pending · In-progress · Completed · Cancelled  
**Task priorities:** Low · Medium · High · Urgent  
**Task types:** Configurable (default: Task)

---

## Task Details Page

Route: `/projects/:projectId/tasks/:taskId`

| Section | Description |
|---------|-------------|
| **Header** | Task title, status/priority/type chips, edit button, back navigation |
| **Description** | Full-width description card with scroll for long text |
| **Checklist** | Subtask checklist with progress bar, add/toggle/edit/delete items |
| **Task info** | Assignee, due date, priority, type in a 2×2 tile grid |
| **Live timer** | Real-time elapsed clock when status is In-progress |
| **Total time** | Final duration display when task is Completed |
| **Task timeline** | Vertical activity history (create, assign, status, priority, due date, complete) |
| **Task comments** | Per-task discussion thread with compose form |

---

## Time Tracking

| Rule | Behavior |
|------|----------|
| Task created | `startedAt = null`, `completedAt = null`, `timeSpent = 0` |
| Pending → In-progress | Sets `startedAt` (first time only) |
| → Completed | Sets `completedAt`, calculates `timeSpent` in seconds |
| Live display | Frontend timer updates every second (no per-second DB writes) |
| Completed display | Shows total time in human-readable format (e.g. `5h 24m 18s`) |

---

## Checklists (Subtasks)

Lightweight checklist items inside each task — not full child tasks.

| Feature | Description |
|---------|-------------|
| **Add items** | Text input + Add button; Enter key support |
| **Toggle completion** | Checkbox with strikethrough on completed items |
| **Edit text** | Inline editable item text |
| **Delete items** | Per-item delete button |
| **Progress** | `X / Y completed` counter + percentage progress bar |
| **Reorder** | API support for reordering items (`PUT .../checklist/reorder`) |
| **Scrollable list** | Items scroll inside the card when the list is long |

---

## Task History (Timeline)

Automatic activity log on:

- Task created
- Assignee changed
- Status changed
- Priority changed
- Due date updated
- Task completed

Displayed as a chronological vertical timeline with icons and timestamps.

---

## Comments

| Type | Scope |
|------|-------|
| **Project comments** | Slide-in panel on Tasks page; shared project discussion |
| **Task comments** | Inline on task details page; specific to one task |

Both support posting, author display, relative timestamps, and character limits.

---

## Kanban Board

Route: `/projects/:projectId/board`

| Feature | Description |
|---------|-------------|
| **Drag-and-drop** | Move tasks between Pending, In-progress, Completed columns |
| **Status sync** | Dropping a card updates task status via API (triggers time tracking + history) |
| **Card details** | Priority badge, assignee, due date, type on each card |
| **Open task** | Click card to navigate to task details |
| **Drag handle** | Dedicated grip icon so click vs drag don't conflict |

---

## Calendar & Analytics Views

Accessible from project Tasks page via `?view=calendar` and `?view=analytics`.

| View | Description |
|------|-------------|
| **Calendar** | Monthly grid with task count dots; upcoming tasks panel |
| **Analytics** | Bar chart (tasks by status) + pie chart (tasks by priority) |
| **Feature toggles** | Admin can enable/disable Calendar and Analytics per user |

---

## Dashboard

| Widget / Section | Description |
|------------------|-------------|
| **Summary tiles** | Total projects, completed projects, in-progress projects, my tasks |
| **Project overview** | Top projects with status and deadline |
| **Recent activity** | Latest tasks across projects |
| **Today's focus** | Tasks due today with progress bar |
| **Week at a glance** | 7-day bar chart of upcoming due tasks |
| **Project charts** | Project status bar chart + priority pie chart |
| **Alert banners** | Overdue and due-soon tasks/projects (dismissible per session) |
| **Notification panel** | In-app notification list with read/unread state |

---

## Notifications

### In-app
- Task assigned, status changed, priority changed, fields updated
- Project member added
- Read individual or mark all as read

### Email (when configured)
- Task assigned to user
- Task status / priority / field updates
- Task completed (notifies project owner)
- Due-soon reminders (daily cron, 9:00 AM)
- Overdue task alerts (daily cron, 9:15 AM)
- Weekly pending task summary (Monday 9:30 AM)

---

## Admin — Users Management

Route: `/users` (Admin only)

| Feature | Description |
|---------|-------------|
| **User list** | All registered users with role badges |
| **Search users** | Filter by name or email |
| **Role filter** | Filter by Admin / User |
| **Feature access** | Toggle Calendar and Analytics per user |
| **PII-safe display** | Redacted emails in list views |

Admin accounts are created via `scripts/seed-admin.mjs` (not via public registration).

---

## Security & Privacy

| Feature | Description |
|---------|-------------|
| **Helmet** | Security headers on API responses |
| **Rate limiting** | Login, register, and forgot-password endpoints |
| **Field whitelisting** | Request body fields filtered on create/update |
| **PII redaction** | Safe logging and masked email in UI |
| **User DTOs** | Public-safe user objects (no password/hash exposure) |
| **Audit log** | Backend records auth events (login, register, export, delete, etc.) |
| **Session invalidation** | Logout rotates session version |
| **CORS + credentials** | Cookie-based auth with configured origin |

---

## UI & UX

| Feature | Description |
|---------|-------------|
| **Dark mode** | Full-app toggle; persisted in `localStorage` |
| **Responsive layout** | Mobile-friendly grids and cards |
| **Collapsible sidebar** | Expand/collapse navigation |
| **Toast notifications** | Success/error feedback via react-hot-toast |
| **Custom dropdowns** | FilterDropdown pattern (no native `<select>`) |
| **Brand design** | Navy `#1D3557` + orange `#d97757` accent system |
| **Loading states** | Per-section loading on task details, comments, checklist |
| **Empty states** | Friendly messages when no data exists |

---

## API Overview

| Area | Base path |
|------|-----------|
| Auth | `/api/auth/*` |
| Projects | `/api/taskmanager/projects/*` |
| Tasks | `/api/taskmanager/tasks/*` |
| Project comments | `/api/taskmanager/projects/:id/comments` |
| Task comments | `/api/taskmanager/tasks/:id/comments` |
| Checklist | `/api/taskmanager/tasks/:id/checklist` |
| Task history | `/api/taskmanager/tasks/:id/history` |
| Notifications | `/api/notifications` |
| Users (admin) | `/api/auth/users` |

---

## Database Models

| Model | Purpose |
|-------|---------|
| `User` | Accounts, roles, session version, feature flags |
| `Project` | Project metadata and ownership |
| `ProjectMember` | User ↔ project membership |
| `Task` | Tasks with assignee, time tracking fields |
| `TaskHistory` | Activity timeline entries |
| `TaskComment` | Per-task comments |
| `ChecklistItem` | Task subtask checklist items |
| `Comment` | Project-level comments |
| `Notification` | In-app notifications |
| `EmailLog` | Email send deduplication log |
| `PasswordResetToken` | Password reset tokens |
| `AuditLog` | Security audit trail |

---

## Routes (Frontend)

| Path | Page |
|------|------|
| `/login` | Sign in |
| `/register` | Sign up |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |
| `/` | Dashboard |
| `/projects` | Projects grid |
| `/projects/:id/tasks` | Task list / calendar / analytics |
| `/projects/:id/tasks/:taskId` | Task details |
| `/projects/:id/board` | Kanban board |
| `/settings` | Account & privacy |
| `/users` | User management (Admin) |

---

*Last updated: July 2026*
