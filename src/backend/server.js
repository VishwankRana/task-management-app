import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import prisma from './config.js';
import router from './taskController.js';
import ProjectsRouter from './projectsController.js';
import AuthRouter from './authController.js';
import UsersRouter from './usersController.js';
import NotificationsRouter from './notificationsController.js';
import CommentsRouter from './commentsController.js';
import TaskCommentsRouter from './taskCommentsController.js';
import ChecklistRouter from './checklistController.js';
import { startCronJobs } from './cron/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin(origin, callback) {
    if (env.isAllowedOrigin(origin, env.corsOrigins)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({ status: 'error', message: 'Database unavailable' });
  }
});

app.use(AuthRouter);
app.use(UsersRouter);
app.use(NotificationsRouter);
app.use(CommentsRouter);
app.use(TaskCommentsRouter);
app.use(ChecklistRouter);
app.use(router);
app.use(ProjectsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API', env: env.nodeEnv });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route Not found' });
});

app.use((err, req, res, _next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy blocked this origin' });
  }
  console.error('Unhandled error:', err?.message || err);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(env.port, () => {
  console.log(`API listening on port ${env.port} (${env.nodeEnv})`);
  startCronJobs();
});

function shutdown(signal) {
  console.log(`${signal} received — shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
