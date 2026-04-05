// Fix product statuses in pending database
const { Pool } = require('pg');

async function fixProductStatuses() {
  console.log('🔧 FIXING PRODUCT STATUSES IN PENDING DATABASE');
  console.log('==========================================\n');
  
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  try {
    const client = await pendingPool.connect();
    
    // Check current statuses
    console.log('📊 CHECKING CURRENT STATUSES:');
    const currentResult = await client.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
    currentResult.rows.forEach((row, i) => {
      console.log(`  ${i+1}. ${row.title} (${row.id}) - ${row.status}`);
    });
    
    // Fix products that have wrong status
    const productsToFix = currentResult.rows.filter(row => row.status !== 'pending');
    
    if (productsToFix.length === 0) {
      console.log('\n✅ All products have correct status (pending)');
    } else {
      console.log(`\n🔧 FIXING ${productsToFix.length} PRODUCTS:`);
      
      for (const product of productsToFix) {
        await client.query('UPDATE products SET status = $1, updated_at = NOW() WHERE id = $2', ['pending', product.id]);
        console.log(`  ✅ Fixed: ${product.title} - changed from ${product.status} to pending`);
      }
      
      // Verify fix
      console.log('\n🔍 VERIFYING FIX:');
      const verifyResult = await client.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
      verifyResult.rows.forEach((row, i) => {
        console.log(`  ${i+1}. ${row.title} (${row.id}) - ${row.status}`);
      });
      
      const pendingCount = verifyResult.rows.filter(row => row.status === 'pending').length;
      console.log(`\n✅ SUCCESS: ${pendingCount} products now have status 'pending'`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await pendingPool.end();
  }
}

fixProductStatuses();
