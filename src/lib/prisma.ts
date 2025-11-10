// this file makes sure that Prisma connects to your database only once, even though Next.js reloads your code multiple times while you’re developing.

import { PrismaClient } from '@prisma/client';  // PrismaClient lets you talk to your database

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}