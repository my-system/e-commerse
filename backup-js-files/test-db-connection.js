// Test database connection directly
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/commercedb",
  ssl: false
});

async function testConnection() {
  try {
    console.log('=== TESTING DATABASE CONNECTION ===');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0].now);
    
    // Check if products table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'products'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Products table exists');
      
      // Check current products
      const productCount = await client.query('SELECT COUNT(*) FROM products');
      console.log(`📊 Current products count: ${productCount.rows[0].count}`);
      
      // Show products
      const products = await client.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
      console.log('📋 Current products:');
      products.rows.forEach(product => {
        console.log(`  - ${product.id}: ${product.title} (${product.status})`);
      });
    } else {
      console.log('❌ Products table does not exist');
      
      // Create table
      await client.query(`
        CREATE TABLE products (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(100),
          description TEXT,
          featured BOOLEAN DEFAULT FALSE,
          in_stock BOOLEAN DEFAULT TRUE,
          rating INTEGER DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          images TEXT,
          material VARCHAR(255),
          care VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending',
          badges TEXT,
          seller_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Products table created');
    }
    
    client.release();
    console.log('✅ Connection test complete');
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
