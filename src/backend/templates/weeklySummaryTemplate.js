import { wrapEmailLayout, formatEmailDate } from './emailLayout.js';

export function weeklySummaryTemplate({ userName, tasks, appUrl }) {
  const taskRows = tasks.length
    ? tasks
        .map(
          (t) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
            <p style="margin:0 0 4px;font-weight:700;color:#1D3557;">${t.title}</p>
            <p style="margin:0;font-size:13px;color:#64748b;">
              ${t.projectName} · Due ${formatEmailDate(t.dueDate)} · ${t.priority} · ${t.status}
            </p>
          </td>
        </tr>`
        )
        .join('')
    : `<tr><td style="padding:16px 0;color:#64748b;">No pending tasks this week. Great job!</td></tr>`;

  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 16px;line-height:1.6;">
      Here is your weekly summary of pending tasks
      ${tasks.length ? `(${tasks.length} total)` : ''}:
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${taskRows}</table>`;

  return {
    subject: `Weekly summary: ${tasks.length} pending task${tasks.length === 1 ? '' : 's'}`,
    html: wrapEmailLayout({
      title: 'Weekly task summary',
      bodyHtml,
      ctaLabel: 'Open dashboard',
      ctaUrl: appUrl,
    }),
  };
}
