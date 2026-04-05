// Test database connections
const { Pool } = require('pg');

async function testDatabaseConnections() {
  console.log('🔍 TESTING DATABASE CONNECTIONS');
  console.log('================================\n');
  
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  const marketplacePool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
  });
  
  try {
    // Test pending database
    console.log('1️⃣ Testing PENDING database connection...');
    const pendingClient = await pendingPool.connect();
    try {
      const result = await pendingClient.query('SELECT COUNT(*) as count FROM products');
      console.log(`   ✅ Connected to pending database`);
      console.log(`   📊 Products in pending: ${result.rows[0].count}`);
      
      // Show sample products
      const sampleResult = await pendingClient.query('SELECT id, title, status FROM products ORDER BY created_at DESC LIMIT 3');
      console.log('   📋 Sample products:');
      sampleResult.rows.forEach((row, i) => {
        console.log(`     ${i+1}. ${row.title} (${row.id}) - ${row.status}`);
      });
      
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}`);
    } finally {
      pendingClient.release();
    }
    
    // Test marketplace database
    console.log('\n2️⃣ Testing MARKETPLACE database connection...');
    const marketplaceClient = await marketplacePool.connect();
    try {
      const result = await marketplaceClient.query('SELECT COUNT(*) as count FROM products');
      console.log(`   ✅ Connected to marketplace database`);
      console.log(`   📊 Products in marketplace: ${result.rows[0].count}`);
      
      // Show sample products
      const sampleResult = await marketplaceClient.query('SELECT id, title, status FROM products ORDER BY created_at DESC LIMIT 3');
      console.log('   📋 Sample products:');
      sampleResult.rows.forEach((row, i) => {
        console.log(`     ${i+1}. ${row.title} (${row.id}) - ${row.status}`);
      });
      
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}`);
    } finally {
      marketplaceClient.release();
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
  }
}

testDatabaseConnections();
