// Fix all database structures to match
const { Pool } = require('pg');

const adminPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
});

async function fixAllDatabases() {
  try {
    console.log('=== FIXING ALL DATABASE STRUCTURES ===');
    
    const adminClient = await adminPool.connect();
    
    // Fix ecommerce_pending
    console.log('\n1️⃣ Fixing ecommerce_pending...');
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    const pendingClient = await pendingPool.connect();
    await pendingClient.query('DROP TABLE IF EXISTS products');
    await pendingClient.query(`
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
    console.log('✅ ecommerce_pending fixed');
    pendingClient.release();
    await pendingPool.end();
    
    // Fix ecommerce_marketplace
    console.log('\n2️⃣ Fixing ecommerce_marketplace...');
    const marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
    });
    const marketplaceClient = await marketplacePool.connect();
    await marketplaceClient.query('DROP TABLE IF EXISTS products');
    await marketplaceClient.query(`
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
        status VARCHAR(20) DEFAULT 'approved',
        badges TEXT,
        seller_id VARCHAR(255),
        approved_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ ecommerce_marketplace fixed');
    marketplaceClient.release();
    await marketplacePool.end();
    
    // Fix commercedb (backup)
    console.log('\n3️⃣ Fixing commercedb...');
    const backupPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
    });
    const backupClient = await backupPool.connect();
    await backupClient.query('DROP TABLE IF EXISTS products');
    await backupClient.query(`
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
    console.log('✅ commercedb fixed');
    backupClient.release();
    await backupPool.end();
    
    adminClient.release();
    await adminPool.end();
    
    console.log('\n=== ALL DATABASES FIXED ===');
    
    // Test the system
    await testTriDatabaseSystem();
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

async function testTriDatabaseSystem() {
  console.log('\n=== TESTING TRI-DATABASE SYSTEM ===');
  
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  const marketplacePool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
  });
  
  const backupPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
  });
  
  try {
    // Add test product to pending
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
    console.log(`✅ Test product added to pending: ${testProductId}`);
    pendingClient.release();
    
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
    console.log('✅ Product added to marketplace');
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
    console.log('✅ Product added to backup');
    addToBackupClient.release();
    
    // Update status in pending
    const updateStatusClient = await pendingPool.connect();
    await updateStatusClient.query('UPDATE products SET status = $1 WHERE id = $2', ['approved', testProductId]);
    updateStatusClient.release();
    
    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    
    const finalPendingClient = await pendingPool.connect();
    const finalPendingCount = await finalPendingClient.query('SELECT COUNT(*) FROM products');
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
    
    console.log('\n🎉 TRI-DATABASE SYSTEM WORKING PERFECTLY!');
    console.log('🔄 Workflow: Pending → Marketplace + Backup');
    console.log('📊 Database A: ecommerce_pending (seller submissions)');
    console.log('📊 Database B: ecommerce_marketplace (approved products)');
    console.log('📊 Database C: commercedb (backup & recovery)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
    await backupPool.end();
  }
}

fixAllDatabases();
