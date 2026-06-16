# Task Manager — Project Context

## Overview

A full-stack project and task management web application. Users create projects, break them
down into tasks, and track progress through a dashboard, calendar, and analytics views.
The app has a fully responsive dark mode and a collapsible sidebar.

---

## Tech Stack

### Frontend
| Library | Version | Role |
|---------|---------|------|
| React | 19 | UI framework |
| Vite | 7 | Build tool + dev server |
| Tailwind CSS | 4 | Utility-first styling (via `@tailwindcss/vite`) |
| MUI (Material UI) | 7 | Icon set, Dialog, Menu, DatePicker, SpeedDial |
| lucide-react | latest | Lightweight icons (Search, Moon, Sun, X, SlidersHorizontal, ChevronDown, Check, etc.) |
| React Router | 7 | Client-side routing |
| axios | 1.x | HTTP client |
| react-hot-toast | 2.x | Toast notifications |
| chart.js + react-chartjs-2 | 4.x / 5.x | Analytics charts |
| dayjs / date-fns | latest | Date formatting + manipulation |
| clsx + tailwind-merge | latest | Conditional className utility (`cn()`) |

### Backend
| Library | Version | Role |
|---------|---------|------|
| Node.js | - | Runtime |
| Express | 5 | HTTP framework |
| Prisma | 7 | ORM |
| `@prisma/adapter-mariadb` | 7 | MySQL/MariaDB adapter |
| mysql2 | 3.x | MySQL driver |
| cors | 2.x | Cross-origin headers |
| dotenv | 17 | Environment variables |

### Database
- **MySQL / MariaDB** via Prisma ORM
- Schema defined at `prisma/schema.prisma`
- Connection string via `DATABASE_URL` in `.env`

---

## Project Structure

```
task-manager/
├── .cursorrules                     # Cursor AI coding rules + project context
├── prisma/
│   ├── schema.prisma                # Data models: Project, Task
│   └── migrations/                  # Prisma migration history
├── src/
│   ├── frontend/                    # Vite root (index.html here)
│   │   ├── app.jsx                  # Root component + routing
│   │   ├── main.jsx                 # Entry: providers + ReactDOM.render
│   │   ├── index.css                # Tailwind v4 base + CSS vars + MUI dark overrides
│   │   ├── context/
│   │   │   ├── ProjectContext.jsx   # Global project list state
│   │   │   └── ThemeContext.jsx     # Dark mode state + html class toggle
│   │   ├── hooks/
│   │   │   ├── useProjects.jsx      # projects + completedProjects + inProgressProjects
│   │   │   └── useTasks.jsx         # All tasks across all projects
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # Collapsible nav + dark toggle
│   │   │   ├── MainLayout.jsx       # Outlet wrapper, synced padding
│   │   │   ├── Dashboard.jsx        # Dashboard page
│   │   │   ├── Projects.jsx         # Projects page
│   │   │   ├── Tasks.jsx            # Tasks page (header + stat cards + views)
│   │   │   ├── taskTile.jsx         # Single task row component
│   │   │   ├── TasksCalenderView.jsx
│   │   │   └── TasksAnalyticsView.jsx
│   │   ├── components/
│   │   │   ├── ProjectTiles.jsx     # Card grid + search input + FilterDropdown (status + priority)
│   │   │   │                        #   ├─ FilterDropdown  (local) custom panel dropdown
│   │   │   │                        #   └─ ProjectCard     (local) single project card
│   │   │   ├── TaskList.jsx         # Task table container
│   │   │   ├── NewTaskModal.jsx
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── NewProjectBtn.jsx
│   │   │   ├── ProjectSettingsModal.jsx
│   │   │   ├── DarkModeToggle.jsx   # Sun/Moon toggle (lucide-react icons)
│   │   │   ├── ArrowBackButton.jsx  # Dark-mode aware via useTheme()
│   │   │   ├── ArrowForwardButton.jsx # Dark-mode aware via useTheme()
│   │   │   ├── StatusTaskChart.jsx  # Bar chart — axis/legend colors from isDark
│   │   │   └── PriorityPieChart.jsx # Pie chart — legend colors from isDark
│   │   ├── SummaryOverview/         # Dashboard top stat tiles
│   │   │   ├── TotalProjectTile.jsx
│   │   │   ├── CompletedProjects.jsx
│   │   │   ├── InProgressProjectsTile.jsx
│   │   │   └── MyTasks.jsx
│   │   ├── ProjectOverview/         # Dashboard left-column panels
│   │   │   ├── ProjectOverview.jsx
│   │   │   ├── ProjectOverviewTile.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   └── RecentActivityTile.jsx
│   │   ├── DashboardWidgets/        # Dashboard right-column widgets
│   │   │   ├── TodaysFocus.jsx
│   │   │   └── WeekAtAGlance.jsx
│   │   └── TasksSummary/
│   │       └── MyTasksSummary.jsx
│   ├── backend/
│   │   ├── server.js                # Express app entry + route mounting
│   │   ├── config.js                # PrismaClient singleton
│   │   ├── projectsDB.js            # Re-exports prisma for projects
│   │   ├── taskDB.js                # Re-exports prisma for tasks
│   │   ├── projectsController.js    # Projects router
│   │   └── taskController.js        # Tasks router
│   └── lib/
│       └── utils.js                 # cn() helper (clsx + tailwind-merge)
├── ai-context/
│   ├── change-log.md               # Full AI change history
│   └── memory.md                   # Feature status + known issues
└── docs/
    └── project-context.md          # This file
```

---

## Database Schema

### Project
| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment PK |
| `projectName` | String(100) | Required |
| `projectDescription` | String(500) | Optional |
| `projectStatus` | String | Planning / Active / In Progress / Completed / On Hold / Cancelled |
| `projectPriority` | String | High / Medium / Low |
| `projectStartDate` | DateTime | Required |
| `projectEndDate` | DateTime | Required |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |
| `tasks` | Task[] | One-to-many relation |

### Task
| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment PK |
| `title` | String(100) | Required |
| `description` | String(500) | Optional |
| `dueDate` | DateTime | Required |
| `priority` | String | Low / Medium / High / Urgent — default "Medium" |
| `type` | String | default "Task" |
| `status` | String | Pending / In-progress / Completed / Cancelled — default "Pending" |
| `projectId` | Int | FK → Project.id |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

> **Note:** All backend responses include an `_id` alias alongside `id` for frontend compatibility.

---

## API Reference

### Projects — `/api/taskmanager/projects`

| Method | Path | Body | Response | Description |
|--------|------|------|----------|-------------|
| GET | `/api/taskmanager/projects` | — | `Project[]` | All projects |
| GET | `/api/taskmanager/projects/:id` | — | `Project` | Single project |
| POST | `/api/taskmanager/projects` | `{ projectName, projectDescription?, projectStatus?, projectPriority?, projectStartDate, projectEndDate }` | `Project` | Create project |
| PUT | `/api/taskmanager/projects/:id` | Partial project fields | `{ message, updatedProject }` | Update project |
| DELETE | `/api/taskmanager/projects/:id` | — | `{ message, deletedProjects, deletedTasks }` | Delete project + cascade tasks |

### Tasks — `/api/taskmanager/tasks`

| Method | Path | Body | Response | Description |
|--------|------|------|----------|-------------|
| GET | `/api/taskmanager/tasks` | — | `Task[]` | All tasks (all projects) |
| GET | `/api/taskmanager/projects/:projectId/tasks` | — | `Task[]` | Tasks for one project |
| POST | `/api/taskmanager/projects/:projectId/tasks` | `{ title, description?, dueDate, priority?, type?, status? }` | `Task` | Create task |
| PUT | `/api/taskmanager/tasks/:id` | Partial task fields | `Task` | Update task |
| DELETE | `/api/taskmanager/tasks/:id` | — | `{ message, deleteTasks }` | Delete task |

---

## Routes (Frontend)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `DashboardLayout` | Dashboard with summary tiles and widgets |
| `/projects` | `ProjectLayout` | Project card grid with search + filter |
| `/projects/:projectId/tasks` | `TasksLayout` | Tasks for a project (list / calendar / analytics) |

---

## Main Features

### Dashboard
- **Summary row** — Total Projects, Completed, In Progress, My Tasks (with flyout panel)
- **Project Overview** — top 2 projects with status badge and deadline
- **Recent Activity** — latest 3 tasks across all projects
- **Today's Focus** — tasks due today with progress bar and priority badges
- **Week at a Glance** — 7-column bar chart of tasks due per day, hover tooltip

### Projects Page
- Project cards with name, description, status badge, priority badge
- Per-card hamburger menu → Tasks / Calendar / Analytics / Settings
- Project Settings modal (edit all fields)
- **Live search** by project name (`Search` icon, filters `projectName` client-side)
- **Status filter** — custom `FilterDropdown` (7 values: All / Planning / Active / In Progress / Completed / On Hold / Cancelled)
- **Priority filter** — custom `FilterDropdown` (4 values: All / High / Medium / Low)
- Active filter count badge on the filter icon + one-click Clear all filters
- `FilterDropdown` details: `rounded-2xl` panel, `mt-2` offset below trigger, `Check` icon on selected option, trigger turns orange when active, closes on outside `mousedown`
- "No results" empty state is distinct from "no projects at all" empty state

### Tasks Page
- Four clickable stat cards to filter the task list by status
- **Task List view** — table with priority badge, status, due date, type, edit/delete
- **Calendar view** — monthly grid with task count per day; click a day to see that day's tasks in a side panel; status badges on each task
- **Analytics view** — Bar chart (tasks by status) + Pie chart (tasks by priority)

### Dark Mode
- Toggle via moon/sun button in every page header and at the sidebar bottom
- `ThemeContext` toggles `.dark` class on `<html>`; exposed via `useTheme()` → `{ isDark, toggleTheme }`
- Preference persisted in `localStorage`
- Full coverage: sidebar, headers, cards, badges, charts, modals, dialogs, filter dropdowns
- Vivid badge glow pattern: `dark:bg-[color]-500/25 dark:text-[color]-200 dark:border dark:border-[color]-500/50`
- Navy MUI icons (`#1d3557`) switch to white (`#e2e8f0`) in dark mode via `useTheme()` + `sx` prop
- `ArrowBackButton` / `ArrowForwardButton`: arrow color becomes white in dark mode
- Chart.js (bar + pie): axis tick labels, gridlines, and legend text are dynamically colored via `isDark`
- Custom Tailwind variant: `@custom-variant dark (&:is(.dark *))` declared in `index.css`
- MUI Paper / Dialog / Menu backgrounds styled via `sx` prop using `isDark`

---

## Environment Setup

```bash
# Install dependencies
npm install

# Set up .env (copy and fill in your MySQL connection string)
DATABASE_URL="mysql://user:password@localhost:3306/taskmanager"

# Run Prisma migrations
npx prisma migrate dev --name init

# Start dev server (runs both Vite frontend + Express backend via npm run dev)
npm run dev
```

> Frontend: `http://localhost:5173`  
> Backend API: `http://localhost:3000`
