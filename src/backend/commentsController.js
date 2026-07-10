import express from 'express';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { requireProjectAccess } from './middleware/projectAccess.js';
import { safeErrorMessage } from './utils/redact.js';

const router = express.Router();

router.use(authenticate);

const formatComment = (comment) => ({
    id: comment.id,
    content: comment.content,
    projectId: comment.projectId,
    userId: comment.userId,
    authorName: comment.user.name,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
});

router.get('/api/taskmanager/projects/:projectId/comments', async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const access = await requireProjectAccess(req.user, projectId);

        if (!access) {
            return res.status(403).json({ error: 'You do not have access to this project' });
        }

        const comments = await prisma.comment.findMany({
            where: { projectId },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(comments.map(formatComment));
    } catch (err) {
        console.error('Fetch comments error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

router.post('/api/taskmanager/projects/:projectId/comments', async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const access = await requireProjectAccess(req.user, projectId);

        if (!access) {
            return res.status(403).json({ error: 'You do not have access to this project' });
        }

        const content = req.body.content?.trim();
        if (!content) {
            return res.status(400).json({ error: 'Comment content is required' });
        }
        if (content.length > 1000) {
            return res.status(400).json({ error: 'Comment must be 1000 characters or less' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                projectId,
                userId: req.user.id,
            },
            include: { user: { select: { id: true, name: true } } },
        });

        res.status(201).json(formatComment(comment));
    } catch (err) {
        console.error('Create comment error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

export default router;
