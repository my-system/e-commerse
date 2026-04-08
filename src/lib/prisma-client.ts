import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Auto-setup database connection
async function setupDatabase(): Promise<PrismaClient> {
  // Use NEON_DATABASE_URL in production, DATABASE_URL in development
  const DATABASE_URL = process.env.NODE_ENV === 'production' 
    ? process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
    : process.env.DATABASE_URL || 'file:./dev.db';
  
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 Database URL:', DATABASE_URL);
    
    // Test connection
    const testClient = new PrismaClient();
    await testClient.$queryRaw`SELECT 1`;
    await testClient.$disconnect();
    
    console.log('✅ Database connection successful');
    
    // Return working client
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
  } catch (error) {
    console.log('❌ Database connection failed:', (error as Error).message);
    console.log('🔄 Using fallback SQLite database...');
    
    // Fallback to SQLite
    return new PrismaClient({
      datasources: {
        db: { url: 'file:./fallback.db' }
      }
    } as any);
  }
}

// Enhanced prisma client with auto-setup
export const prisma = process.env.NODE_ENV === 'production' 
  ? (null as any) 
  : (globalForPrisma.prisma ?? setupDatabase());

if (process.env.NODE_ENV !== 'production') {
  setupDatabase().then(client => {
    globalForPrisma.prisma = client;
    console.log('🎉 Database auto-setup completed!');
  }).catch(error => {
    console.log('💥 Database setup failed:', error);
  });
}
