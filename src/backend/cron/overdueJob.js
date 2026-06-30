import prisma from '../config.js';
import { emailOverdueTask } from '../services/notification.service.js';

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function runOverdueJob() {
  const today = startOfDay();

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: { not: null },
      status: { notIn: ['Completed', 'Cancelled'] },
      dueDate: { lt: today },
    },
    include: {
      project: { select: { projectName: true } },
    },
  });

  for (const task of tasks) {
    await emailOverdueTask({
      userId: task.assigneeId,
      task: {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        dueDate: task.dueDate,
        status: task.status,
        projectName: task.project.projectName,
      },
    });
  }

  console.log(`[cron] Overdue job finished — ${tasks.length} task(s) processed`);
}
