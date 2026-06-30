import { wrapEmailLayout, formatEmailDate } from './emailLayout.js';

export function reminderTemplate({ userName, tasks, appUrl }) {
  const taskRows = tasks
    .map(
      (t) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0 0 4px;font-weight:700;color:#1D3557;">${t.title}</p>
          <p style="margin:0;font-size:13px;color:#64748b;">
            ${t.projectName} · Due ${formatEmailDate(t.dueDate)} · ${t.priority}
          </p>
        </td>
      </tr>`
    )
    .join('');

  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 16px;line-height:1.6;">
      The following task${tasks.length > 1 ? 's are' : ' is'} due within the next 24 hours:
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${taskRows}</table>`;

  return {
    subject: `Reminder: ${tasks.length} task${tasks.length > 1 ? 's' : ''} due within 24 hours`,
    html: wrapEmailLayout({
      title: 'Task due soon',
      bodyHtml,
      ctaLabel: 'Open dashboard',
      ctaUrl: appUrl,
    }),
  };
}
