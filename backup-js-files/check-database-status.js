// Check database status
const { Pool } = require('pg');

async function checkDatabaseStatus() {
  try {
    console.log('=== CHECKING DATABASE STATUS ===');
    
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const client = await pendingPool.connect();
    const result = await client.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
    
    console.log(`📊 ecommerce_pending Database (${result.rows.length} products):`);
    result.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ID: ${product.id} - ${product.title} (${product.status})`);
    });
    
    client.release();
    await pendingPool.end();
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabaseStatus();
