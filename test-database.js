// Script untuk testing database connection dan membuat tabel
// Jalankan di browser console atau dengan node

const { Pool } = require('pg');

// Connection string dari .env
const DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false
});

async function testDatabase() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Check if products table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log(`📋 Products table exists: ${tableExists}`);
    
    if (!tableExists) {
      console.log('🔨 Creating products table...');
      
      // Create products table
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
      
      console.log('✅ Products table created successfully');
    } else {
      // Check table structure
      const tableInfo = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        ORDER BY ordinal_position;
      `);
      
      console.log('📊 Products table structure:');
      tableInfo.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
      });
      
      // Count existing products
      const countResult = await client.query('SELECT COUNT(*) FROM products');
      const productCount = parseInt(countResult.rows[0].count);
      console.log(`📦 Total products in database: ${productCount}`);
      
      // Show sample products
      if (productCount > 0) {
        const sampleResult = await client.query('SELECT id, title, price, status, created_at FROM products ORDER BY created_at DESC LIMIT 3');
        console.log('📋 Sample products:');
        sampleResult.rows.forEach(row => {
          console.log(`  - ${row.id}: ${row.title} (${row.price}) - ${row.status}`);
        });
      }
    }
    
    client.release();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database error:', error);
    console.error('Error details:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the test
testDatabase();
