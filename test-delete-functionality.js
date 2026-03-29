// Test delete functionality
const http = require('http');
const { Pool } = require('pg');

async function testDeleteFunctionality() {
  try {
    console.log('=== TESTING DELETE FUNCTIONALITY ===');
    
    // First, get a product to delete
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const pendingClient = await pendingPool.connect();
    const productsResult = await pendingClient.query('SELECT id, title FROM products ORDER BY created_at DESC LIMIT 1');
    
    if (productsResult.rows.length === 0) {
      console.log('❌ No products found to test delete');
      pendingClient.release();
      await pendingPool.end();
      return;
    }
    
    const productToDelete = productsResult.rows[0];
    console.log(`\n1️⃣ Found product to delete: ${productToDelete.title} (ID: ${productToDelete.id})`);
    
    // Test DELETE API
    console.log('\n2️⃣ Testing DELETE /api/pending-products...');
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/pending-products?id=${productToDelete.id}`,
        method: 'DELETE'
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`Delete Status: ${res.statusCode}`);
          try {
            const response = JSON.parse(data);
            console.log(`Delete Success: ${response.success}`);
            console.log(`Message: ${response.message}`);
            
            // Verify deletion
            console.log('\n3️⃣ Verifying deletion in database...');
            verifyDeletion(productToDelete.id, pendingPool);
          } catch (e) {
            console.log('Delete Response:', data);
          }
        });
      });
      
      req.on('error', (error) => {
        console.log('❌ Delete API Error:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.log('❌ Delete request failed:', error.message);
    }
    
    pendingClient.release();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function verifyDeletion(deletedId, pool) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products WHERE id = $1', [deletedId]);
    
    if (result.rows.length === 0) {
      console.log('✅ VERIFIED: Product successfully deleted from database');
    } else {
      console.log('❌ ERROR: Product still exists in database');
    }
    
    client.release();
    
    // Check remaining products
    const countClient = await pool.connect();
    const countResult = await countClient.query('SELECT COUNT(*) FROM products');
    console.log(`📊 Remaining products: ${countResult.rows[0].count}`);
    countClient.release();
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

testDeleteFunctionality();
