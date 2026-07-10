import jwt from 'jsonwebtoken';
import prisma from '../config.js';

export async function authenticate(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true, sessionVersion: true },
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const tokenVersion = decoded.sessionVersion ?? 0;
        if (tokenVersion !== user.sessionVersion) {
            return res.status(401).json({
                error: 'Your session was ended because you signed in elsewhere.',
                code: 'SESSION_SUPERSEDED',
            });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
