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
