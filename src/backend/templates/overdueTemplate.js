import { wrapEmailLayout, formatEmailDate } from './emailLayout.js';

export function overdueTemplate({ userName, tasks, appUrl }) {
  const taskRows = tasks
    .map(
      (t) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0 0 4px;font-weight:700;color:#b91c1c;">${t.title}</p>
          <p style="margin:0;font-size:13px;color:#64748b;">
            ${t.projectName} · Was due ${formatEmailDate(t.dueDate)} · ${t.status}
          </p>
        </td>
      </tr>`
    )
    .join('');

  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 16px;line-height:1.6;">
      You have <strong style="color:#b91c1c;">${tasks.length}</strong>
      overdue task${tasks.length > 1 ? 's' : ''} that still need attention:
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${taskRows}</table>`;

  return {
    subject: `Overdue: ${tasks.length} task${tasks.length > 1 ? 's' : ''} past due date`,
    html: wrapEmailLayout({
      title: 'Overdue tasks',
      bodyHtml,
      ctaLabel: 'Review tasks',
      ctaUrl: appUrl,
    }),
  };
}
