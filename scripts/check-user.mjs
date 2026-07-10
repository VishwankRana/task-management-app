import prisma from '../src/backend/config.js';

const email = process.argv[2] || 'vishwank15@gmail.com';

const user = await prisma.user.findFirst({
  where: {
    OR: [
      { email },
      { email: email.toLowerCase() },
      { email: { contains: 'vishwank15' } },
    ],
  },
  select: { id: true, name: true, email: true, role: true, createdAt: true },
});

console.log('=== USER ===');
console.log(JSON.stringify(user, null, 2));

if (user) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId: user.id },
    include: { project: { select: { id: true, projectName: true, ownerId: true } } },
  });
  console.log('=== PROJECT MEMBERSHIPS ===');
  console.log(JSON.stringify(memberships, null, 2));

  const tasks = await prisma.task.findMany({
    where: { assigneeId: user.id },
    select: { id: true, title: true, status: true, projectId: true },
  });
  console.log('=== ASSIGNED TASKS ===');
  console.log(JSON.stringify(tasks, null, 2));
}

const similar = await prisma.user.findMany({
  where: { email: { contains: 'vishwank' } },
  select: { id: true, email: true, role: true },
});
console.log('=== SIMILAR EMAILS ===');
console.log(JSON.stringify(similar, null, 2));

await prisma.$disconnect();
