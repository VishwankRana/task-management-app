import prisma from '../src/backend/config.js';
import { buildUserTaskFilter } from '../src/backend/middleware/projectAccess.js';

const userId = Number(process.argv[2] || 1);

const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, role: true, name: true },
});

if (!user) {
  console.error('User not found');
  process.exit(1);
}

const projectWhere =
  user.role === 'Admin'
    ? { ownerId: user.id }
    : { members: { some: { userId: user.id } } };

const projects = await prisma.project.findMany({
  where: projectWhere,
  select: { id: true, projectName: true },
});

const tasks = await prisma.task.findMany({
  where: buildUserTaskFilter(user),
  select: { id: true, title: true },
});

console.log('User:', user);
console.log('Projects API would return:', projects.length, projects);
console.log('Tasks API would return:', tasks.length, tasks);

await prisma.$disconnect();
