import express from 'express';
import prisma from './taskDB.js';
import { authenticate } from './middleware/authenticate.js';
import { requireProjectAccess } from './middleware/projectAccess.js';

const router = express.Router();

router.use(authenticate);

const withId = (obj) => obj ? { ...obj, _id: obj.id } : null;

router.get('/api/taskmanager/tasks', async (req, res) => {
    try {
        const where =
            req.user.role === 'Admin'
                ? { project: { ownerId: req.user.id } }
                : { project: { members: { some: { userId: req.user.id } } } };

        const allTasks = await prisma.task.findMany({ where });
        res.status(200).json(allTasks.map(withId));
    } catch (err) {
        res.status(500).json({ message: "Error fetching all Tasks", error: err });
    }
});

router.get('/api/taskmanager/projects/:projectId/tasks', async (req, res) => {
    try {
        const { projectId } = req.params;
        const numProjectId = Number(projectId);
        const access = await requireProjectAccess(req.user, numProjectId);

        if (!access) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const findTask = await prisma.task.findMany({
            where: { projectId: numProjectId }
        });
        res.status(200).json(findTask.map(withId));
    } catch (err) {
        res.status(500).json({ message: "Error fetching Tasks", error: err });
    }
});

router.post('/api/taskmanager/projects/:projectId/tasks', async (req, res) => {
    try {
        const { projectId } = req.params;
        const numProjectId = Number(projectId);
        const access = await requireProjectAccess(req.user, numProjectId);

        if (!access) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const { dueDate, ...rest } = req.body;
        const saveTask = await prisma.task.create({
            data: {
                ...rest,
                dueDate: new Date(dueDate).toISOString(),
                projectId: numProjectId
            }
        });
        res.status(201).json(withId(saveTask));
    } catch (error) {
        console.error('Full error:', error);
        res.status(500).json({
            message: "Error Updating the Task",
            error: error.message,
            details: error.meta
        });
    }
});

router.delete('/api/taskmanager/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
            select: { projectId: true },
        });

        if (!task) {
            return res.status(404).json({ message: "Tasks not found" });
        }

        const access = await requireProjectAccess(req.user, task.projectId);
        if (!access) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const deleteTasks = await prisma.task.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: "Task Deleted", deleteTasks: withId(deleteTasks) });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Tasks not found" });
        }
        res.status(500).json({ message: "Failed to delete task", error });
    }
});

router.put('/api/taskmanager/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
            select: { projectId: true },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const access = await requireProjectAccess(req.user, task.projectId);
        if (!access) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const { dueDate, ...rest } = req.body;
        const data = dueDate ? { ...rest, dueDate: new Date(dueDate).toISOString() } : rest;
        const updatedTasks = await prisma.task.update({
            where: { id: Number(id) },
            data
        });
        res.status(200).json(withId(updatedTasks));
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(500).json({ message: "Failed to update task", error });
    }
});

export default router;
