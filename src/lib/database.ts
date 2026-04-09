// Centralized Database Configuration & Connection
import { PrismaClient } from '@prisma/client';
import { validateOnStartup } from './env-validation';

// Validate environment on startup
validateOnStartup();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with environment-based configuration
const createPrismaClient = (): PrismaClient => {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL or NEON_DATABASE_URL is required');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Singleton pattern for Prisma client
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database health check
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  responseTime?: number;
}> {
  const startTime = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

// Export for convenience
export default prisma;
