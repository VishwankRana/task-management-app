import prisma from '../config.js';

const SESSION_USER_SELECT = {
    id: true,
    name: true,
    email: true,
    role: true,
    sessionVersion: true,
    calendarEnabled: true,
    analyticsEnabled: true,
};

export async function rotateUserSession(userId) {
    return prisma.user.update({
        where: { id: userId },
        data: { sessionVersion: { increment: 1 } },
        select: SESSION_USER_SELECT,
    });
}

export async function invalidateUserSession(userId) {
    return rotateUserSession(userId);
}
