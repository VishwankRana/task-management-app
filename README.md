# Task Manager

A full-stack task management app built with React, Vite, Express, and MongoDB.

The app is centered around projects and tasks. Users can create projects, open a project workspace, add tasks, track progress, and view task data in list, calendar, and analytics views.

## Features

- Dashboard with project and task summary cards
- Create and view projects
- Project-specific task workspace
- Create tasks with status, priority, type, and due date
- Task list view
- Calendar view for upcoming task deadlines
- Analytics view with status and priority charts
- Project settings page for updating project details
- REST API for projects and tasks

## Tech Stack

- React
- Vite
- Tailwind CSS
- Material UI
- Express
- MongoDB with Mongoose
- Chart.js

## Routes

- `/` - Dashboard
- `/projects` - All projects
- `/projects/:projectId/tasks` - Task workspace for a project

## API

Projects:

- `GET /api/taskmanager/projects`
- `GET /api/taskmanager/projects/:id`
- `POST /api/taskmanager/projects`
- `PUT /api/taskmanager/projects/:id`
- `DELETE /api/taskmanager/projects/:id`

Tasks:

- `GET /api/taskmanager/tasks`
- `GET /api/taskmanager/projects/:projectId/tasks`
- `POST /api/taskmanager/projects/:projectId/tasks`
- `PUT /api/taskmanager/tasks/:id`
- `DELETE /api/taskmanager/tasks/:id`

## Local Setup

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Start the backend:

```bash
node src/backend/server.js
```

MongoDB should be running locally. The current connection string is:

```text
mongodb://localhost:27017/TaskManagerDB
```

## Notes

- The frontend currently calls the backend at `http://localhost:3000`
- There is no backend npm script yet
- Authentication is not implemented yet
