import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import router from './taskController.js';
import ProjectsRouter from './projectsController.js';
import AuthRouter from './authController.js';
import NotificationsRouter from './notificationsController.js';
import CommentsRouter from './commentsController.js';
import { startCronJobs } from './cron/index.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(AuthRouter);
app.use(NotificationsRouter);
app.use(CommentsRouter);
app.use(router);
app.use(ProjectsRouter);

app.get('/', (req, res) => {
    res.json({ message: "Hola from backend" });
});

app.use((req, res) => {
    res.status(404).json({ error: "Route Not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => {
    console.log("Listening on Port 3000");
    startCronJobs();
});
