// Database configuration for different environments
export function getDatabaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), use NEON_DATABASE_URL
    return process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  }
  // In development, use local DATABASE_URL
  return process.env.DATABASE_URL || 'file:./dev.db';
}

export function getDatabaseConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = getDatabaseUrl();
  
  return {
    databaseUrl,
    isProduction,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
}

// Log database configuration for debugging
export function logDatabaseConfig() {
  const config = getDatabaseConfig();
  console.log('Database Configuration:', {
    environment: process.env.NODE_ENV,
    databaseUrl: config.databaseUrl?.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
    ssl: config.ssl,
    isProduction: config.isProduction,
  });
}
