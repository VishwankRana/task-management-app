import prisma from '../config.js';

export async function getProjectAccess(user, projectId) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, ownerId: true },
    });

    if (!project) {
        return { project: null, isOwner: false, isMember: false, canAccess: false };
    }

    const isOwner = project.ownerId === user.id;
    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: { projectId, userId: user.id },
        },
    });
    const isMember = !!membership;

    const canAccess =
        (user.role === 'Admin' && isOwner) ||
        (user.role === 'User' && isMember);

    return { project, isOwner, isMember, canAccess };
}

export async function requireProjectAccess(user, projectId) {
    const access = await getProjectAccess(user, projectId);
    return access.canAccess ? access : null;
}

export async function requireProjectOwner(user, projectId) {
    const access = await getProjectAccess(user, projectId);
    return user.role === 'Admin' && access.isOwner ? access : null;
}

export function buildProjectTaskFilter(user, projectId) {
    const filter = { projectId };

    if (user.role === 'User') {
        filter.assigneeId = user.id;
    }

    return filter;
}

export function buildUserTaskFilter(user) {
    if (user.role === 'Admin') {
        return { project: { ownerId: user.id } };
    }

    return {
        assigneeId: user.id,
        project: { members: { some: { userId: user.id } } },
    };
}

export async function requireTaskAccess(user, taskId) {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true, projectId: true, assigneeId: true },
    });

    if (!task) return null;

    const access = await getProjectAccess(user, task.projectId);
    if (!access.canAccess) return null;

    if (user.role === 'Admin' && access.isOwner) return task;
    if (user.role === 'User' && task.assigneeId === user.id) return task;

    return null;
}
