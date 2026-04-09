import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;

export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    // Basic initialization - create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        role TEXT DEFAULT 'USER',
        status TEXT DEFAULT 'INACTIVE',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        featured BOOLEAN DEFAULT FALSE,
        in_stock BOOLEAN DEFAULT TRUE,
        rating REAL DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        images TEXT,
        material TEXT,
        care TEXT,
        slug TEXT UNIQUE,
        status TEXT DEFAULT 'PENDING',
        seller_id TEXT,
        approved_at TIMESTAMP,
        rejected_at TIMESTAMP,
        approved_by TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    client.release();
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
