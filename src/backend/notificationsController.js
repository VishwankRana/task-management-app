import express from 'express';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { syncDueSoonNotifications } from './services/notificationService.js';

const router = express.Router();

router.use(authenticate);

router.get('/api/notifications', async (req, res) => {
    try {
        await syncDueSoonNotifications(req.user.id);

        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        const unreadCount = notifications.filter((n) => !n.read).length;

        res.status(200).json({ notifications, unreadCount });
    } catch (err) {
        console.error('Fetch notifications error:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.patch('/api/notifications/:id/read', async (req, res) => {
    try {
        const notification = await prisma.notification.findFirst({
            where: {
                id: Number(req.params.id),
                userId: req.user.id,
            },
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        const updated = await prisma.notification.update({
            where: { id: notification.id },
            data: { read: true },
        });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

router.patch('/api/notifications/read-all', async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, read: false },
            data: { read: true },
        });

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

export default router;
