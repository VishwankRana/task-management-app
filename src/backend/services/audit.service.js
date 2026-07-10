import prisma from '../config.js';
import { safeErrorMessage } from '../utils/redact.js';

export const AuditAction = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
  DATA_EXPORT: 'DATA_EXPORT',
  VIEW_USERS_LIST: 'VIEW_USERS_LIST',
  UPDATE_USER_FEATURES: 'UPDATE_USER_FEATURES',
};

export async function logAudit({ actorId = null, action, targetId = null, ip = null }) {
  try {
    await prisma.auditLog.create({
      data: { actorId, action, targetId, ip },
    });
  } catch (err) {
    console.error('Audit log failed:', safeErrorMessage(err));
  }
}

export function getClientIp(req) {
  return req.ip || req.socket?.remoteAddress || null;
}
