// Test database configuration for both development and production
const { getDatabaseUrl, getDatabaseConfig, logDatabaseConfig } = require('./src/lib/database-config.ts');

// Test development environment
process.env.NODE_ENV = 'development';
process.env.DATABASE_URL = 'postgresql://dev:test@localhost:5432/devdb';
process.env.NEON_DATABASE_URL = 'postgresql://neon:test@neon-host:5432/neondb';

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
