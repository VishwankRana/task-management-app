import prisma from '../config.js';
import { emailWeeklySummary } from '../services/notification.service.js';

export async function runWeeklySummaryJob() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  for (const { id: userId } of users) {
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: { in: ['Pending', 'In-progress'] },
      },
      include: {
        project: { select: { projectName: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    await emailWeeklySummary({
      userId,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
        status: t.status,
        projectName: t.project.projectName,
      })),
    });
  }

  console.log(`[cron] Weekly summary job finished — ${users.length} user(s) processed`);
}
