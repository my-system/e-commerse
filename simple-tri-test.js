// Simple test for tri-database system
const { Pool } = require('pg');

async function testTriDatabase() {
  try {
    console.log('=== SIMPLE TRI-DATABASE TEST ===');
    
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
    });
    
    const backupPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
    });
    
    // Test 1: Add to pending
    console.log('\n1️⃣ Adding product to pending...');
    const testProductId = Date.now().toString();
    const pendingClient = await pendingPool.connect();
    await pendingClient.query(`
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
    console.log(`✅ Added to pending: ${testProductId}`);
    pendingClient.release();
    
    // Test 2: Get from pending
    console.log('\n2️⃣ Getting product from pending...');
    const getProductClient = await pendingPool.connect();
    const productResult = await getProductClient.query('SELECT * FROM products WHERE id = $1', [testProductId]);
    const product = productResult.rows[0];
    console.log(`✅ Retrieved: ${product.title}`);
    getProductClient.release();
    
    // Test 3: Add to marketplace (13 parameters)
    console.log('\n3️⃣ Adding to marketplace...');
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
    console.log('✅ Added to marketplace');
    addToMarketplaceClient.release();
    
    // Test 4: Add to backup (13 parameters)
    console.log('\n4️⃣ Adding to backup...');
    const addToBackupClient = await backupPool.connect();
    await addToBackupClient.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, status, badges, seller_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `, [
      product.id, product.title, product.price, product.category, product.description,
      product.featured, product.in_stock, product.rating, product.reviews,
      product.images, 'approved', product.badges, product.seller_id
    ]);
    console.log('✅ Added to backup');
    addToBackupClient.release();
    
    // Test 5: Update status in pending
    console.log('\n5️⃣ Updating status in pending...');
    const updateStatusClient = await pendingPool.connect();
    await updateStatusClient.query('UPDATE products SET status = $1 WHERE id = $2', ['approved', testProductId]);
    console.log('✅ Status updated to approved');
    updateStatusClient.release();
    
    // Test 6: Final verification
    console.log('\n6️⃣ Final verification...');
    
    const finalPendingClient = await pendingPool.connect();
    const pendingCount = await finalPendingClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Pending database: ${pendingCount.rows[0].count} products`);
    finalPendingClient.release();
    
    const finalMarketplaceClient = await marketplacePool.connect();
    const marketplaceCount = await finalMarketplaceClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Marketplace database: ${marketplaceCount.rows[0].count} products`);
    finalMarketplaceClient.release();
    
    const finalBackupClient = await backupPool.connect();
    const backupCount = await finalBackupClient.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Backup database: ${backupCount.rows[0].count} products`);
    finalBackupClient.release();
    
    console.log('\n🎉 TRI-DATABASE SYSTEM WORKING PERFECTLY!');
    console.log('🔄 Workflow: Pending → Marketplace + Backup');
    console.log('📊 Database A: ecommerce_pending (seller submissions)');
    console.log('📊 Database B: ecommerce_marketplace (approved products)');
    console.log('📊 Database C: commercedb (backup & recovery)');
    
    await pendingPool.end();
    await marketplacePool.end();
    await backupPool.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTriDatabase();
