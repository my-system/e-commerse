import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Completely disable database in production deployment
export const prisma = process.env.NODE_ENV === 'production' 
  ? (null as any) 
  : (globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }));

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
