// Test tri-database system
const { Pool } = require('pg');

const pendingPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
});

const marketplacePool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
});

const backupPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
});

async function testTriDatabase() {
  try {
    console.log('=== TESTING TRI-DATABASE SYSTEM ===');
    
    // Test database connections
    console.log('\n1️⃣ Testing Database Connections...');
    
    const pendingClient = await pendingPool.connect();
    const pendingCount = await pendingClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Database A (Pending): ${pendingCount.rows[0].count} products`);
    pendingClient.release();
    
    const marketplaceClient = await marketplacePool.connect();
    const marketplaceCount = await marketplaceClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Database B (Marketplace): ${marketplaceCount.rows[0].count} products`);
    marketplaceClient.release();
    
    const backupClient = await backupPool.connect();
    const backupCount = await backupClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Database C (Backup): ${backupCount.rows[0].count} products`);
    backupClient.release();
    
    // Test workflow
    console.log('\n2️⃣ Testing Approval Workflow...');
    
    // Add test product to pending
    const testProductId = Date.now().toString();
    const addClient = await pendingPool.connect();
    await addClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `, [
      testProductId,
      'Test Tri-Database Product',
      299900,
      'electronics',
      'Test product for tri-database system',
      false,
      true,
      0,
      0,
      '["/uploads/products/test.jpg"]',
      'pending',
      '[]',
      'test-seller'
    ]);
    console.log(`✅ Test product added to pending: ${testProductId}`);
    addClient.release();
    
    // Simulate approval workflow
    console.log('\n3️⃣ Simulating Approval: Pending → Marketplace → Backup...');
    
    // Get from pending
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
      product.id, product.title, product.price, product.category, product.description,
      product.featured, product.in_stock, product.rating, product.reviews,
      product.images, 'approved', product.badges, product.seller_id
    ]);
    addToMarketplaceClient.release();
    
    // Add to backup
    const addToBackupClient = await backupPool.connect();
    await addToBackupClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `, [
      product.id, product.title, product.price, product.category, product.description,
      product.featured, product.in_stock, product.rating, product.reviews,
      product.images, 'approved', product.badges, product.seller_id, product.createdAt, product.updatedAt
    ]);
    addToBackupClient.release();
    
    // Update status in pending
    const updateStatusClient = await pendingPool.connect();
    await updateStatusClient.query('UPDATE products SET status = $1 WHERE id = $2', ['approved', testProductId]);
    updateStatusClient.release();
    
    // Final verification
    console.log('\n4️⃣ Final Verification...');
    
    const finalPendingClient = await pendingPool.connect();
    const finalPendingCount = await finalPendingClient.query('SELECT COUNT(*) FROM products WHERE status = $1', ['pending']);
    console.log(`✅ Pending products: ${finalPendingCount.rows[0].count}`);
    finalPendingClient.release();
    
    const finalMarketplaceClient = await marketplacePool.connect();
    const finalMarketplaceCount = await finalMarketplaceClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Marketplace products: ${finalMarketplaceCount.rows[0].count}`);
    finalMarketplaceClient.release();
    
    const finalBackupClient = await backupPool.connect();
    const finalBackupCount = await finalBackupClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Backup products: ${finalBackupCount.rows[0].count}`);
    finalBackupClient.release();
    
    console.log('\n=== TRI-DATABASE SYSTEM WORKING! ===');
    console.log('🎯 Database A (Pending): Seller submissions & review');
    console.log('🎯 Database B (Marketplace): Approved products for customers');
    console.log('🎯 Database C (Backup): Complete history & recovery');
    console.log('🔄 Workflow: Pending → Marketplace + Backup');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
    await backupPool.end();
  }
}

testTriDatabase();
