// Add test product for delete testing
const { Pool } = require('pg');

async function addTestProduct() {
  try {
    console.log('=== ADDING TEST PRODUCT ===');
    
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const client = await pendingPool.connect();
    const testProductId = Date.now().toString();
    
    await client.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `, [
      testProductId,
      'Test Product for Delete',
      150000,
      'test',
      'This is a test product for delete functionality',
      false,
      true,
      0,
      0,
      '["/uploads/products/test-delete.jpg"]',
      'pending',
      '[]',
      'mock-seller-id'
    ]);
    
    console.log(`✅ Test product added: ${testProductId}`);
    
    client.release();
    
    // Verify
    const verifyClient = await pendingPool.connect();
    const verifyResult = await verifyClient.query('SELECT COUNT(*) FROM products');
    console.log(`📊 Total products: ${verifyResult.rows[0].count}`);
    verifyClient.release();
    
    await pendingPool.end();
    
    console.log('\n=== READY FOR DELETE TEST ===');
    console.log(`Product ID: ${testProductId}`);
    console.log('Open seller/products page and test delete');
    
  } catch (error) {
    console.error('❌ Add product failed:', error);
  }
}

addTestProduct();
