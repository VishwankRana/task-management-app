import prisma from '../config.js';

const MAX_TEXT_LENGTH = 200;

export const formatChecklistItem = (item) => ({
    id: item.id,
    taskId: item.taskId,
    text: item.text,
    isCompleted: item.isCompleted,
    order: item.order,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

export function validateChecklistText(text) {
    const trimmed = text?.trim();
    if (!trimmed) {
        return { valid: false, error: 'Checklist item text is required' };
    }
    if (trimmed.length > MAX_TEXT_LENGTH) {
        return { valid: false, error: `Checklist item must be ${MAX_TEXT_LENGTH} characters or less` };
    }
    return { valid: true, value: trimmed };
}

export async function getChecklistItemsForTask(taskId) {
    return prisma.checklistItem.findMany({
        where: { taskId },
        orderBy: { order: 'asc' },
    });
}

export async function getNextChecklistOrder(taskId) {
    const lastItem = await prisma.checklistItem.findFirst({
        where: { taskId },
        orderBy: { order: 'desc' },
        select: { order: true },
    });
    return (lastItem?.order ?? -1) + 1;
}

export async function findChecklistItemForTask(taskId, itemId) {
    return prisma.checklistItem.findFirst({
        where: { id: itemId, taskId },
    });
}

export async function reorderChecklistItems(taskId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        throw new Error('orderedIds must be a non-empty array');
    }

    const existing = await prisma.checklistItem.findMany({
        where: { taskId },
        select: { id: true },
        orderBy: { order: 'asc' },
    });

    const existingIds = existing.map((item) => item.id);
    const normalizedIds = orderedIds.map(Number);

    if (
        normalizedIds.length !== existingIds.length
        || !normalizedIds.every((id) => existingIds.includes(id))
    ) {
        throw new Error('Invalid checklist order payload');
    }

    await prisma.$transaction(
        normalizedIds.map((id, index) =>
            prisma.checklistItem.update({
                where: { id },
                data: { order: index },
            })
        )
    );

    return getChecklistItemsForTask(taskId);
}
