import jwt from 'jsonwebtoken';
import 'dotenv/config';

const userId = Number(process.argv[2] || 1);
const email = process.argv[3] || 'vishwank15@gmail.com';
const role = process.argv[4] || 'User';

const token = jwt.sign(
  { userId, email, role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const headers = { Cookie: `token=${token}` };

const projectsRes = await fetch('http://localhost:3000/api/taskmanager/projects', { headers });
console.log('PROJECTS status:', projectsRes.status);
console.log('PROJECTS body:', await projectsRes.text());

const tasksRes = await fetch('http://localhost:3000/api/taskmanager/tasks', { headers });
console.log('TASKS status:', tasksRes.status);
console.log('TASKS body:', await tasksRes.text());

const projectsSlashRes = await fetch('http://localhost:3000/api/taskmanager/projects/', { headers });
console.log('PROJECTS/ status:', projectsSlashRes.status);
console.log('PROJECTS/ body:', await projectsSlashRes.text());
