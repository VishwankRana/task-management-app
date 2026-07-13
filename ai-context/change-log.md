# AI Change Log

---

# AI Change Log

---

# AI Change Log

---

# AI Change Log

---

# AI Change Log

---

# AI Change Log

---

## 2026-07-13T14:30:00+05:30

### Summary
Render + Vercel production deployment: centralized `api.js` with `VITE_API_URL`, backend env validation/health/CORS, cross-site auth cookies (`SameSite=None`) for split hosting, `render.yaml` for API, `vercel.json` for SPA frontend, and Vercel preview CORS support.

### Files Changed
- `src/backend/config/env.js`, `server.js`, `config.js`, `utils/jwt.js`
- `src/frontend/utils/api.js` + 23 frontend API callers
- `render.yaml`, `vercel.json`, `.env.example`, `package.json`, `vite.config.js`

### Impacted Modules
- Deployment, auth cookies, all HTTP clients, CORS

### Risk Level
Medium

---

## 2026-06-17T12:00:00+05:30

### Summary
Fixed Dashboard crash (`projects.filter is not a function`) by ensuring projects and tasks are always arrays when API responses fail or return error objects.

### Files Changed
- `src/frontend/context/ProjectContext.jsx`
- `src/frontend/hooks/useTasks.jsx`
- `src/frontend/hooks/useProjects.jsx`
- `src/frontend/layout/Dashboard.jsx`

### Impacted Modules
- ProjectContext, useTasks, useProjects, Dashboard

### Risk Level
Low

---

# AI Change Log

---

# AI Change Log

---

# AI Change Log

---

## 2026-07-06T14:45:00+05:30

### Summary
Added per-user Calendar and Analytics access controls. Admins can toggle features per user from the Users list settings modal; disabled features are hidden from project menus and blocked via URL.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `prisma/schema.prisma` | Modified | `calendarEnabled`, `analyticsEnabled` on User |
| `prisma/migrations/20260706100000_user_feature_access/` | Added | Migration |
| `src/backend/usersController.js` | Modified | GET/PATCH feature-access endpoints |
| `src/backend/utils/userDto.js` | Modified | Include feature flags in user DTOs |
| `src/backend/authController.js` | Modified | `/me` returns feature flags |
| `src/frontend/components/UserFeatureSettingsModal.jsx` | Added | Admin settings modal with toggles |
| `src/frontend/layout/Users.jsx` | Modified | Settings button per user row |
| `src/frontend/components/ProjectTiles.jsx` | Modified | Hide calendar/analytics menu items |
| `src/frontend/layout/Tasks.jsx` | Modified | Block disabled views + redirect |
| `src/frontend/context/AuthContext.jsx` | Modified | `canUseCalendar`, `canUseAnalytics` |

### Impacted Modules
- Users admin page, project task views, auth session

### Risk Level
**Low**

---

## 2026-07-06T09:45:00+05:30

### Summary
OWASP security hardening: block public Admin registration, whitelist API fields, auth rate limiting, helmet headers, stronger passwords, session invalidation on password reset, and audit logging.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `prisma/schema.prisma` | Modified | `sessionVersion` on User, `AuditLog` model |
| `prisma/migrations/20260706000000_security_hardening/` | Added | DB migration |
| `src/backend/utils/validatePassword.js` | Added | 8+ chars, letter + number |
| `src/backend/utils/pickFields.js` | Added | Whitelist project/task fields |
| `src/backend/utils/jwt.js` | Added | Centralized auth cookie + JWT |
| `src/backend/middleware/rateLimitAuth.js` | Added | Login/register rate limit |
| `src/backend/middleware/authenticate.js` | Modified | Session version validation |
| `src/backend/services/audit.service.js` | Added | Audit log helper |
| `src/backend/authController.js` | Modified | Security fixes + audit events |
| `src/backend/projectsController.js` | Modified | Field whitelisting |
| `src/backend/taskController.js` | Modified | Field whitelisting |
| `src/backend/usersController.js` | Modified | Audit on user list |
| `src/backend/server.js` | Modified | helmet, safer errors |
| `scripts/seed-admin.mjs` | Added | Create/promote admin users |
| `src/frontend/pages/Register.jsx` | Modified | User-only registration |
| `package.json` | Modified | Added helmet |

### Impacted Modules
- Auth, projects, tasks, sessions, security headers

### Risk Level
**Medium** — existing Admin self-registrations blocked; users must re-login after password reset on other devices

---

## 2026-06-19T17:00:00+05:30

### Summary
Implemented first PII protection slice: centralized user DTOs, removed email from comments/tasks/member API responses, safe error logging, data export endpoint, account deletion endpoint, and Account settings page.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/backend/utils/userDto.js` | Added | `publicUser`, `memberUser`, `adminUser`, `searchUser` DTOs |
| `src/backend/utils/redact.js` | Added | Email redaction + safe log messages |
| `src/backend/services/account.service.js` | Added | Export and delete account logic |
| `src/backend/authController.js` | Modified | Export/delete routes, safe logging |
| `src/backend/commentsController.js` | Modified | Removed `authorEmail` from responses |
| `src/backend/projectsController.js` | Modified | Removed email from member payloads |
| `src/backend/taskController.js` | Modified | Removed `assigneeEmail` from responses |
| `src/backend/usersController.js` | Modified | Uses `adminUser` DTO |
| `src/frontend/pages/AccountSettings.jsx` | Added | Export data + delete account UI |
| `src/frontend/utils/redact.js` | Added | Sidebar email masking |
| `src/frontend/layout/sidebar.jsx` | Modified | Masked email, Account nav link |
| `src/frontend/app.jsx` | Modified | `/settings` route |

### Impacted Modules
- API PII exposure, account privacy, sidebar, settings

### Risk Level
**Medium** — API response shape changes (email fields removed from non-admin endpoints)

---

## 2026-06-19T16:00:00+05:30

### Summary
Verified `vishwank15@gmail.com` account data is intact in DB (1 project membership, 6 assigned tasks). Added loading spinner on Projects page so User accounts don't briefly show "No projects Assigned" while data fetches. Session restore now triggers data refetch.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/components/ProjectTiles.jsx` | Modified | Show loading state before empty state |
| `src/frontend/context/AuthContext.jsx` | Modified | Bump session on restore |

### Impacted Modules
- Projects page UX for User role accounts

### Risk Level
**Low**

---

## 2026-06-19T15:00:00+05:30

### Summary
Fixed account data not appearing after password reset. Reset now issues a fresh session and auto-signs the user in; projects/tasks refetch when `user.id` changes (not only on first login). Email addresses are normalized to lowercase on register, login, and forgot-password for consistent lookups.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/backend/authController.js` | Modified | Email normalization; auto-login JWT after reset |
| `src/backend/services/passwordReset.service.js` | Modified | Lowercase email lookup; return `userId` |
| `src/frontend/context/AuthContext.jsx` | Modified | `establishSession`, lowercase email on auth |
| `src/frontend/context/ProjectContext.jsx` | Modified | Refetch when `user.id` changes |
| `src/frontend/hooks/useTasks.jsx` | Modified | Refetch when `user.id` changes |
| `src/frontend/pages/ResetPassword.jsx` | Modified | Auto sign-in after reset, redirect to dashboard |

### Impacted Modules
- Password reset flow, project/task loading after auth changes

### Risk Level
**Low** — session and fetch timing fixes

---

## 2026-06-19T14:00:00+05:30

### Summary
Fixed projects and tasks not loading after login by refetching data when authentication becomes available. `ProjectContext` and `useTasks` now wait for auth and re-fetch on login; `useProjects` delegates to `ProjectContext` to avoid duplicate stale fetches.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/context/ProjectContext.jsx` | Modified | Refetch projects when `isAuthenticated` changes |
| `src/frontend/hooks/useProjects.jsx` | Modified | Uses shared `ProjectContext` |
| `src/frontend/hooks/useTasks.jsx` | Modified | Refetch tasks when authenticated |

### Impacted Modules
- Dashboard, Projects page — data loads immediately after sign-in

### Risk Level
**Low** — fetch timing fix

---

## 2026-06-19T12:00:00+05:30

### Summary
Added admin-only **Users** management page with search, role filter, and pagination. Implemented secure **Forgot Password / Reset Password** flow with hashed single-use tokens, Resend email, rate limiting, and generic responses.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `prisma/schema.prisma` | Modified | `PasswordResetToken` model |
| `src/backend/usersController.js` | Added | Admin GET `/api/auth/users` |
| `src/backend/authController.js` | Modified | Forgot/reset password endpoints |
| `src/backend/services/passwordReset.service.js` | Added | Token generation, email, reset logic |
| `src/backend/middleware/rateLimitForgotPassword.js` | Added | Rate limit forgot-password |
| `src/backend/templates/resetPasswordTemplate.js` | Added | Reset email HTML |
| `src/frontend/layout/Users.jsx` | Added | Admin users table page |
| `src/frontend/pages/ForgotPassword.jsx` | Added | Forgot password page |
| `src/frontend/pages/ResetPassword.jsx` | Added | Reset password page |
| `src/frontend/components/AdminRoute.jsx` | Added | Admin-only route guard |
| `src/frontend/app.jsx` | Modified | New routes |
| `src/frontend/layout/sidebar.jsx` | Modified | Users nav for admins |
| `src/frontend/pages/Login.jsx` | Modified | Forgot password link |

### Impacted Modules
- Auth — password reset flow
- Admin — user listing
- Email — reset link emails

### Risk Level
**Medium** — auth extension; existing login/register unchanged

---

## 2026-06-18T10:00:00+05:30

### Summary
Integrated Resend email notifications with HTML templates, `EmailLog` deduplication, event-driven emails (project member added, task assigned/updated/completed), and daily/weekly cron jobs for due-soon, overdue, and weekly pending-task summaries.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `package.json` / `package-lock.json` | Modified | Added `resend`, `node-cron` |
| `prisma/schema.prisma` | Modified | Added `EmailLog` model |
| `prisma/migrations/20260618000000_add_email_log/migration.sql` | Added | Email log table |
| `.env.example` | Added | Resend and email env vars |
| `src/backend/services/email.service.js` | Added | Resend client wrapper |
| `src/backend/services/notification.service.js` | Added | Email notification orchestration |
| `src/backend/services/notificationService.js` | Modified | Hooks in-app + email notifications |
| `src/backend/templates/*.js` | Added | HTML email templates |
| `src/backend/cron/*.js` | Added | Reminder, overdue, weekly jobs |
| `src/backend/server.js` | Modified | Starts cron jobs on boot |
| `src/backend/projectsController.js` | Modified | Email on member add |
| `src/backend/taskController.js` | Modified | Email on assign/update/complete |

### Impacted Modules
- Email delivery — Resend API
- Notifications — in-app + email
- Scheduled reminders — cron

### Risk Level
**Medium** — new external dependency; emails skipped gracefully if env not set

---

## 2026-06-17T18:15:00+05:30

### Summary
Made Project Overview scrollable like Recent Activity (`overflow-y-auto` on the body) and list all projects so extra cards scroll within the fixed panel height.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/ProjectOverview/ProjectOverview.jsx` | Modified | Scrollable body container |
| `src/frontend/ProjectOverview/projectOverviewTile.jsx` | Modified | Show all projects; loading/empty states |

### Impacted Modules
- Dashboard Project Overview panel

### Risk Level
**Low** — UI-only

---

## 2026-06-17T18:00:00+05:30

### Summary
Fixed dashboard horizontal overflow by replacing fixed `55em` column widths with a responsive two-column grid, making stat tiles and panel cards `w-full min-w-0`, and adding `overflow-x-hidden` on the dashboard and main layout.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/layout/Dashboard.jsx` | Modified | Responsive grids; overflow containment |
| `src/frontend/layout/MainLayout.jsx` | Modified | `overflow-x-hidden` on content shell |
| `src/frontend/ProjectOverview/ProjectOverview.jsx` | Modified | `w-full min-w-0` instead of `w-[55em]` |
| `src/frontend/ProjectOverview/RecentActivity.jsx` | Modified | Same width fix |
| `src/frontend/components/ProjectStatusChart.jsx` | Modified | Same width fix |
| `src/frontend/SummaryOverview/*.jsx` | Modified | Stat tiles fill grid cells |

### Impacted Modules
- Dashboard layout — no horizontal scroll

### Risk Level
**Low** — responsive layout only

---

## 2026-06-17T17:30:00+05:30

### Summary
Added a Jira-like Kanban Board per project at `/projects/:projectId/board` with drag-and-drop (`@hello-pangea/dnd`), four status columns (Pending, In Progress, Completed, Cancelled), rich task cards, optimistic status updates via existing PUT API, loading/error states, and dark mode. Added a **Board** button beside **Comments** on the project tasks page.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `package.json` / `package-lock.json` | Modified | Added `@hello-pangea/dnd` |
| `src/frontend/app.jsx` | Modified | Board route |
| `src/frontend/layout/Tasks.jsx` | Modified | Board navigation button |
| `src/frontend/layout/ProjectBoard.jsx` | Added | Board page layout |
| `src/frontend/components/KanbanBoard.jsx` | Added | DnD columns + API sync |
| `src/frontend/components/KanbanTaskCard.jsx` | Added | Task card UI |

### Impacted Modules
- Project tasks page — Board button
- New board page — Kanban workflow
- Task status updates — drag-drop uses PUT `/api/taskmanager/tasks/:id`

### Risk Level
**Medium** — new page and drag-drop; uses existing task update API

---

## 2026-06-17T16:45:00+05:30

### Summary
Added role-aware empty states for users: **No projects Assigned to you** on the Projects page and **No tasks Assigned to you** on the project task list and dashboard task summary. Admins now see a dashed **New Project** card with a plus icon as the first card in the projects grid (including when they have no projects yet).

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/components/ProjectTiles.jsx` | Modified | User empty placeholder; admin `NewProjectCard` as first grid item |
| `src/frontend/components/TaskList.jsx` | Modified | User/admin empty task placeholders with icons |
| `src/frontend/ProjectOverview/projectOverviewTile.jsx` | Modified | Dashboard project overview empty state for users |

### Impacted Modules
- Projects page — empty states and admin create card
- Project tasks page — empty task state
- Dashboard My Tasks summary — message text

### Risk Level
**Low** — UI-only changes

---

## 2026-06-17T16:20:00+05:30

### Summary
Moved the comment input form to the bottom of the comments side panel (below the scrollable list). Comments now display oldest-first with new posts appearing just above the input.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/components/ProjectComments.jsx` | Modified | Reordered panel layout; input pinned to bottom |

### Impacted Modules
- Project comments panel UI

### Risk Level
**Low** — layout-only change

---

## 2026-06-17T16:10:00+05:30

### Summary
Moved project comments from an inline card to a **Comments** button (with chat icon) aligned top-right on the project name row. Clicking opens a full-height vertical slide-in panel from the right with the comment form and scrollable list.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/frontend/components/ProjectComments.jsx` | Modified | Button trigger + right-side drawer panel with backdrop |
| `src/frontend/layout/Tasks.jsx` | Modified | Comments button placed beside project title; removed inline section |

### Impacted Modules
- Project tasks page — comments UI layout

### Risk Level
**Low** — UI-only change; API unchanged

---

## 2026-06-17T15:30:00+05:30

### Summary
Added a per-project Comments section so project admins and members can post and read project discussion notes. Includes `Comment` Prisma model, authenticated GET/POST API routes gated by `requireProjectAccess`, and a `ProjectComments` UI card on the project tasks page with dark mode support.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `prisma/schema.prisma` | Modified | Added `Comment` model with relations to `Project` and `User` |
| `prisma/migrations/20260617000000_add_project_comments/migration.sql` | Added | Creates `Comment` table and foreign keys |
| `src/backend/commentsController.js` | Added | GET/POST `/api/taskmanager/projects/:projectId/comments` |
| `src/backend/server.js` | Modified | Mounted `CommentsRouter` |
| `src/frontend/components/ProjectComments.jsx` | Added | Comment list + post form on project page |
| `src/frontend/layout/Tasks.jsx` | Modified | Renders `ProjectComments` below project members |

### Impacted Modules
- Database — new `Comment` table
- Backend — project comments API
- Project tasks page — new comments section

### Risk Level
**Low** — additive feature; existing project/task flows unchanged

---

## 2026-06-15T16:15:00+05:30

### Summary
Added due-date proximity notification banners to the Dashboard using Joy UI `Snackbar`. Banners appear below the sticky header and alert the user to overdue tasks, overdue projects, tasks due within 3 days, and projects ending within 3 days. Each banner is dismissible for the session. Dark mode colors applied manually via `isDark` from `useTheme()`.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `package.json` / `package-lock.json` | Modified | Added `@mui/joy` dependency |
| `src/frontend/layout/Dashboard.jsx` | Modified | Added due-date banner logic using Joy UI `Snackbar`; imported `useTasks`, `useTheme`, `dayjs`, Joy UI components, and MUI alert icons |

### Impacted Modules
- Dashboard page — new top-of-viewport floating banners

### Risk Level
**Low** — additive UI feature; does not modify any data layer or existing components

---

## 2026-06-15T16:05:00+05:30

### Summary
Updated all three documentation files (`.cursorrules`, `ai-context/memory.md`, `docs/project-context.md`) to reflect the full feature set added in the previous session: dark mode across all components, vivid badge colors, white MUI icons in dark mode, Chart.js dynamic theming, Arrow button dark mode, Project page live search, and the custom `FilterDropdown` component (status + priority filters).

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `.cursorrules` | Modified | Added `FilterDropdown` pattern section; updated component annotations for `ArrowBackButton`, `ArrowForwardButton`, `StatusTaskChart`, `PriorityPieChart`; added `ChevronDown`, `Check` to lucide-react icons list |
| `ai-context/memory.md` | Modified | Expanded Projects Page section with `FilterDropdown` details; expanded Dark Mode section with vivid glow pattern, arrow buttons, Chart.js theming |
| `docs/project-context.md` | Modified | Updated lucide-react icons; updated component tree annotations; expanded Projects Page and Dark Mode feature descriptions |

### Impacted Modules
- Documentation only — no runtime code changed

### Risk Level
**Low** — documentation updates only

---

## 2026-06-04T15:49:00+05:30

### Summary
Migrated the backend database layer from MongoDB + Mongoose ORM to MySQL + Prisma ORM. All API endpoints, routes, and frontend behavior are preserved.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/backend/config.js` | Modified | Replaced `mongoose.connect()` with a `PrismaClient` singleton export |
| `src/backend/projectsDB.js` | Modified | Replaced Mongoose `Projects` model with a re-export of the Prisma client |
| `src/backend/taskDB.js` | Modified | Replaced Mongoose `Tasks` model with a re-export of the Prisma client |
| `src/backend/projectsController.js` | Modified | Replaced all Mongoose queries with Prisma equivalents; added `_id` alias on all responses for frontend compatibility |
| `src/backend/taskController.js` | Modified | Replaced all Mongoose queries with Prisma equivalents; added `_id` alias on all responses for frontend compatibility |
| `src/backend/server.js` | Modified | Removed `connectDB()` import and call (Prisma connects lazily on first query) |
| `package.json` | Modified | Added `mysql2`; removed `mongoose` |
| `prisma/schema.prisma` | Created | New file — MySQL schema defining `Project` and `Task` tables with a one-to-many foreign key relationship |
| `.env` | Created | New file — `DATABASE_URL` environment variable for MySQL connection string |

### Files Unchanged
- All files under `src/frontend/` (entire React UI)
- `prisma.config.ts`
- `vite.config.js`, `tailwind.config.js`, `eslint.config.js`, `postcss.config.js`
- `src/backend/prompt.md`, `src/backend/public/vite.svg`

### Impacted Modules
- Backend database layer (config, models, controllers)
- Node.js dependency tree (`mysql2` in, `mongoose` out)

### Risk Level
**Medium** — Core backend logic is replaced. All API contracts and frontend code are preserved. Requires a running MySQL instance and running `npx prisma migrate dev --name init` before the server can start.

---

## 2026-06-04T17:10:00+05:30

### Summary
Fixed project creation not reflecting in the UI. `ProjectTiles` had its own isolated fetch that never updated after a new project was created via the modal.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/context/ProjectContext.jsx` | Modified | Added `useEffect` to fetch all projects from the API on mount so the context owns the authoritative list |
| `src/frontend/components/ProjectTiles.jsx` | Modified | Replaced isolated local fetch+state with `useProject()` context read; new projects added via modal now appear instantly |

### Files Unchanged
- All backend files
- All other frontend files

### Impacted Modules
- Project list display (`ProjectTiles`)
- Project context state management (`ProjectContext`)

### Risk Level
**Low** — No API or data changes. Only wires the existing context to the tile component that was previously disconnected from it.

---

## 2026-06-09T11:32:00+05:30

### Summary
UI overhaul of the sidebar, page headers (Dashboard & Projects), and project cards. Added "In Progress" as a selectable project status. Improved visual hierarchy, active navigation state, and card scannability.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/components/ProjectStatus.jsx` | Modified | Added "In Progress" as a menu option between "Active" and "Completed"; fixed "On hold" casing to "On Hold" |
| `src/frontend/layout/sidebar.jsx` | Modified | Replaced MUI Buttons with native buttons; added `useLocation` active-route detection; active item gets solid orange fill, inactive items get ghost style with hover; replaced hard black border with `border-r border-gray-200`; added `bg-[#f8faff]` background; added `TaskAltRoundedIcon` logo badge beside branding text |
| `src/frontend/layout/Dashboard.jsx` | Modified | Header: replaced `border-b-2 border-black` with `border-b border-gray-200`; added `sticky top-0 z-10 bg-white`; added `DashboardRoundedIcon` before title; improved subtitle typography |
| `src/frontend/layout/Projects.jsx` | Modified | Same header improvements as Dashboard; added `FolderRoundedIcon` before title; imported icon from MUI |
| `src/frontend/components/ProjectTiles.jsx` | Modified | Color-coded status badges (blue/green/yellow/gray/orange/red per status); color-coded priority badges; 4px top accent border per priority; `min-h-40` instead of fixed `h-40`; empty-state illustration when no projects exist; card background changed to white |

### Impacted Modules
- Frontend navigation (sidebar)
- Frontend page headers (Dashboard, Projects)
- Project card display (ProjectTiles)
- Project status selector (ProjectStatus)

### Risk Level
**Low** — All changes are purely presentational (CSS classes, layout, icons). No API calls, backend logic, or data structures were modified. The new "In Progress" status value is additive and backward-compatible.

---

## 2026-06-09T15:02:00+05:30

### Summary
Made the sidebar collapsible (icon-only mode) with smooth animation. Improved page header design with a layered shadow and orange accent border. Lifted sidebar collapse state to `App.jsx` so the main content area shifts in sync.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/layout/Sidebar.jsx` | Modified | Added `collapsed`/`setCollapsed` props; collapse toggles width between `w-64` and `w-[68px]`; icon-only mode when collapsed with `title` tooltip; chevron toggle button pinned to bottom |
| `src/frontend/app.jsx` | Modified | Added `useState` for `collapsed`; passes it to both `Sidebar` and `MainLayout`; removed unused `Tasks` duplicate import |
| `src/frontend/layout/MainLayout.jsx` | Modified | Accepts `collapsed` prop; uses inline `paddingLeft` style (256px / 68px) that transitions in sync with the sidebar |
| `src/frontend/layout/Dashboard.jsx` | Modified | Header: replaced plain `border-b` with layered shadow + `border-b-2 border-[#d97757]/20`; page icon now inside a tinted rounded badge; subtitle moved inline under title |
| `src/frontend/layout/Projects.jsx` | Modified | Same header improvements as Dashboard |

### Impacted Modules
- Frontend layout (sidebar collapse state, main content offset)
- Page headers (Dashboard, Projects)

### Risk Level
**Low** — Pure UI/layout changes. State is local to `App.jsx` and doesn't affect routing, API calls, or data.

---

## 2026-06-09T17:05:00+05:30

### Summary
Added two new dashboard widgets — `TodaysFocus` and `ProjectHealthScore` — to fill the empty right-column whitespace on the Dashboard. Both components are newly created and consume existing hooks (`useTasks`, `useProjects`) with no backend changes.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/DashboardWidgets/TodaysFocus.jsx` | Created | Filters tasks where `dueDate` is today; displays them in a checklist-style card with a completion progress bar, priority badges, and an empty state illustration |
| `src/frontend/DashboardWidgets/ProjectHealthScore.jsx` | Created | Computes a 0–100 health score per project based on task completion rate (40pts), overdue task ratio (30pts), and deadline proximity (30pts); displays each project with a colored score badge (green/yellow/red) and a score progress bar |
| `src/frontend/layout/Dashboard.jsx` | Modified | Replaced commented-out right column with the two new widgets; swapped unused `MyTasksSummary`, `InProgressSummary`, `OverdueSummary` imports for `TodaysFocus` and `ProjectHealthScore` |

### Impacted Modules
- Dashboard layout (right column)
- New widget folder: `src/frontend/DashboardWidgets/`

### Risk Level
**Low** — Purely additive UI changes. No API endpoints, backend logic, or existing components were modified. Both widgets consume already-fetched data via existing hooks.

---

## 2026-06-09T17:25:00+05:30

### Summary
Replaced the `ProjectHealthScore` dashboard widget with a new `WeekAtAGlance` component — a 7-column bar chart grid (Mon–Sun) showing how many tasks are due each day of the current week, with hover tooltips listing task names.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/DashboardWidgets/WeekAtAGlance.jsx` | Created | 7-day task calendar with proportional bar heights per day, today highlighted in orange, hover tooltip listing task titles with priority dots, and a legend |
| `src/frontend/DashboardWidgets/ProjectHealthScore.jsx` | Removed from Dashboard | File retained on disk but no longer imported or rendered |
| `src/frontend/layout/Dashboard.jsx` | Modified | Swapped `ProjectHealthScore` import and usage for `WeekAtAGlance` |

### Impacted Modules
- Dashboard right column (bottom widget)

### Risk Level
**Low** — Additive change. No backend, API, or data structure changes. Uses existing `useTasks()` hook.

---

## 2026-06-10T11:36:00+05:30

### Summary
Converted the `AssignmentTurnedInRoundedIcon` badge in `MyTasksTile` into a MUI `SpeedDial` FAB button. Clicking it toggles a floating `MyTasksSummary` panel above the icon; clicking outside dismisses it via `ClickAwayListener`.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/SummaryOverview/MyTasks.jsx` | Modified | Replaced static `<span>` icon with a controlled MUI `SpeedDial`; added `useState` for open/close; rendered `MyTasksSummary` in an absolutely-positioned `Box` above the FAB when open; wrapped in `ClickAwayListener` for outside-click dismissal |

### Impacted Modules
- Dashboard summary tiles (`MyTasksTile`)
- `MyTasksSummary` floating panel

### Risk Level
**Low** — Purely UI interaction change. No API calls, backend logic, or data structures modified. Uses MUI's built-in `SpeedDial`, `ClickAwayListener`, and `Box` components.

---

## 2026-06-10T16:20:00+05:30

### Summary
Fixed two bugs that prevented new projects from being created. The "Create Project" button had a wrong `onClick` that re-opened the modal instead of submitting the form, and the date fields allowed empty values which caused a Prisma 500 error since `projectStartDate` and `projectEndDate` are non-nullable in the schema.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/layout/NewProjectModal.jsx` | Modified | Replaced `onClick={() => setOpenNewPrjModal(true)}` with `type="submit"` on the Create Project button so the form's `onSubmit` handler fires; added `required` to both date inputs to prevent null values reaching the database |

### Impacted Modules
- Project creation flow (modal form submission)

### Risk Level
**Low** — Targeted bug fixes only. No API, schema, or data structure changes. The form now correctly submits on button click and validates required date fields before sending to the backend.

---

## 2026-06-11T11:45:00+05:30

### Summary
Added a task update feature. An edit icon button on each task row opens a pre-filled modal (identical layout to the create modal) that lets users modify task fields and saves via the existing `PUT /api/taskmanager/tasks/:id` endpoint. The task list updates in place without a page reload.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/components/EditTaskModal.jsx` | Created | New modal component pre-populated with task data via `useEffect`; calls `PUT /api/taskmanager/tasks/:id` on submit; accepts `task`, `open`, `onClose`, `onUpdated` props |
| `src/frontend/layout/TaskTile.jsx` | Modified | Added `EditRoundedIcon` and `DeleteRoundedIcon` icon buttons in a new Actions column; wires `EditTaskModal` with local `editOpen` state; `onUpdated` replaces the task in parent list via `setTaskList` |
| `src/frontend/components/TaskList.jsx` | Modified | Updated header grid from `grid-cols-[2fr_1fr_1fr_1fr_1fr]` to `grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]` and added "Actions" column header |

### Impacted Modules
- Task list display (`TaskList`, `TaskTile`)
- Task editing flow (new `EditTaskModal`)

### Risk Level
**Low** — Additive feature using the pre-existing `PUT` backend endpoint. No schema, API contract, or existing component logic changed.

---

## 2026-06-15T10:09:00+05:30

### Summary
Added a global dark mode feature with persistent user preference. A sun/moon toggle button is placed in the sticky header of every page (Dashboard, Projects, Tasks) and also at the bottom of the sidebar. Theme preference is persisted in `localStorage` and survives page reloads.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/context/ThemeContext.jsx` | Created | New context providing `isDark` state and `toggleTheme()`; applies/removes `dark` class on `<html>` on change; reads initial value from `localStorage` |
| `src/frontend/components/DarkModeToggle.jsx` | Created | Reusable toggle button with Sun/Moon icons (from `lucide-react`); reads from `ThemeContext` |
| `src/frontend/main.jsx` | Modified | Wrapped app with `ThemeProvider` |
| `src/frontend/index.css` | Modified | Added dark mode overrides for MUI components (Paper, Input, Menu, DatePicker) and dark-mode scrollbar styles |
| `src/frontend/layout/sidebar.jsx` | Modified | Added `dark:` Tailwind classes to sidebar bg, borders, text, and hover states; added inline dark mode toggle button at the bottom of the sidebar |
| `src/frontend/layout/mainlayout.jsx` | Modified | Added `dark:bg-[#0f172a]` to root content wrapper |
| `src/frontend/layout/Dashboard.jsx` | Modified | Added `dark:` classes to sticky header bg, text, shadow; imported and rendered `DarkModeToggle` in header right |
| `src/frontend/layout/Projects.jsx` | Modified | Same header dark mode updates as Dashboard; `DarkModeToggle` placed beside `NewProjectBtn` |
| `src/frontend/layout/Tasks.jsx` | Modified | Same header dark mode updates; `DarkModeToggle` placed beside `NewTaskModal`; all four stat filter cards updated with dark variants |

### Impacted Modules
- App shell and theme layer (`ThemeContext`, `main.jsx`)
- Navigation sidebar (`sidebar.jsx`)
- All three page layouts (Dashboard, Projects, Tasks)
- Main content wrapper (`mainlayout.jsx`)
- Global CSS overrides for MUI components (`index.css`)

### Risk Level
**Low** — Purely additive theming change. Dark mode is applied via CSS class toggling and Tailwind `dark:` variants. No API calls, backend logic, routing, or data structures were modified. The `dark` class on `<html>` is non-destructive and reversible.

---

## 2026-06-15T10:19:00+05:30

### Summary
Extended dark mode coverage to all major content components: project cards, task list table, individual task rows, calendar view, analytics view, and both Chart.js charts. All hardcoded light colors now have `dark:` Tailwind counterparts; charts use `useTheme()` to dynamically update axis/legend colors.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/components/ProjectTiles.jsx` | Modified | Added `dark:bg-[#1e293b]`, `dark:border-slate-700`, `dark:text-slate-100/400` to project cards; added dark variants to `STATUS_STYLES` and `PRIORITY_STYLES` badge maps; dark empty state |
| `src/frontend/components/TaskList.jsx` | Modified | Added `dark:bg-[#1e293b]` to outer container; `dark:bg-[#2a1a0a]` to warm header bar; `dark:text-slate-200` to column headers; dark empty state text |
| `src/frontend/layout/taskTile.jsx` | Modified | Added `dark:bg-[#263446]` to each task row; `dark:text-slate-100/300/400` to title, status, date, type columns; added dark variants to all four `priorityClass()` badge return values |
| `src/frontend/layout/TasksCalenderView.jsx` | Modified | Added `dark:bg-[#1e293b]` and `dark:border-slate-700` to both panels; dark calendar cell states (default/active/today); dark weekday labels; dark status badge map; dark upcoming task cards |
| `src/frontend/layout/TasksAnalyticsView.jsx` | Modified | Added `dark:bg-[#1e293b]` and `dark:border-slate-700` to chart cards; `dark:text-slate-100` to Analytics heading; `dark:text-orange-400` to chart section titles |
| `src/frontend/components/StatusTaskChart.jsx` | Modified | Imported `useTheme`; dynamically sets `scales.y/x.ticks.color`, `scales.y/x.grid.color`, and `plugins.legend.labels.color` based on `isDark` |
| `src/frontend/components/PriorityPieChart.jsx` | Modified | Imported `useTheme`; dynamically sets legend label color; `dark:bg-[#263446]` on chart wrapper; dark border color between pie slices |

### Impacted Modules
- Project listing page (`ProjectTiles`)
- Task list table (`TaskList`, `taskTile`)
- Calendar view (`TasksCalenderView`)
- Analytics view (`TasksAnalyticsView`, `StatusTaskChart`, `PriorityPieChart`)

### Risk Level
**Low** — All changes are purely visual. No API calls, data structures, or business logic modified. Chart.js options are recomputed on each render when theme changes.

---

## 2026-06-15T10:35:00+05:30

### Summary
Improved dark mode visual quality: replaced muted/washed-out colors with vivid, high-contrast alternatives and made all navy-colored icons white/light in dark mode using `useTheme()` conditional `sx` props.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/components/ProjectTiles.jsx` | Modified | Added `useTheme()` to `ProjectCard`; all `sx={{ color: "#1d3557" }}` icons (hamburger menu, menu items) use `navyIcon` variable that resolves to `#e2e8f0` in dark mode; `FolderOpenRoundedIcon` in empty state becomes blue in dark mode; all STATUS_STYLES and PRIORITY_STYLES badge dark variants upgraded from `900/40` to `500/25` for vivid glow effect with matching border |
| `src/frontend/layout/taskTile.jsx` | Modified | Added `useTheme()`; `EditRoundedIcon` becomes `#e2e8f0` in dark mode; delete icon hover bg uses warm dark; priority badge dark variants upgraded to vivid `500/25` glow; delete dialog `PaperProps` dynamically uses dark bg/text colors |
| `src/frontend/layout/Tasks.jsx` | Modified | All four filter stat cards redesigned for dark mode: Total Tasks → blue tint (`blue-500/15`, `blue-600` icon); Completed → green (`green-500/15`, `green-600`); Pending → yellow (`yellow-500/15`, `yellow-600`); In Progress → violet (`violet-500/15`, `violet-600`); number text uses `dark:text-white` for maximum contrast; subtitles use matching colored text |
| `src/frontend/layout/TasksCalenderView.jsx` | Modified | Status badges upgraded to `500/25` vivid glow style; calendar cell default day uses `dark:text-slate-100`; selected day uses deep blue highlight (`dark:bg-[#1e3a5f]`); weekday labels upgraded from `slate-400` to `slate-300` |
| `src/frontend/components/TaskList.jsx` | Modified | Header bar background changed from nearly-black `[#2a1a0a]` to warm brown `[#3d2510]`; column header text upgraded to `dark:text-orange-100` for visible warmth |
| `src/frontend/layout/sidebar.jsx` | Modified | Chevron collapse button upgraded from `dark:text-slate-400` to `dark:text-slate-200`; inactive nav item text upgraded from `dark:text-slate-300` to `dark:text-slate-100` |
| `src/frontend/layout/Dashboard.jsx` | Modified | Header subtitle upgraded from `dark:text-slate-500` to `dark:text-slate-400` |
| `src/frontend/layout/Projects.jsx` | Modified | Header subtitle upgraded from `dark:text-slate-500` to `dark:text-slate-400` |
| `src/frontend/layout/Tasks.jsx` | Modified | Header subtitle upgraded from `dark:text-slate-500` to `dark:text-slate-400` |

### Impacted Modules
- Project cards and empty state (`ProjectTiles`)
- Task rows and delete dialog (`taskTile`)
- Task stat filter cards (`Tasks`)
- Calendar view badges and cells (`TasksCalenderView`)
- Task list header (`TaskList`)
- Sidebar navigation (`sidebar`)
- All three page headers

### Risk Level
**Low** — Purely visual changes. No API calls, data structures, or component logic modified. All icon color changes use the existing `ThemeContext`.

---

## 2026-06-15T10:53:00+05:30

### Summary
Applied full dark mode to all Dashboard page components: the four summary stat tiles, Project Overview and Recent Activity panels, Today's Focus widget, and Week at a Glance widget. Each component uses the same vivid `500/25` glow-badge system and teal accent color (`#5eead4`) in dark mode.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/SummaryOverview/TotalProjectTile.jsx` | Modified | `dark:bg-blue-500/15` card, `dark:bg-blue-600` icon bg, `dark:text-blue-200/300` text, `dark:text-white` number |
| `src/frontend/SummaryOverview/CompletedProjects.jsx` | Modified | `dark:bg-green-500/15` card, `dark:bg-green-600` icon, `dark:text-green-200/300` text |
| `src/frontend/SummaryOverview/InProgressProjectsTile.jsx` | Modified | `dark:bg-orange-500/15` card, `dark:bg-orange-500` icon, `dark:text-orange-200/300` text |
| `src/frontend/SummaryOverview/MyTasks.jsx` | Modified | `dark:bg-indigo-500/15` card; added `useTheme()` to conditionally set SpeedDial FAB `bgcolor` to indigo-600 in dark mode |
| `src/frontend/ProjectOverview/ProjectOverview.jsx` | Modified | Card bg `dark:bg-[#1e293b]`, border `dark:border-teal-700/50`, header text `dark:text-teal-300` |
| `src/frontend/ProjectOverview/ProjectOverviewTile.jsx` | Modified | Individual project cards go `dark:bg-[#263446]`; title `dark:text-slate-100`; description `dark:text-slate-400`; deadline `dark:text-slate-300`; status badges use vivid `500/25` dark system |
| `src/frontend/ProjectOverview/RecentActivity.jsx` | Modified | Same container dark styles as `ProjectOverview` |
| `src/frontend/ProjectOverview/RecentActivityTile.jsx` | Modified | Same tile dark styles as `ProjectOverviewTile`; status badges use vivid dark system |
| `src/frontend/DashboardWidgets/TodaysFocus.jsx` | Modified | Added `useTheme()`; `TodayRoundedIcon` switches to `#5eead4` (teal-300) in dark; card `dark:bg-[#1e293b]`; progress bar track `dark:bg-slate-700`, fill `dark:bg-teal-500`; task items `dark:bg-[#263446]`; priority badges use vivid dark system; empty/completed states use appropriate dark text |
| `src/frontend/DashboardWidgets/WeekAtAGlance.jsx` | Modified | Added `useTheme()`; `CalendarMonthRoundedIcon` uses teal-300 in dark; bars use `dark:bg-teal-600/80`; day labels `dark:text-teal-300`; empty bars `dark:bg-slate-700`; legend updated; tooltip `dark:bg-teal-800` |

### Impacted Modules
- Dashboard summary row (all four stat tiles)
- Dashboard left column (ProjectOverview, RecentActivity and their tile sub-components)
- Dashboard right column (TodaysFocus, WeekAtAGlance)

### Risk Level
**Low** — Purely visual theming. No API calls, data structures, hooks, or business logic modified.

---

## 2026-06-15T11:08:00+05:30

### Summary
Added live project search and dual-filter (Status + Priority) toolbar to the Projects page. All filtering is client-side, self-contained in `ProjectTiles`, and fully dark-mode aware.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/components/ProjectTiles.jsx` | Modified | Added `searchQuery`, `statusFilter`, `priorityFilter` state; computed `filteredProjects`; new toolbar with search input (lucide `Search` icon, clear `X`), Status `<select>` dropdown, Priority `<select>` dropdown, active-filter count badge, and "Clear" button; result count line when filters are active; dedicated empty-state for "no results" vs "no projects"; all controls fully dark-mode styled |

### Impacted Modules
- Projects page (`ProjectTiles` component)

### Risk Level
**Low** — All filtering is pure client-side state. No API calls, backend, or data structures modified. Existing project card and empty-state logic is unchanged.

---

## 2026-07-08T12:30:00+05:30

### Summary
Implemented automatic time tracking and task activity timeline with a new Task Details page. Tasks now store `startedAt`, `completedAt`, and `timeSpent`; status transitions auto-record time. `TaskHistory` logs create/assign/status/priority/due-date/completed events. Frontend shows live timer (client-side only), vertical timeline, and navigable task detail route.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `prisma/schema.prisma` | Modified | Added `startedAt`, `completedAt`, `timeSpent` on Task; new `TaskHistory` model |
| `prisma/migrations/20260708120000_task_time_tracking_history/migration.sql` | Added | DB migration for time fields and TaskHistory table |
| `src/backend/services/taskHistory.service.js` | Added | Record and format task history entries |
| `src/backend/services/taskTime.service.js` | Added | Apply time tracking rules on status change |
| `src/backend/taskController.js` | Modified | GET task by id, GET history, auto history + time tracking on create/update |
| `src/frontend/utils/timeFormat.js` | Added | Duration and date formatting helpers |
| `src/frontend/hooks/useLiveTimer.js` | Added | 1-second live elapsed timer hook |
| `src/frontend/components/taskDetails/*` | Added | Header, description, info, live timer, timeline, comments section cards |
| `src/frontend/layout/TaskDetailsPage.jsx` | Added | Task details page layout and data fetching |
| `src/frontend/app.jsx` | Modified | Route `/projects/:projectId/tasks/:taskId` |
| `src/frontend/layout/taskTile.jsx` | Modified | Click task title to open details |
| `src/frontend/components/KanbanTaskCard.jsx` | Modified | Click card to open details; drag handle isolated |
| `src/frontend/components/KanbanBoard.jsx` | Modified | Drag handle props passed to card grip only |
| `src/frontend/components/ArrowBackButton.jsx` | Modified | Optional custom `onClick` handler |

### Impacted Modules
- Task API (read single task, history, create/update side effects)
- Task list and Kanban navigation
- New Task Details page (time tracking UI, timeline, project comments)

### Risk Level
**Medium** — Schema migration plus new write paths on every task create/update; frontend adds new route and navigation entry points.

---

## 2026-07-08T17:40:00+05:30

### Summary
Task Details page switched to a single-column vertical layout. Replaced project comments with per-task comments (`TaskComment` model + GET/POST APIs) and an inline comments card on the task page.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `prisma/schema.prisma` | Modified | Added `TaskComment` model linked to Task and User |
| `prisma/migrations/20260708173000_task_comments/migration.sql` | Added | TaskComment table migration |
| `src/backend/taskCommentsController.js` | Added | GET/POST `/tasks/:taskId/comments` with task access checks |
| `src/backend/server.js` | Modified | Mounted task comments router |
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Vertical stacked layout (`max-w-2xl`), task comments props |
| `src/frontend/components/taskDetails/TaskCommentsSection.jsx` | Modified | Inline task comments list + compose form (no project comments) |

### Impacted Modules
- Task Details page layout
- Task comment API and UI

### Risk Level
**Low** — Additive schema and API; project comments unchanged on Tasks page toolbar.

---

## 2026-07-08T17:45:00+05:30

### Summary
Restored Task Details page to the original two-column grid layout (description/info and timer/timeline side by side). Task comments section retained at full width below.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Reverted from vertical `max-w-2xl` stack to `lg:grid-cols-2` layout |

### Impacted Modules
- Task Details page layout only

### Risk Level
**Low** — Layout-only change.

---

## 2026-07-08T17:48:00+05:30

### Summary
Made the task description card more compact: removed full-height stretch, tighter padding, and capped description text with scroll for overflow.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/components/taskDetails/TaskDescriptionCard.jsx` | Modified | `self-start`, smaller header/padding, `line-clamp-4` + `max-h-24` scroll |

### Impacted Modules
- Task Details description card

### Risk Level
**Low** — Visual sizing only.

---

## 2026-07-08T17:55:00+05:30

### Summary
Polished Task Details page UI to match app design patterns: sticky page header with orange icon badge, Tasks-style title row, softer cards (`border-slate-100`), icon badge section titles, info tiles grid, cleaner timer/timeline/comments cards, and shared chip styles.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Stack layout like Tasks page; content padding aligned |
| `src/frontend/components/taskDetails/TaskDetailsHeader.jsx` | Modified | Sticky header + back/title/chip row; Edit button matching Board/Comments buttons |
| `src/frontend/components/taskDetails/TaskDescriptionCard.jsx` | Modified | Compact card with icon badge |
| `src/frontend/components/taskDetails/TaskInfoCard.jsx` | Modified | 2×2 info tiles instead of long rows |
| `src/frontend/components/taskDetails/LiveTimerCard.jsx` | Modified | Cleaner timer states with inner tiles; no emoji |
| `src/frontend/components/taskDetails/TaskTimelineCard.jsx` | Modified | Timeline events as inner cards with icon nodes |
| `src/frontend/components/taskDetails/TaskCommentsSection.jsx` | Modified | Matching empty state, badge header, compose form |

### Impacted Modules
- Task Details page visual design

### Risk Level
**Low** — Frontend styling only; APIs and data flow unchanged.

---

## 2026-07-08T17:58:00+05:30

### Summary
Matched Description card height to Task Info card using equal-height grid stretch (`items-stretch` + `h-full`).

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Description/Info row uses `items-stretch` |
| `src/frontend/components/taskDetails/TaskDescriptionCard.jsx` | Modified | `h-full` flex column so it fills sibling height |
| `src/frontend/components/taskDetails/TaskInfoCard.jsx` | Modified | Explicit `h-full` for equal stretch |

### Impacted Modules
- Task Details description + info cards

### Risk Level
**Low** — Layout sizing only.

---

## 2026-07-09T12:15:00+05:30

### Summary
Implemented single active session per user. Each login/register rotates `sessionVersion`, invalidating prior JWTs. Superseded sessions return `401` with `SESSION_SUPERSEDED`; frontend interceptors and tab-focus checks auto-logout and redirect to login with a clear message. Logout also rotates the session.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/backend/services/session.service.js` | Added | `rotateUserSession` / `invalidateUserSession` helpers |
| `src/backend/authController.js` | Modified | Rotate session on login, register, logout |
| `src/backend/middleware/authenticate.js` | Modified | Return `SESSION_SUPERSEDED` code when token version mismatches |
| `src/frontend/context/AuthContext.jsx` | Modified | Axios interceptors, visibility/focus session check, auto-logout |
| `src/frontend/pages/Login.jsx` | Modified | Show message when redirected after session superseded |

### Impacted Modules
- Authentication / session lifecycle
- All authenticated API calls (old sessions rejected)

### Risk Level
**Medium** — Changes core auth behavior; users with multiple tabs/devices will only keep the latest login active.

---

## 2026-07-10T15:30:00+05:30

### Summary
Added lightweight task checklists (subtasks): `ChecklistItem` model, full REST API with reorder support, and a Task Details checklist section with progress bar, optimistic updates, inline edit, and toggle/delete actions.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `prisma/schema.prisma` | Modified | `ChecklistItem` model linked to Task (cascade delete) |
| `prisma/migrations/20260710120000_checklist_items/migration.sql` | Added | ChecklistItem table migration |
| `src/backend/services/checklist.service.js` | Added | Validation, ordering, reorder helpers |
| `src/backend/checklistController.js` | Added | CRUD + toggle + reorder endpoints |
| `src/backend/server.js` | Modified | Mounted checklist router |
| `src/frontend/hooks/useChecklist.js` | Added | Checklist state, progress, optimistic mutations |
| `src/frontend/components/taskDetails/TaskChecklistSection.jsx` | Added | Checklist UI with progress bar and item rows |
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Integrated checklist section |

### Impacted Modules
- Task Details page
- Checklist API (`/tasks/:taskId/checklist`)

### Risk Level
**Low** — Additive feature; uses existing `requireTaskAccess` for permissions.

---

## 2026-07-10T15:35:00+05:30

### Summary
Reorganized Task Details layout: description full-width on top, checklist + task info side by side below. Checklist items scroll inside the card when the list exceeds the box height.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Description above; checklist replaces description column beside task info |
| `src/frontend/components/taskDetails/TaskChecklistSection.jsx` | Modified | Flex column layout with scrollable items list |
| `src/frontend/components/taskDetails/TaskDescriptionCard.jsx` | Modified | Compact full-width card with scroll for long text |

### Impacted Modules
- Task Details page layout

### Risk Level
**Low** — Layout only.

---

## 2026-07-13T14:30:00+05:30

### Summary
Migrated all frontend API calls from hardcoded `http://localhost:3000` to the centralized axios client at `src/frontend/utils/api.js`. Replaced local `axios.create` instances, raw `axios` calls, and `fetch` calls with the shared `api` instance using relative paths (`/api/auth/...`, `/api/taskmanager/...`) or `API_TASKMANAGER` where appropriate.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/frontend/context/AuthContext.jsx` | Modified | Import shared `api`; remove local axios.create and global axios interceptor |
| `src/frontend/context/ProjectContext.jsx` | Modified | Use `api.get` for projects fetch |
| `src/frontend/hooks/useTasks.jsx` | Modified | Use `api.get` for tasks fetch |
| `src/frontend/hooks/useChecklist.js` | Modified | Use `api` + `API_TASKMANAGER` for checklist endpoints |
| `src/frontend/pages/ForgotPassword.jsx` | Modified | Import shared `api` |
| `src/frontend/pages/ResetPassword.jsx` | Modified | Import shared `api` |
| `src/frontend/pages/AccountSettings.jsx` | Modified | Import shared `api` |
| `src/frontend/components/UserFeatureSettingsModal.jsx` | Modified | Import shared `api` |
| `src/frontend/components/NotificationPanel.jsx` | Modified | Use `api` for notification endpoints |
| `src/frontend/components/KanbanBoard.jsx` | Modified | Use `api` for task fetch/update |
| `src/frontend/components/TaskList.jsx` | Modified | Use `api` for task list/delete |
| `src/frontend/components/ProjectComments.jsx` | Modified | Use `api` for comments |
| `src/frontend/components/EditTaskModal.jsx` | Modified | Use `api` for project/task updates |
| `src/frontend/components/NewTaskModal.jsx` | Modified | Use `api` for project members and task create |
| `src/frontend/components/AddProjectMember.jsx` | Modified | Use `api` for user search and member add |
| `src/frontend/components/ProjectSettingsModal.jsx` | Modified | Use `api` for project fetch/update |
| `src/frontend/components/taskDetails/TaskCommentsSection.jsx` | Modified | Use `api` for task comments |
| `src/frontend/layout/Users.jsx` | Modified | Use `api` for auth users list |
| `src/frontend/layout/ProjectBoard.jsx` | Modified | Use `api` for project fetch |
| `src/frontend/layout/Tasks.jsx` | Modified | Use `api` for project and tasks fetch |
| `src/frontend/layout/TaskDetailsPage.jsx` | Modified | Use `api` for task and history fetch |
| `src/frontend/layout/NewProjectModal.jsx` | Modified | Use `api.post` instead of fetch |
| `src/frontend/layout/TasksSettingsView.jsx` | Modified | Use `api` for project fetch/update |

### Impacted Modules
Frontend API layer, auth context, project/task CRUD, notifications, checklists, comments, Kanban board, user management

### Risk Level
**Low** — Refactor only; behavior unchanged except all calls now respect `VITE_API_URL` env var.

---

## 2026-07-13T13:25:00+05:30

### Summary
Added `docs/feature.md` — comprehensive feature list documenting auth, projects, tasks, time tracking, checklists, Kanban, dashboard, notifications, admin, security, and API routes.

### Files Changed

| File | Change Type | Description |
|---|---|---|
| `docs/feature.md` | Added | Full application feature documentation |

### Impacted Modules
- Documentation only

### Risk Level
**Low** — Docs only.
