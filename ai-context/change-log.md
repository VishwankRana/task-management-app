# AI Change Log

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
