const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace",
  ssl: false
});

async function checkDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
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
    
    if (tableExists) {
      // Count total products
      const countResult = await client.query('SELECT COUNT(*) FROM products');
      const productCount = parseInt(countResult.rows[0].count);
      console.log(`📦 Total products in database: ${productCount}`);
      
      if (productCount > 0) {
        // Get product details
        const productsResult = await client.query(`
          SELECT id, title, price, status, created_at 
          FROM products 
          ORDER BY created_at DESC 
          LIMIT 5
        `);
        
        console.log('\n📋 Sample products:');
        productsResult.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.id}: ${row.title} (${row.price}) - ${row.status}`);
        });
        
        // Status breakdown
        const statusResult = await client.query(`
          SELECT status, COUNT(*) as count 
          FROM products 
          GROUP BY status
        `);
        
        console.log('\n📊 Status breakdown:');
        statusResult.rows.forEach(row => {
          console.log(`  - ${row.status}: ${row.count} products`);
        });
      }
    }
    
    client.release();
    console.log('\n✅ Database check completed successfully');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
