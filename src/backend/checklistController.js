import express from 'express';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { requireTaskAccess } from './middleware/projectAccess.js';
import { safeErrorMessage } from './utils/redact.js';
import {
    formatChecklistItem,
    validateChecklistText,
    getChecklistItemsForTask,
    getNextChecklistOrder,
    findChecklistItemForTask,
    reorderChecklistItems,
} from './services/checklist.service.js';

const router = express.Router();

router.use(authenticate);

async function requireTaskEditAccess(user, taskId) {
    return requireTaskAccess(user, taskId);
}

router.get('/api/taskmanager/tasks/:taskId/checklist', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const taskAccess = await requireTaskEditAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const items = await getChecklistItemsForTask(taskId);
        res.status(200).json(items.map(formatChecklistItem));
    } catch (err) {
        console.error('Fetch checklist error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to fetch checklist items' });
    }
});

router.post('/api/taskmanager/tasks/:taskId/checklist', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const taskAccess = await requireTaskEditAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const textCheck = validateChecklistText(req.body.text);
        if (!textCheck.valid) {
            return res.status(400).json({ error: textCheck.error });
        }

        const order = await getNextChecklistOrder(taskId);
        const item = await prisma.checklistItem.create({
            data: {
                taskId,
                text: textCheck.value,
                order,
            },
        });

        res.status(201).json(formatChecklistItem(item));
    } catch (err) {
        console.error('Create checklist item error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to create checklist item' });
    }
});

router.put('/api/taskmanager/tasks/:taskId/checklist/reorder', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const taskAccess = await requireTaskEditAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const items = await reorderChecklistItems(taskId, req.body.orderedIds);
        res.status(200).json(items.map(formatChecklistItem));
    } catch (err) {
        if (err.message?.includes('Invalid checklist') || err.message?.includes('orderedIds')) {
            return res.status(400).json({ error: err.message });
        }
        console.error('Reorder checklist error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to reorder checklist items' });
    }
});

router.put('/api/taskmanager/tasks/:taskId/checklist/:itemId', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const itemId = Number(req.params.itemId);
        const taskAccess = await requireTaskEditAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const existing = await findChecklistItemForTask(taskId, itemId);
        if (!existing) {
            return res.status(404).json({ error: 'Checklist item not found' });
        }

        const data = {};

        if (req.body.text !== undefined) {
            const textCheck = validateChecklistText(req.body.text);
            if (!textCheck.valid) {
                return res.status(400).json({ error: textCheck.error });
            }
            data.text = textCheck.value;
        }

        if (req.body.isCompleted !== undefined) {
            data.isCompleted = Boolean(req.body.isCompleted);
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const item = await prisma.checklistItem.update({
            where: { id: itemId },
            data,
        });

        res.status(200).json(formatChecklistItem(item));
    } catch (err) {
        console.error('Update checklist item error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to update checklist item' });
    }
});

router.patch('/api/taskmanager/tasks/:taskId/checklist/:itemId/toggle', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const itemId = Number(req.params.itemId);
        const taskAccess = await requireTaskEditAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const existing = await findChecklistItemForTask(taskId, itemId);
        if (!existing) {
            return res.status(404).json({ error: 'Checklist item not found' });
        }

        const item = await prisma.checklistItem.update({
            where: { id: itemId },
            data: { isCompleted: !existing.isCompleted },
        });

        res.status(200).json(formatChecklistItem(item));
    } catch (err) {
        console.error('Toggle checklist item error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to toggle checklist item' });
    }
});

router.delete('/api/taskmanager/tasks/:taskId/checklist/:itemId', async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const itemId = Number(req.params.itemId);
        const taskAccess = await requireTaskEditAccess(req.user, taskId);

        if (!taskAccess) {
            return res.status(403).json({ error: 'You do not have access to this task' });
        }

        const existing = await findChecklistItemForTask(taskId, itemId);
        if (!existing) {
            return res.status(404).json({ error: 'Checklist item not found' });
        }

        await prisma.checklistItem.delete({ where: { id: itemId } });
        res.status(200).json({ message: 'Checklist item deleted', id: itemId });
    } catch (err) {
        console.error('Delete checklist item error:', safeErrorMessage(err));
        res.status(500).json({ error: 'Failed to delete checklist item' });
    }
});

export default router;
