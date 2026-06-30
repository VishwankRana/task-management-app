import prisma from '../config.js';
import { emailDueWithin24Hours } from '../services/notification.service.js';

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function runDueReminderJob() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: { not: null },
      status: { notIn: ['Completed', 'Cancelled'] },
      dueDate: { gte: now, lte: tomorrow },
    },
    include: {
      project: { select: { projectName: true } },
      assignee: { select: { id: true } },
    },
  });

  const tasksByUser = new Map();

  for (const task of tasks) {
    const list = tasksByUser.get(task.assigneeId) || [];
    list.push({
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      projectName: task.project.projectName,
    });
    tasksByUser.set(task.assigneeId, list);
  }

  for (const [userId, userTasks] of tasksByUser) {
    await emailDueWithin24Hours({ userId, tasks: userTasks });
  }

  console.log(`[cron] Due reminder job finished — ${tasks.length} task(s) processed`);
}
