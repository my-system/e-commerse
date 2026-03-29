// Simple approval test
const http = require('http');

async function testApproval() {
  try {
    console.log('=== TESTING APPROVAL SIMPLE ===');
    
    const productId = '1774780325527';
    console.log(`Testing approval for product: ${productId}`);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/approve-product/${productId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        console.log(`Response: ${data}`);
        
        // Check status after approval
        checkAfterApproval();
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request Error:', error.message);
    });
    
    req.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function checkAfterApproval() {
  console.log('\n=== CHECKING STATUS AFTER APPROVAL ===');
  
  const { Pool } = require('pg');
  
  // Check pending
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  const pendingClient = await pendingPool.connect();
  const pendingResult = await pendingClient.query('SELECT id, title, status FROM products WHERE id = $1', ['1774780325527']);
  if (pendingResult.rows.length > 0) {
    console.log(`📊 Pending: ${pendingResult.rows[0].title} (${pendingResult.rows[0].status})`);
  } else {
    console.log('📊 Pending: Product not found');
  }
  pendingClient.release();
  
  // Check marketplace
  const marketplacePool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
  });
  
  const marketplaceClient = await marketplacePool.connect();
  const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products WHERE id = $1', ['1774780325527']);
  if (marketplaceResult.rows.length > 0) {
    console.log(`📊 Marketplace: ${marketplaceResult.rows[0].title} (${marketplaceResult.rows[0].status})`);
  } else {
    console.log('📊 Marketplace: Product not found');
  }
  marketplaceClient.release();
  
  await pendingPool.end();
  await marketplacePool.end();
}

testApproval();
