// Test database configuration for both development and production
import { getDatabaseUrl, getDatabaseConfig, logDatabaseConfig } from './src/lib/database-config.ts';

// Test development environment
process.env.NODE_ENV = 'development';
process.env.DATABASE_URL = 'postgresql://dev:test@localhost:5432/devdb';
process.env.NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

console.log('=== DEVELOPMENT ENVIRONMENT ===');
logDatabaseConfig();

// Test production environment
process.env.NODE_ENV = 'production';
console.log('\n=== PRODUCTION ENVIRONMENT ===');
logDatabaseConfig();

// Test with fallback
process.env.NODE_ENV = 'production';
process.env.NEON_DATABASE_URL = undefined;
console.log('\n=== PRODUCTION WITH FALLBACK ===');
logDatabaseConfig();
