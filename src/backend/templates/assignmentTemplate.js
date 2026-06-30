import { wrapEmailLayout, formatEmailDate } from './emailLayout.js';

export function projectAddedTemplate({ userName, projectName, adminName, appUrl }) {
  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">
      <strong>${adminName}</strong> added you to the project
      <strong>${projectName}</strong>.
    </p>
    <p style="margin:0;line-height:1.6;color:#64748b;">
      You can now view tasks and collaborate with the project team.
    </p>`;

  return {
    subject: `You've been added to ${projectName}`,
    html: wrapEmailLayout({
      title: 'Added to a new project',
      bodyHtml,
      ctaLabel: 'View project',
      ctaUrl: `${appUrl}/projects`,
    }),
  };
}

export function assignmentTemplate({ userName, taskTitle, projectName, dueDate, priority, actorName, appUrl, projectId }) {
  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">
      <strong>${actorName}</strong> assigned you a new task in
      <strong>${projectName}</strong>.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="margin:16px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:0 0 8px;font-weight:700;color:#1D3557;">${taskTitle}</p>
          <p style="margin:0 0 4px;font-size:14px;color:#64748b;">Priority: <strong>${priority}</strong></p>
          <p style="margin:0;font-size:14px;color:#64748b;">Due: <strong>${formatEmailDate(dueDate)}</strong></p>
        </td>
      </tr>
    </table>`;

  return {
    subject: `New task assigned: ${taskTitle}`,
    html: wrapEmailLayout({
      title: 'New task assigned',
      bodyHtml,
      ctaLabel: 'View tasks',
      ctaUrl: `${appUrl}/projects/${projectId}/tasks`,
    }),
  };
}

export function taskUpdatedTemplate({ userName, taskTitle, projectName, changes, actorName, appUrl, projectId }) {
  const changeList = changes
    .map((c) => `<li style="margin-bottom:6px;">${c}</li>`)
    .join('');

  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">
      <strong>${actorName}</strong> updated your task
      <strong>${taskTitle}</strong> in <strong>${projectName}</strong>.
    </p>
    <ul style="margin:0;padding-left:20px;color:#475569;line-height:1.6;">${changeList}</ul>`;

  return {
    subject: `Task updated: ${taskTitle}`,
    html: wrapEmailLayout({
      title: 'Task updated',
      bodyHtml,
      ctaLabel: 'View task',
      ctaUrl: `${appUrl}/projects/${projectId}/tasks`,
    }),
  };
}

export function taskCompletedTemplate({ userName, taskTitle, projectName, completedBy, appUrl, projectId }) {
  const bodyHtml = `
    <p style="margin:0 0 12px;line-height:1.6;">Hi ${userName},</p>
    <p style="margin:0 0 12px;line-height:1.6;">
      The task <strong>${taskTitle}</strong> in
      <strong>${projectName}</strong> was marked as
      <strong style="color:#16a34a;">Completed</strong> by ${completedBy}.
    </p>`;

  return {
    subject: `Task completed: ${taskTitle}`,
    html: wrapEmailLayout({
      title: 'Task completed',
      bodyHtml,
      ctaLabel: 'View project',
      ctaUrl: `${appUrl}/projects/${projectId}/tasks`,
    }),
  };
}
