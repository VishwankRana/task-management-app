import prisma from '../taskDB.js';

export async function recordTaskHistory({ taskId, projectId, userId, action, description }) {
    return prisma.taskHistory.create({
        data: { taskId, projectId, userId, action, description },
    });
}

const formatStatusLabel = (status) => (status === 'In-progress' ? 'In Progress' : status);

export async function recordTaskCreated({ task, userId, assigneeName }) {
    await recordTaskHistory({
        taskId: task.id,
        projectId: task.projectId,
        userId,
        action: 'Task Created',
        description: 'Task created',
    });

    if (assigneeName) {
        await recordTaskHistory({
            taskId: task.id,
            projectId: task.projectId,
            userId,
            action: 'Assigned',
            description: `Assigned to ${assigneeName}`,
        });
    }
}

export async function recordTaskUpdates({ existingTask, updatedTask, userId, assigneeName }) {
    const records = [];

    if (
        updatedTask.assigneeId !== existingTask.assigneeId
        && assigneeName
    ) {
        records.push({
            action: 'Assigned',
            description: `Assigned to ${assigneeName}`,
        });
    }

    if (updatedTask.priority !== existingTask.priority) {
        records.push({
            action: 'Priority changed',
            description: `${existingTask.priority} → ${updatedTask.priority}`,
        });
    }

    if (updatedTask.status !== existingTask.status) {
        records.push({
            action: 'Status changed',
            description: `${formatStatusLabel(existingTask.status)} → ${formatStatusLabel(updatedTask.status)}`,
        });

        if (updatedTask.status === 'Completed') {
            records.push({
                action: 'Task Completed',
                description: 'Task completed',
            });
        }
    }

    if (updatedTask.dueDate && existingTask.dueDate) {
        const prevDue = new Date(existingTask.dueDate).getTime();
        const nextDue = new Date(updatedTask.dueDate).getTime();
        if (prevDue !== nextDue) {
            records.push({
                action: 'Due date updated',
                description: 'Due date updated',
            });
        }
    }

    for (const record of records) {
        await recordTaskHistory({
            taskId: updatedTask.id,
            projectId: updatedTask.projectId,
            userId,
            ...record,
        });
    }
}

export const formatHistoryEntry = (entry) => ({
    id: entry.id,
    taskId: entry.taskId,
    projectId: entry.projectId,
    userId: entry.userId,
    userName: entry.user?.name ?? null,
    action: entry.action,
    description: entry.description,
    createdAt: entry.createdAt,
});
