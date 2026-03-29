// Test alternative approval API
const http = require('http');

async function testAltApproval() {
  try {
    console.log('=== TESTING ALTERNATIVE APPROVAL API ===');
    
    const productId = '1774780325527';
    console.log(`Testing approval for product: ${productId}`);
    
    const postData = JSON.stringify({ productId: productId });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/approve',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        
        // Check result
        setTimeout(() => {
          checkApprovalResult(productId);
        }, 1000);
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request Error:', error.message);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function checkApprovalResult(productId) {
  console.log('\n=== CHECKING APPROVAL RESULT ===');
  
  const { Pool } = require('pg');
  
  // Check pending database
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  const pendingClient = await pendingPool.connect();
  const pendingResult = await pendingClient.query('SELECT id, title, status FROM products WHERE id = $1', [productId]);
  if (pendingResult.rows.length > 0) {
    console.log(`📊 Pending: ${pendingResult.rows[0].title} (${pendingResult.rows[0].status})`);
  } else {
    console.log('📊 Pending: Product not found');
  }
  pendingClient.release();
  
  // Check marketplace database
  const marketplacePool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
  });
  
  const marketplaceClient = await marketplacePool.connect();
  const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products WHERE id = $1', [productId]);
  if (marketplaceResult.rows.length > 0) {
    console.log(`📊 Marketplace: ${marketplaceResult.rows[0].title} (${marketplaceResult.rows[0].status})`);
  } else {
    console.log('📊 Marketplace: Product not found');
  }
  marketplaceClient.release();
  
  await pendingPool.end();
  await marketplacePool.end();
}

testAltApproval();
