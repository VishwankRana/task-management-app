import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';

const router = express.Router();

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/auth/register
router.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);
        return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login
router.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);
        return res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/logout
router.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
    return res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch user' });
    }
});

export default router;
