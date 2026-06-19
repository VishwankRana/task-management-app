import prisma from '../config.js';

export async function createNotification({ userId, taskId, projectId, type, message }) {
    if (!userId) return null;

    return prisma.notification.create({
        data: { userId, taskId, projectId, type, message },
    });
}

function startOfDay(date) {
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

export async function syncDueSoonNotifications(userId) {
    const today = startOfDay(new Date());
    const inThreeDays = new Date(today);
    inThreeDays.setDate(inThreeDays.getDate() + 3);
    inThreeDays.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
        where: {
            assigneeId: userId,
            status: { notIn: ['Completed', 'Cancelled'] },
            dueDate: { gte: today, lte: inThreeDays },
        },
        include: {
            project: { select: { projectName: true } },
        },
    });

    for (const task of tasks) {
        const existing = await prisma.notification.findFirst({
            where: {
                userId,
                taskId: task.id,
                type: 'DUE_SOON',
                createdAt: { gte: today },
            },
        });

        if (existing) continue;

        await createNotification({
            userId,
            taskId: task.id,
            projectId: task.projectId,
            type: 'DUE_SOON',
            message: `"${task.title}" in ${task.project.projectName} is due on ${formatDueDate(task.dueDate)}`,
        });
    }
}

export async function notifyTaskAssigned({ assigneeId, actorName, task, projectId }) {
    if (!assigneeId) return;

    await createNotification({
        userId: assigneeId,
        taskId: task.id,
        projectId,
        type: 'TASK_ASSIGNED',
        message: `You were assigned "${task.title}" by ${actorName}`,
    });
}

export async function notifyTaskStatusChanged({ assigneeId, taskTitle, taskId, projectId, newStatus, actorName }) {
    if (!assigneeId) return;

    await createNotification({
        userId: assigneeId,
        taskId,
        projectId,
        type: 'STATUS_CHANGED',
        message: `Status of "${taskTitle}" was changed to ${newStatus} by ${actorName}`,
    });
}

export async function notifyTaskPriorityChanged({ assigneeId, taskTitle, taskId, projectId, newPriority, actorName }) {
    if (!assigneeId) return;

    await createNotification({
        userId: assigneeId,
        taskId,
        projectId,
        type: 'PRIORITY_CHANGED',
        message: `Priority of "${taskTitle}" was changed to ${newPriority} by ${actorName}`,
    });
}
