import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/backend/config.js';

const args = process.argv.slice(2);
const email = args[0]?.trim().toLowerCase();
const password = args[1];
const name = args[2] || 'Admin';

if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs <email> <password> [name]');
  process.exit(1);
}

const existing = await prisma.user.findUnique({ where: { email } });

if (existing) {
  if (existing.role !== 'Admin') {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: 'Admin' },
    });
    console.log(`Promoted existing user ${email} to Admin`);
  } else {
    console.log(`Admin user ${email} already exists`);
  }
} else {
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed, role: 'Admin' },
  });
  console.log(`Created admin user: ${email}`);
}

await prisma.$disconnect();
