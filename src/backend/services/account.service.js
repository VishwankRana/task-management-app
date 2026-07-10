import bcrypt from 'bcrypt';
import prisma from '../config.js';

export async function exportUserData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return null;
  }

  const [memberships, assignedTasks, comments] = await Promise.all([
    prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
            projectStatus: true,
            projectPriority: true,
          },
        },
      },
    }),
    prisma.task.findMany({
      where: { assigneeId: userId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.comment.findMany({
      where: { userId },
      select: {
        id: true,
        content: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile: user,
    projectMemberships: memberships.map((m) => ({
      projectId: m.projectId,
      projectName: m.project.projectName,
      projectStatus: m.project.projectStatus,
      projectPriority: m.project.projectPriority,
      joinedAt: m.createdAt,
    })),
    assignedTasks,
    comments,
  };
}

export async function deleteUserAccount(userId, password) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true, role: true },
  });

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: 'Incorrect password' };
  }

  if (user.role === 'Admin') {
    const ownedCount = await prisma.project.count({
      where: { ownerId: userId },
    });

    if (ownedCount > 0) {
      return {
        success: false,
        error: 'Delete or transfer your owned projects before deleting your account',
      };
    }
  }

  await prisma.$transaction([
    prisma.task.updateMany({
      where: { assigneeId: userId },
      data: { assigneeId: null },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return { success: true };
}
