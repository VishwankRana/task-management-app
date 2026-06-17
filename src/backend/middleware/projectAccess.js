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
