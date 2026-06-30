import express from 'express';
import prisma from './taskDB.js';
import { authenticate } from './middleware/authenticate.js';
import { requireProjectAccess, buildProjectTaskFilter, buildUserTaskFilter, requireTaskAccess } from './middleware/projectAccess.js';
import { resolveAssigneeId } from './middleware/taskAssignee.js';
import {
    notifyTaskAssigned,
    notifyTaskStatusChanged,
    notifyTaskPriorityChanged,
    notifyTaskFieldsUpdated,
} from './services/notificationService.js';
import { formatDueDate, emailTaskCompleted, getProjectName } from './services/notification.service.js';

const router = express.Router();

router.use(authenticate);

const taskInclude = {
    assignee: { select: { id: true, name: true, email: true } },
};

const formatTask = (task) => {
    if (!task) return null;
    const { assignee, ...rest } = task;
    return {
        ...rest,
        _id: rest.id,
        assigneeName: assignee?.name ?? null,
        assigneeEmail: assignee?.email ?? null,
    };
};

router.get('/api/taskmanager/tasks', async (req, res) => {
    try {
        const allTasks = await prisma.task.findMany({
            where: buildUserTaskFilter(req.user),
            include: taskInclude,
        });
        res.status(200).json(allTasks.map(formatTask));
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
            where: buildProjectTaskFilter(req.user, numProjectId),
            include: taskInclude,
        });
        res.status(200).json(findTask.map(formatTask));
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

        const { dueDate, assigneeId, ...rest } = req.body;

        let resolvedAssigneeId = null;
        if (req.user.role === 'Admin' && assigneeId) {
            resolvedAssigneeId = await resolveAssigneeId(numProjectId, assigneeId);
        }

        const saveTask = await prisma.task.create({
            data: {
                ...rest,
                dueDate: new Date(dueDate).toISOString(),
                projectId: numProjectId,
                assigneeId: resolvedAssigneeId,
            },
            include: taskInclude,
        });

        if (resolvedAssigneeId) {
            await notifyTaskAssigned({
                assigneeId: resolvedAssigneeId,
                actorName: req.user.name,
                task: saveTask,
                projectId: numProjectId,
            });
        }

        res.status(201).json(formatTask(saveTask));
    } catch (error) {
        if (error.message?.includes('Assignee')) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Full error:', error);
        res.status(500).json({
            message: "Error creating task",
            error: error.message,
            details: error.meta
        });
    }
});

router.delete('/api/taskmanager/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await requireTaskAccess(req.user, Number(id));

        if (!task) {
            return res.status(403).json({ message: "You do not have access to this task" });
        }

        const deleteTasks = await prisma.task.delete({
            where: { id: Number(id) },
            include: taskInclude,
        });
        res.status(200).json({ message: "Task Deleted", deleteTasks: formatTask(deleteTasks) });
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
        const taskAccess = await requireTaskAccess(req.user, Number(id));

        if (!taskAccess) {
            return res.status(403).json({ message: "You do not have access to this task" });
        }

        const existingTask = await prisma.task.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                projectId: true,
                assigneeId: true,
                status: true,
                priority: true,
                dueDate: true,
            },
        });

        const project = await prisma.project.findUnique({
            where: { id: existingTask.projectId },
            select: { ownerId: true },
        });

        const { dueDate, assigneeId, ...rest } = req.body;
        const data = { ...rest };

        if (dueDate) {
            data.dueDate = new Date(dueDate).toISOString();
        }

        if (req.user.role === 'Admin') {
            if (assigneeId !== undefined) {
                data.assigneeId = await resolveAssigneeId(taskAccess.projectId, assigneeId);
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data,
            include: taskInclude,
        });

        if (req.user.role === 'Admin') {
            const newAssigneeId = updatedTask.assigneeId;
            const emailChanges = [];

            if (dueDate && existingTask.dueDate) {
                const prevDue = new Date(existingTask.dueDate).getTime();
                const nextDue = new Date(dueDate).getTime();
                if (prevDue !== nextDue) {
                    emailChanges.push(`Due date changed to ${formatDueDate(dueDate)}`);
                }
            }

            if (assigneeId !== undefined && newAssigneeId && newAssigneeId !== existingTask.assigneeId) {
                await notifyTaskAssigned({
                    assigneeId: newAssigneeId,
                    actorName: req.user.name,
                    task: updatedTask,
                    projectId: existingTask.projectId,
                });
            }

            if (rest.status && rest.status !== existingTask.status && newAssigneeId) {
                await notifyTaskStatusChanged({
                    assigneeId: newAssigneeId,
                    taskTitle: existingTask.title,
                    taskId: existingTask.id,
                    projectId: existingTask.projectId,
                    newStatus: rest.status,
                    actorName: req.user.name,
                });
            }

            if (rest.priority && rest.priority !== existingTask.priority && newAssigneeId) {
                await notifyTaskPriorityChanged({
                    assigneeId: newAssigneeId,
                    taskTitle: existingTask.title,
                    taskId: existingTask.id,
                    projectId: existingTask.projectId,
                    newPriority: rest.priority,
                    actorName: req.user.name,
                });
                emailChanges.push(`Priority changed to ${rest.priority}`);
            }

            if (emailChanges.length && newAssigneeId) {
                await notifyTaskFieldsUpdated({
                    assigneeId: newAssigneeId,
                    actorName: req.user.name,
                    taskTitle: existingTask.title,
                    taskId: existingTask.id,
                    projectId: existingTask.projectId,
                    changes: emailChanges,
                });
            }
        }

        if (rest.status === 'Completed' && existingTask.status !== 'Completed' && project?.ownerId) {
            const projectMeta = await getProjectName(existingTask.projectId);
            emailTaskCompleted({
                ownerId: project.ownerId,
                taskTitle: existingTask.title,
                taskId: existingTask.id,
                projectId: existingTask.projectId,
                projectName: projectMeta?.projectName ?? 'Project',
                completedBy: req.user.name,
            }).catch((err) => console.error('Task completed email failed:', err.message));
        }

        res.status(200).json(formatTask(updatedTask));
    } catch (error) {
        if (error.message?.includes('Assignee')) {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(500).json({ message: "Failed to update task", error });
    }
});

export default router;
