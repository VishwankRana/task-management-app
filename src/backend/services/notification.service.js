import prisma from '../config.js';
import { sendEmail, getAppUrl, isEmailConfigured } from './email.service.js';
import {
  projectAddedTemplate,
  assignmentTemplate,
  taskUpdatedTemplate,
  taskCompletedTemplate,
} from '../templates/assignmentTemplate.js';
import { reminderTemplate } from '../templates/reminderTemplate.js';
import { overdueTemplate } from '../templates/overdueTemplate.js';
import { weeklySummaryTemplate } from '../templates/weeklySummaryTemplate.js';

export const EMAIL_TYPES = {
  PROJECT_ADDED: 'PROJECT_ADDED',
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  DUE_24H: 'DUE_24H',
  OVERDUE: 'OVERDUE',
  WEEKLY_SUMMARY: 'WEEKLY_SUMMARY',
};

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDueDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function getUserById(userId) {
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
}

async function wasEmailSentToday({ userId, taskId, type }) {
  const today = startOfDay();
  const existing = await prisma.emailLog.findFirst({
    where: {
      userId,
      type,
      sentDate: today,
      ...(taskId != null ? { taskId } : {}),
    },
  });
  return Boolean(existing);
}

async function recordEmailSent({ userId, taskId, projectId, type }) {
  await prisma.emailLog.create({
    data: {
      userId,
      taskId: taskId ?? null,
      projectId: projectId ?? null,
      type,
      sentDate: startOfDay(),
    },
  });
}

async function safeSendEmail(payload) {
  if (!isEmailConfigured()) return null;

  try {
    return await sendEmail(payload);
  } catch (err) {
    console.error('Email send failed:', err.message);
    return null;
  }
}

export async function emailProjectAdded({ userId, projectId, projectName, adminName }) {
  const user = await getUserById(userId);
  if (!user?.email) return;

  const appUrl = getAppUrl();
  const { subject, html } = projectAddedTemplate({
    userName: user.name,
    projectName,
    adminName,
    appUrl,
  });

  const sent = await safeSendEmail({ to: user.email, subject, html });
  if (sent) {
    await recordEmailSent({ userId, projectId, type: EMAIL_TYPES.PROJECT_ADDED });
  }
}

export async function emailTaskAssigned({ assigneeId, actorName, task, projectId, projectName }) {
  const user = await getUserById(assigneeId);
  if (!user?.email) return;

  const appUrl = getAppUrl();
  const { subject, html } = assignmentTemplate({
    userName: user.name,
    taskTitle: task.title,
    projectName,
    dueDate: task.dueDate,
    priority: task.priority,
    actorName,
    appUrl,
    projectId,
  });

  await safeSendEmail({ to: user.email, subject, html });
}

export async function emailTaskUpdated({
  assigneeId,
  actorName,
  taskTitle,
  taskId,
  projectId,
  projectName,
  changes,
}) {
  if (!assigneeId || !changes?.length) return;

  const user = await getUserById(assigneeId);
  if (!user?.email) return;

  const appUrl = getAppUrl();
  const { subject, html } = taskUpdatedTemplate({
    userName: user.name,
    taskTitle,
    projectName,
    changes,
    actorName,
    appUrl,
    projectId,
  });

  await safeSendEmail({ to: user.email, subject, html });
}

export async function emailTaskCompleted({
  ownerId,
  taskTitle,
  taskId,
  projectId,
  projectName,
  completedBy,
}) {
  const user = await getUserById(ownerId);
  if (!user?.email) return;

  const appUrl = getAppUrl();
  const { subject, html } = taskCompletedTemplate({
    userName: user.name,
    taskTitle,
    projectName,
    completedBy,
    appUrl,
    projectId,
  });

  await safeSendEmail({ to: user.email, subject, html });
}

export async function emailDueWithin24Hours({ userId, tasks }) {
  if (!tasks?.length) return;

  const user = await getUserById(userId);
  if (!user?.email) return;

  const pendingTasks = [];
  for (const task of tasks) {
    const alreadySent = await wasEmailSentToday({
      userId,
      taskId: task.id,
      type: EMAIL_TYPES.DUE_24H,
    });
    if (!alreadySent) pendingTasks.push(task);
  }

  if (!pendingTasks.length) return;

  const appUrl = getAppUrl();
  const { subject, html } = reminderTemplate({
    userName: user.name,
    tasks: pendingTasks,
    appUrl,
  });

  const sent = await safeSendEmail({ to: user.email, subject, html });
  if (!sent) return;

  for (const task of pendingTasks) {
    await recordEmailSent({
      userId,
      taskId: task.id,
      projectId: task.projectId,
      type: EMAIL_TYPES.DUE_24H,
    });
  }
}

export async function emailOverdueTask({ userId, task }) {
  if (await wasEmailSentToday({ userId, taskId: task.id, type: EMAIL_TYPES.OVERDUE })) {
    return;
  }

  const user = await getUserById(userId);
  if (!user?.email) return;

  const appUrl = getAppUrl();
  const { subject, html } = overdueTemplate({
    userName: user.name,
    tasks: [task],
    appUrl,
  });

  const sent = await safeSendEmail({ to: user.email, subject, html });
  if (sent) {
    await recordEmailSent({
      userId,
      taskId: task.id,
      projectId: task.projectId,
      type: EMAIL_TYPES.OVERDUE,
    });
  }
}

export async function emailWeeklySummary({ userId, tasks }) {
  if (await wasEmailSentToday({ userId, type: EMAIL_TYPES.WEEKLY_SUMMARY })) {
    return;
  }

  const user = await getUserById(userId);
  if (!user?.email) return;

  const appUrl = getAppUrl();
  const { subject, html } = weeklySummaryTemplate({
    userName: user.name,
    tasks,
    appUrl,
  });

  const sent = await safeSendEmail({ to: user.email, subject, html });
  if (sent) {
    await recordEmailSent({ userId, type: EMAIL_TYPES.WEEKLY_SUMMARY });
  }
}

export async function getProjectName(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { projectName: true, ownerId: true },
  });
  return project;
}

export { formatDueDate };
