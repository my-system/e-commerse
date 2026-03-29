// Temporarily disabled - using direct PostgreSQL connection instead
// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   log: ['query'],
// });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Temporary placeholder
export const prisma = null;
