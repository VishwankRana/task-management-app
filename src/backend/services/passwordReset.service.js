import { createHash, randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '../config.js';
import { sendEmail, getAppUrl } from './email.service.js';
import { passwordResetTemplate } from '../templates/resetPasswordTemplate.js';
import { safeErrorMessage } from '../utils/redact.js';

const RESET_TOKEN_BYTES = 32;
const RESET_EXPIRY_MINUTES = Number(process.env.PASSWORD_RESET_EXPIRY_MINUTES) || 30;

function hashToken(rawToken) {
  return createHash('sha256').update(rawToken).digest('hex');
}

export async function createPasswordResetToken(userId) {
  await prisma.passwordResetToken.deleteMany({
    where: { userId, usedAt: null },
  });

  const rawToken = randomBytes(RESET_TOKEN_BYTES).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return { rawToken, expiresAt };
}

export async function sendPasswordResetEmail({ user, rawToken }) {
  const appUrl = getAppUrl();
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
  const { subject, html } = passwordResetTemplate({
    userName: user.name,
    resetUrl,
    expiryMinutes: RESET_EXPIRY_MINUTES,
  });

  await sendEmail({ to: user.email, subject, html });
}

export function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? '';
}

export async function requestPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return { sent: false };
  }

  const { rawToken } = await createPasswordResetToken(user.id);

  try {
    await sendPasswordResetEmail({ user, rawToken });
    return { sent: true };
  } catch (err) {
    console.error('Password reset email failed:', safeErrorMessage(err));
    return { sent: false };
  }
}

export async function resetPasswordWithToken({ rawToken, newPassword }) {
  const tokenHash = hashToken(rawToken);

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: { select: { id: true } } },
  });

  if (!record) {
    return { success: false, error: 'Invalid or expired reset token' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        password: hashedPassword,
        sessionVersion: { increment: 1 },
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.deleteMany({
      where: {
        userId: record.userId,
        id: { not: record.id },
      },
    }),
  ]);

  return { success: true, userId: record.userId };
}

export async function verifyResetToken(rawToken) {
  if (!rawToken) return { valid: false };

  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  return { valid: Boolean(record) };
}
