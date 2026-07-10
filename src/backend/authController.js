import express from 'express';
import bcrypt from 'bcrypt';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { rateLimitForgotPassword } from './middleware/rateLimitForgotPassword.js';
import { rateLimitAuth } from './middleware/rateLimitAuth.js';
import {
  requestPasswordReset,
  resetPasswordWithToken,
  verifyResetToken,
} from './services/passwordReset.service.js';
import { exportUserData, deleteUserAccount } from './services/account.service.js';
import { publicUser } from './utils/userDto.js';
import { safeErrorMessage } from './utils/redact.js';
import { validatePassword } from './utils/validatePassword.js';
import { setAuthCookie, clearAuthCookie } from './utils/jwt.js';
import { logAudit, AuditAction, getClientIp } from './services/audit.service.js';
import { rotateUserSession } from './services/session.service.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function normalizeEmail(email) {
    return email?.trim().toLowerCase() ?? '';
}

// POST /api/auth/register — always creates User role (Admin via seed script only)
router.post('/api/auth/register', rateLimitAuth, async (req, res) => {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.error });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed, role: 'User' },
        });

        const sessionUser = await rotateUserSession(user.id);
        setAuthCookie(res, sessionUser);
        await logAudit({
            actorId: user.id,
            action: AuditAction.REGISTER,
            targetId: user.id,
            ip: getClientIp(req),
        });

        return res.status(201).json({ user: publicUser(sessionUser) });
    } catch (err) {
        console.error('Registration failed:', safeErrorMessage(err));
        return res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login
router.post('/api/auth/login', rateLimitAuth, async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    const ip = getClientIp(req);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                sessionVersion: true,
            },
        });
        if (!user) {
            await logAudit({ action: AuditAction.LOGIN_FAILED, ip });
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            await logAudit({ actorId: user.id, action: AuditAction.LOGIN_FAILED, ip });
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const sessionUser = await rotateUserSession(user.id);
        setAuthCookie(res, sessionUser);
        await logAudit({
            actorId: user.id,
            action: AuditAction.LOGIN_SUCCESS,
            targetId: user.id,
            ip,
        });

        return res.json({ user: publicUser(sessionUser) });
    } catch (err) {
        console.error('Login failed:', safeErrorMessage(err));
        return res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/logout
router.post('/api/auth/logout', async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await rotateUserSession(decoded.userId);
            await logAudit({
                actorId: decoded.userId,
                action: AuditAction.LOGOUT,
                targetId: decoded.userId,
                ip: getClientIp(req),
            });
        }
    } catch {
        // Cookie missing or invalid — still clear client state
    }

    clearAuthCookie(res);
    return res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                calendarEnabled: true,
                analyticsEnabled: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ user: publicUser(user) });
    } catch (err) {
        console.error('Fetch user failed:', safeErrorMessage(err));
        return res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// GET /api/auth/me/export
router.get('/api/auth/me/export', authenticate, async (req, res) => {
    try {
        const data = await exportUserData(req.user.id);

        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }

        await logAudit({
            actorId: req.user.id,
            action: AuditAction.DATA_EXPORT,
            targetId: req.user.id,
            ip: getClientIp(req),
        });

        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="task-manager-data-${req.user.id}.json"`
        );
        return res.status(200).json(data);
    } catch (err) {
        console.error('Data export failed:', safeErrorMessage(err));
        return res.status(500).json({ error: 'Failed to export data' });
    }
});

// DELETE /api/auth/account
router.delete('/api/auth/account', authenticate, async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required to delete your account' });
    }

    try {
        const result = await deleteUserAccount(req.user.id, password);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        await logAudit({
            actorId: req.user.id,
            action: AuditAction.ACCOUNT_DELETED,
            targetId: req.user.id,
            ip: getClientIp(req),
        });

        clearAuthCookie(res);
        return res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Account deletion failed:', safeErrorMessage(err));
        return res.status(500).json({ error: 'Failed to delete account' });
    }
});

const GENERIC_RESET_MESSAGE =
    'If an account exists with this email, a password reset link has been sent.';

// POST /api/auth/forgot-password
router.post('/api/auth/forgot-password', rateLimitForgotPassword, async (req, res) => {
    const email = normalizeEmail(req.body?.email);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required' });
    }

    try {
        await requestPasswordReset(email);
        return res.json({ message: GENERIC_RESET_MESSAGE });
    } catch (err) {
        console.error('Forgot password error:', safeErrorMessage(err));
        return res.json({ message: GENERIC_RESET_MESSAGE });
    }
});

// GET /api/auth/reset-password/verify?token=...
router.get('/api/auth/reset-password/verify', async (req, res) => {
    const rawToken = req.query.token?.trim();
    const result = await verifyResetToken(rawToken);
    if (!result.valid) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    return res.json({ valid: true });
});

// POST /api/auth/reset-password
router.post('/api/auth/reset-password', async (req, res) => {
    const { token: rawToken, password } = req.body;

    if (!rawToken) {
        return res.status(400).json({ error: 'Reset token is required' });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.error });
    }

    try {
        const result = await resetPasswordWithToken({ rawToken, newPassword: password });

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        const user = await prisma.user.findUnique({
            where: { id: result.userId },
            select: { id: true, name: true, email: true, role: true, sessionVersion: true },
        });

        if (!user) {
            return res.status(500).json({ error: 'Failed to reset password' });
        }

        await logAudit({
            actorId: user.id,
            action: AuditAction.PASSWORD_RESET,
            targetId: user.id,
            ip: getClientIp(req),
        });

        setAuthCookie(res, user);
        return res.json({
            message: 'Password has been reset successfully.',
            user: publicUser(user),
        });
    } catch (err) {
        console.error('Reset password error:', safeErrorMessage(err));
        return res.status(500).json({ error: 'Failed to reset password' });
    }
});

export default router;
