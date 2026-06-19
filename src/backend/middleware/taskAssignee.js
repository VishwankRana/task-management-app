import prisma from '../config.js';

export async function resolveAssigneeId(projectId, assigneeId) {
    if (assigneeId === null || assigneeId === undefined || assigneeId === '') {
        return null;
    }

    const userId = Number(assigneeId);
    if (!userId) {
        throw new Error('Invalid assignee');
    }

    const member = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: { projectId, userId },
        },
    });

    if (!member) {
        throw new Error('Assignee must be a member of this project');
    }

    return userId;
}
