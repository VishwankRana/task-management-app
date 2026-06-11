import 'dotenv/config';
import pkg from '@prisma/client';
import { createRequire } from 'module';

const { PrismaClient } = pkg;
const require = createRequire(import.meta.url);
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const dbUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1)
});

const prisma = new PrismaClient({ adapter });

export default prisma;
