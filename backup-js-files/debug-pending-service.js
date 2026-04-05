// Debug PendingDatabaseService
const { Pool } = require('pg');

async function debugPendingService() {
  try {
    console.log('=== DEBUGGING PENDING SERVICE ===');
    
    // Direct database query
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const client = await pendingPool.connect();
    const result = await client.query('SELECT * FROM products ORDER BY created_at DESC');
    
    console.log(`📊 Direct database query: ${result.rows.length} products`);
    result.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ID: ${product.id} - ${product.title} (${product.status})`);
      console.log(`     Seller: ${product.seller_id}`);
      console.log(`     Created: ${product.created_at}`);
      console.log('');
    });
    
    client.release();
    
    // Test the service method
    console.log('\n=== TESTING SERVICE METHOD ===');
    
    // Import and test the service
    const { PendingDatabaseService } = require('./src/lib/multi-database-service');
    
    try {
      const products = await PendingDatabaseService.getPendingProducts();
      console.log(`📊 Service method result: ${products.length} products`);
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ID: ${product.id} - ${product.title} (${product.status})`);
        console.log(`     Seller: ${product.sellerId}`);
        console.log(`     Created: ${product.createdAt}`);
        console.log('');
      });
    } catch (serviceError) {
      console.log('❌ Service method error:', serviceError.message);
      console.log('Stack:', serviceError.stack);
    }
    
    await pendingPool.end();
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugPendingService();
