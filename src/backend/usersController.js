import express from 'express';
import prisma from './config.js';
import { authenticate } from './middleware/authenticate.js';
import { authorize } from './middleware/authorize.js';
import { adminUser } from './utils/userDto.js';
import { safeErrorMessage } from './utils/redact.js';
import { logAudit, AuditAction, getClientIp } from './services/audit.service.js';

const router = express.Router();

const userFeatureSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  calendarEnabled: true,
  analyticsEnabled: true,
  createdAt: true,
  updatedAt: true,
};

router.get('/api/auth/users', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search = req.query.search?.trim() ?? '';
    const role = req.query.role?.trim() ?? '';

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role && (role === 'Admin' || role === 'User')) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userFeatureSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = users.map((u) => ({
      ...adminUser(u),
      status: 'Active',
    }));

    res.status(200).json({
      users: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });

    await logAudit({
      actorId: req.user.id,
      action: AuditAction.VIEW_USERS_LIST,
      ip: getClientIp(req),
    });
  } catch (err) {
    console.error('List users error:', safeErrorMessage(err));
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/api/auth/users/:id/feature-access', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        calendarEnabled: true,
        analyticsEnabled: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      calendarEnabled: user.calendarEnabled,
      analyticsEnabled: user.analyticsEnabled,
    });
  } catch (err) {
    console.error('Get feature access error:', safeErrorMessage(err));
    res.status(500).json({ error: 'Failed to fetch feature access' });
  }
});

router.patch('/api/auth/users/:id/feature-access', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { calendarEnabled, analyticsEnabled } = req.body;

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, name: true },
    });

    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (target.role === 'Admin') {
      return res.status(400).json({ error: 'Admin accounts always have full access' });
    }

    const data = {};
    if (typeof calendarEnabled === 'boolean') data.calendarEnabled = calendarEnabled;
    if (typeof analyticsEnabled === 'boolean') data.analyticsEnabled = analyticsEnabled;

    if (!Object.keys(data).length) {
      return res.status(400).json({ error: 'No valid feature flags provided' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        calendarEnabled: true,
        analyticsEnabled: true,
      },
    });

    await logAudit({
      actorId: req.user.id,
      action: AuditAction.UPDATE_USER_FEATURES,
      targetId: userId,
      ip: getClientIp(req),
    });

    return res.status(200).json({
      message: 'Feature access updated',
      user: adminUser(updated),
    });
  } catch (err) {
    console.error('Update feature access error:', safeErrorMessage(err));
    res.status(500).json({ error: 'Failed to update feature access' });
  }
});

export default router;
