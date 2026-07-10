import { wrapEmailLayout } from './emailLayout.js';

export function passwordResetTemplate({ userName, resetUrl, expiryMinutes }) {
  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">
      We received a request to reset your Task Manager password.
      Click the button below to choose a new password.
    </p>
    <p style="margin:0 0 12px;line-height:1.6;color:#64748b;font-size:14px;">
      This link expires in <strong>${expiryMinutes} minutes</strong>.
      If you did not request a password reset, you can safely ignore this email.
    </p>`;

  return {
    subject: 'Reset your Task Manager password',
    html: wrapEmailLayout({
      title: 'Password reset',
      bodyHtml,
      ctaLabel: 'Reset password',
      ctaUrl: resetUrl,
    }),
  };
}
