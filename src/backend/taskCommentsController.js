import express from 'express';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { requireTaskAccess } from './middleware/projectAccess.js';
import { safeErrorMessage } from './utils/redact.js';

const router = express.Router();

router.use(authenticate);

const formatTaskComment = (comment) => ({
    id: comment.id,
    content: comment.content,
    taskId: comment.taskId,
    userId: comment.userId,
    authorName: comment.user.name,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
});

router.get('/api/taskmanager/tasks/:taskId/comments', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const taskAccess = await requireTaskAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const comments = await prisma.taskComment.findMany({
            where: { taskId },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json(comments.map(formatTaskComment));
    } catch (err) {
        console.error('Fetch task comments error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to fetch task comments' });
    }
});

router.post('/api/taskmanager/tasks/:taskId/comments', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const taskAccess = await requireTaskAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const content = req.body.content?.trim();
        if (!content) {
            return res.status(400).json({ error: 'Comment content is required' });
        }
        if (content.length > 1000) {
            return res.status(400).json({ error: 'Comment must be 1000 characters or less' });
        }

        const comment = await prisma.taskComment.create({
            data: {
                content,
                taskId,
                userId: req.user.id,
            },
            include: { user: { select: { id: true, name: true } } },
        });

        res.status(201).json(formatTaskComment(comment));
    } catch (err) {
        console.error('Create task comment error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to create task comment' });
    }
});

export default router;
