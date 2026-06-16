# Project Memory

## Current Status

### ✅ Completed Features

#### Core
- Project CRUD (create, edit, delete, settings)
- Task CRUD within projects (create, edit, delete)
- Database: MySQL + Prisma ORM (migrated from MongoDB)

#### Dashboard Page
- Summary stat tiles: Total Projects, Completed Projects, In Progress Projects, My Tasks
- Project Overview panel (top 2 projects with status + deadline)
- Recent Activity panel (latest 3 tasks)
- Today's Focus widget (tasks due today with progress bar)
- Week at a Glance widget (7-day bar chart of tasks due)
- **Due-date proximity banners** — Joy UI `Snackbar` toasts at top-center:
  - Danger (red): overdue tasks / overdue projects
  - Warning (amber): tasks due ≤ 3 days / projects ending ≤ 3 days
  - Each banner is session-dismissible (X button); reappears on next page load
  - Dark mode colors applied via `isDark` + `sx` (not Joy UI's own CssVarsProvider)
  - Stacked vertically: each banner offset by `top: 80 + index * 68px`

#### Projects Page
- Project card grid (name, description, status badge, priority badge)
- Per-card dropdown menu (Tasks / Calendar / Analytics / Settings)
- Project Settings modal (edit name, description, status, priority, dates)
- **Search by project name** (live, client-side, `Search` icon from lucide-react)
- **Filter by Status** — custom `FilterDropdown` component (All / Planning / Active / In Progress / Completed / On Hold / Cancelled)
- **Filter by Priority** — custom `FilterDropdown` component (All / High / Medium / Low)
- Active filter count badge on the SlidersHorizontal icon + one-click Clear button
- FilterDropdown: `rounded-2xl` panel, `mt-2` offset, `Check` on selected option, orange tint on active trigger, closes on outside click
- "No results" empty state is distinct from "no projects at all" empty state

#### Tasks Page
- Sticky header with project name
- Four stat filter cards: Total Tasks, Completed, Pending, In Progress (click to filter list)
- Task List view (table with priority badge, status, due date, type, edit/delete actions)
- Calendar View (monthly grid with task count dots + Upcoming Tasks panel)
- Analytics View (Tasks by Status bar chart + Tasks by Priority pie chart)

#### Dark Mode
- Full app dark mode via `ThemeContext` (toggles `.dark` on `<html>`)
- Persisted in `localStorage`
- Toggle button in every page header AND at the bottom of the sidebar
- All components: Dashboard, Projects, Tasks, sidebar, modals, charts, badges
- Vivid glow badge pattern: `dark:bg-[color]-500/25 dark:text-[color]-200 dark:border dark:border-[color]-500/50`
- MUI icons that were navy (`#1d3557`) → white (`#e2e8f0`) in dark mode via `useTheme()`
- `ArrowBackButton` + `ArrowForwardButton`: icon color switches to white in dark mode
- Chart.js (StatusTaskChart, PriorityPieChart): axis, gridline, and legend label colors driven by `isDark`

---

### ⏳ Pending / Not Yet Implemented

- User authentication (login / register / JWT)
- Multi-user support / project team members
- Task comments or notes
- File attachments on tasks
- Email or push notifications for due dates
- Export to CSV / PDF
- Drag-and-drop task reordering (Kanban view)
- Global task search across all projects
- Task dependency / subtask support
- Project progress bar / completion percentage on project cards

---

### 🐛 Known Issues

| Issue | Location | Notes |
|-------|----------|-------|
| Double data fetch | `Tasks.jsx` + `TaskList.jsx` | Both fetch `/projects/:id/tasks` independently — potential race condition or wasted request |
| activeTab initialized once | `Tasks.jsx` | `useState(searchParams.get("view"))` reads URL param only on mount; tab doesn't sync if URL changes externally |
| Dark mode toggle duplication | App-wide | Toggle exists in both page headers and sidebar bottom — can feel redundant |
| No loading skeleton | Project cards, task list | Uses `loading ? "…" : value` text — no skeleton or spinner UX |

---

## Key Context for Future Work

### State Ownership
| State | Owner | How to access |
|-------|-------|---------------|
| Project list | `ProjectContext` | `useProject()` hook |
| Dark mode | `ThemeContext` | `useTheme()` → `{ isDark, toggleTheme }` |
| Task list (Tasks page) | `Tasks.jsx` | Passed as props to `TaskList`, `TasksCalenderView`, `TasksAnalyticsView` |
| Sidebar collapsed | `App.jsx` | Passed as props to `Sidebar` and `MainLayout` |
| Project search/filter | `ProjectTiles.jsx` (local) | Internal useState |

### Important File Locations
| File | Purpose |
|------|---------|
| `src/frontend/context/ThemeContext.jsx` | Dark mode toggle + persistence |
| `src/frontend/context/ProjectContext.jsx` | Global project list state |
| `src/frontend/index.css` | Tailwind v4 theme + MUI dark overrides |
| `prisma/schema.prisma` | Database schema (Project + Task) |
| `src/backend/config.js` | PrismaClient singleton |
| `ai-context/change-log.md` | Full history of every AI-assisted change |
| `.cursorrules` | Coding standards + project rules for Cursor |
| `docs/project-context.md` | Full technical reference |
