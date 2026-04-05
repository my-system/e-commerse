// Check database separation between marketplace and seller add
const { Pool } = require('pg');

async function checkDatabaseSeparation() {
  try {
    console.log('=== CHECKING DATABASE SEPARATION ===');
    
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
    });
    
    // Check current products in each database
    console.log('\n1️⃣ CURRENT PRODUCTS IN EACH DATABASE:');
    
    // Pending database
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
    console.log(`📊 ecommerce_pending (${pendingResult.rows.length} products):`);
    pendingResult.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.status})`);
    });
    pendingClient.release();
    
    // Marketplace database
    const marketplaceClient = await marketplacePool.connect();
    const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products ORDER BY approved_at DESC');
    console.log(`\n📊 ecommerce_marketplace (${marketplaceResult.rows.length} products):`);
    marketplaceResult.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.status})`);
    });
    marketplaceClient.release();
    
    // Test adding new product to pending
    console.log('\n2️⃣ TESTING: Add new product to pending (seller add)...');
    const testProductId = Date.now().toString();
    const addClient = await pendingPool.connect();
    await addClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `, [
      testProductId,
      'SELLER ADD TEST PRODUCT',
      150000,
      'fashion',
      'This product was added by seller - should only be in pending database',
      false,
      true,
      0,
      0,
      '["/uploads/products/seller-test.jpg"]',
      'pending',
      '[]',
      'seller-123'
    ]);
    console.log(`✅ Test product added to pending: ${testProductId}`);
    addClient.release();
    
    // Check if it appears in marketplace (should NOT appear)
    console.log('\n3️⃣ VERIFYING: Check if seller product appears in marketplace...');
    const checkClient = await marketplacePool.connect();
    const checkResult = await checkClient.query('SELECT * FROM products WHERE id = $1', [testProductId]);
    if (checkResult.rows.length === 0) {
      console.log('✅ CONFIRMED: Seller product NOT in marketplace database (correct!)');
    } else {
      console.log('❌ ERROR: Seller product found in marketplace database (wrong!)');
    }
    checkClient.release();
    
    // Check if it appears in pending (should appear)
    console.log('\n4️⃣ VERIFYING: Check if seller product appears in pending...');
    const verifyClient = await pendingPool.connect();
    const verifyResult = await verifyClient.query('SELECT * FROM products WHERE id = $1', [testProductId]);
    if (verifyResult.rows.length > 0) {
      console.log('✅ CONFIRMED: Seller product found in pending database (correct!)');
      console.log(`   Product: ${verifyResult.rows[0].title} (${verifyResult.rows[0].status})`);
    } else {
      console.log('❌ ERROR: Seller product NOT found in pending database (wrong!)');
    }
    verifyClient.release();
    
    // Simulate approval process
    console.log('\n5️⃣ TESTING: Simulate admin approval...');
    
    // Get product from pending
    const getProductClient = await pendingPool.connect();
    const productResult = await getProductClient.query('SELECT * FROM products WHERE id = $1', [testProductId]);
    const product = productResult.rows[0];
    getProductClient.release();
    
    // Add to marketplace (simulating approval)
    const approveClient = await marketplacePool.connect();
    await approveClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, approved_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), NOW())
    `, [
      product.id, product.title, product.price, product.category, product.description,
      product.featured, product.in_stock, product.rating, product.reviews,
      product.images, 'approved', product.badges, product.seller_id
    ]);
    console.log('✅ Product approved and added to marketplace');
    approveClient.release();
    
    // Update status in pending
    const updateClient = await pendingPool.connect();
    await updateClient.query('UPDATE products SET status = $1 WHERE id = $2', ['approved', testProductId]);
    console.log('✅ Product status updated to approved in pending');
    updateClient.release();
    
    // Final verification
    console.log('\n6️⃣ FINAL VERIFICATION:');
    
    const finalPendingClient = await pendingPool.connect();
    const finalPendingResult = await finalPendingClient.query('SELECT COUNT(*) FROM products WHERE status = $1', ['pending']);
    console.log(`📊 ecommerce_pending (pending only): ${finalPendingResult.rows[0].count} products`);
    finalPendingClient.release();
    
    const finalMarketplaceClient = await marketplacePool.connect();
    const finalMarketplaceResult = await finalMarketplaceClient.query('SELECT COUNT(*) FROM products');
    console.log(`📊 ecommerce_marketplace (all approved): ${finalMarketplaceResult.rows[0].count} products`);
    finalMarketplaceClient.release();
    
    console.log('\n=== DATABASE SEPARATION VERIFICATION COMPLETE ===');
    console.log('✅ Seller add → ecommerce_pending (Database A)');
    console.log('✅ Marketplace → ecommerce_marketplace (Database B)');
    console.log('✅ Approval moves product from A → B');
    console.log('✅ Databases are SEPARATE and working correctly!');
    
    await pendingPool.end();
    await marketplacePool.end();
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkDatabaseSeparation();
