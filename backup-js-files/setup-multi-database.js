// Setup multi-database system
const { Pool } = require('pg');

// Database connections
const pendingPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
});

const marketplacePool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
});

async function setupMultiDatabase() {
  try {
    console.log('=== SETTING UP MULTI-DATABASE SYSTEM ===');
    
    // Create databases
    const adminPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
    });
    
    const adminClient = await adminPool.connect();
    
    // Create databases if not exist
    try {
      await adminClient.query('CREATE DATABASE ecommerce_pending');
      console.log('✅ Database ecommerce_pending created');
    } catch (error) {
      if (error.code !== '42P04') { // Ignore "already exists" error
        console.log('❌ Error creating ecommerce_pending:', error.message);
      } else {
        console.log('✅ Database ecommerce_pending already exists');
      }
    }
    
    try {
      await adminClient.query('CREATE DATABASE ecommerce_marketplace');
      console.log('✅ Database ecommerce_marketplace created');
    } catch (error) {
      if (error.code !== '42P04') {
        console.log('❌ Error creating ecommerce_marketplace:', error.message);
      } else {
        console.log('✅ Database ecommerce_marketplace already exists');
      }
    }
    
    adminClient.release();
    await adminPool.end();
    
    // Setup tables in ecommerce_pending
    console.log('\n=== SETUP PENDING DATABASE ===');
    const pendingClient = await pendingPool.connect();
    
    await pendingClient.query(`
      CREATE TABLE IF NOT EXISTS products (
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
    
    console.log('✅ Products table created in ecommerce_pending');
    pendingClient.release();
    
    // Setup tables in ecommerce_marketplace
    console.log('\n=== SETUP MARKETPLACE DATABASE ===');
    const marketplaceClient = await marketplacePool.connect();
    
    await marketplaceClient.query(`
      CREATE TABLE IF NOT EXISTS products (
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
    
    console.log('✅ Products table created in ecommerce_marketplace');
    marketplaceClient.release();
    
    console.log('\n=== MULTI-DATABASE SETUP COMPLETE ===');
    console.log('📊 Database A: ecommerce_pending (for seller submissions)');
    console.log('📊 Database B: ecommerce_marketplace (for approved products)');
    
  } catch (error) {
    console.error('Error setting up databases:', error);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
  }
}

setupMultiDatabase();
