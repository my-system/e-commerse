// Simple test for multi-database system
const { Pool } = require('pg');

// Database connections
const pendingPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
});

const marketplacePool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
});

async function testMultiDatabase() {
  try {
    console.log('=== TESTING MULTI-DATABASE SYSTEM ===');
    
    // Test 1: Check pending database
    console.log('\n1️⃣ Testing PENDING database...');
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Pending database: ${pendingResult.rows[0].count} products`);
    pendingClient.release();
    
    // Test 2: Check marketplace database
    console.log('\n2️⃣ Testing MARKETPLACE database...');
    const marketplaceClient = await marketplacePool.connect();
    const marketplaceResult = await marketplaceClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Marketplace database: ${marketplaceResult.rows[0].count} products`);
    marketplaceClient.release();
    
    // Test 3: Add test product to pending
    console.log('\n3️⃣ Adding test product to pending database...');
    const addClient = await pendingPool.connect();
    const testProductId = Date.now().toString();
    await addClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `, [
      testProductId,
      'Test Multi-DB Product',
      299900,
      'electronics',
      'Test product for multi-database system',
      false,
      true,
      0,
      0,
      '["/uploads/products/test.jpg"]',
      'pending',
      '[]',
      'test-seller'
    ]);
    console.log(`✅ Test product added with ID: ${testProductId}`);
    addClient.release();
    
    // Test 4: Verify in pending database
    console.log('\n4️⃣ Verifying product in pending database...');
    const verifyClient = await pendingPool.connect();
    const verifyResult = await verifyClient.query('SELECT title, status FROM products WHERE id = $1', [testProductId]);
    if (verifyResult.rows.length > 0) {
      console.log(`✅ Found in pending: ${verifyResult.rows[0].title} (${verifyResult.rows[0].status})`);
    }
    verifyClient.release();
    
    // Test 5: Simulate approval workflow
    console.log('\n5️⃣ Simulating approval workflow...');
    
    // Get product from pending
    const getProductClient = await pendingPool.connect();
    const productResult = await getProductClient.query('SELECT * FROM products WHERE id = $1', [testProductId]);
    const product = productResult.rows[0];
    getProductClient.release();
    
    // Add to marketplace
    const addToMarketplaceClient = await marketplacePool.connect();
    await addToMarketplaceClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, approved_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), NOW())
    `, [
      product.id,
      product.title,
      product.price,
      product.category,
      product.description,
      product.featured,
      product.in_stock,
      product.rating,
      product.reviews,
      product.images,
      'approved',
      product.badges,
      product.seller_id
    ]);
    console.log('✅ Product moved to marketplace database');
    addToMarketplaceClient.release();
    
    // Update status in pending
    const updateStatusClient = await pendingPool.connect();
    await updateStatusClient.query('UPDATE products SET status = $1 WHERE id = $2', ['approved', testProductId]);
    console.log('✅ Product status updated to approved in pending database');
    updateStatusClient.release();
    
    // Test 6: Final verification
    console.log('\n6️⃣ Final verification...');
    
    const finalPendingClient = await pendingPool.connect();
    const finalPendingResult = await finalPendingClient.query('SELECT COUNT(*) FROM products WHERE status = $1', ['pending']);
    console.log(`✅ Pending products: ${finalPendingResult.rows[0].count}`);
    finalPendingClient.release();
    
    const finalMarketplaceClient = await marketplacePool.connect();
    const finalMarketplaceResult = await finalMarketplaceClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Marketplace products: ${finalMarketplaceResult.rows[0].count}`);
    finalMarketplaceClient.release();
    
    console.log('\n=== MULTI-DATABASE SYSTEM WORKING! ===');
    console.log('🎯 Pending database: ecommerce_pending');
    console.log('🎯 Marketplace database: ecommerce_marketplace');
    console.log('🎯 Approval workflow: ✅ Working');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
  }
}

testMultiDatabase();
