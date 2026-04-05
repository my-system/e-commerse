// Debug approval workflow
const { Pool } = require('pg');

async function debugApprovalWorkflow() {
  try {
    console.log('=== DEBUGGING APPROVAL WORKFLOW ===');
    
    // Check current status in both databases
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
    });
    
    console.log('\n1️⃣ CURRENT STATUS BEFORE APPROVAL:');
    
    // Check pending database
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
    console.log(`📊 ecommerce_pending (${pendingResult.rows.length} products):`);
    pendingResult.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.status})`);
    });
    pendingClient.release();
    
    // Check marketplace database
    const marketplaceClient = await marketplacePool.connect();
    const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products ORDER BY approved_at DESC');
    console.log(`\n📊 ecommerce_marketplace (${marketplaceResult.rows.length} products):`);
    marketplaceResult.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.status})`);
    });
    marketplaceClient.release();
    
    // Test approval API
    console.log('\n2️⃣ TESTING APPROVAL API:');
    
    // Get a pending product to approve
    const getProductClient = await pendingPool.connect();
    const productResult = await getProductClient.query('SELECT * FROM products WHERE status = $1 LIMIT 1', ['pending']);
    
    if (productResult.rows.length === 0) {
      console.log('❌ No pending products found to test approval');
      getProductClient.release();
      await pendingPool.end();
      await marketplacePool.end();
      return;
    }
    
    const productToApprove = productResult.rows[0];
    console.log(`Found product to approve: ${productToApprove.title} (ID: ${productToApprove.id})`);
    getProductClient.release();
    
    // Test approval API
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/approve-product/${productToApprove.id}`,
      method: 'POST'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Approval Status: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log(`Approval Success: ${response.success}`);
          console.log(`Approval Message: ${response.message}`);
          
          // Check status after approval
          console.log('\n3️⃣ STATUS AFTER APPROVAL:');
          checkStatusAfterApproval(productToApprove.id, pendingPool, marketplacePool);
          
        } catch (e) {
          console.log('Approval Response Error:', e.message);
          console.log('Raw Response:', data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Approval API Error:', error.message);
    });
    
    req.end();
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

async function checkStatusAfterApproval(productId, pendingPool, marketplacePool) {
  try {
    // Check pending database
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT id, title, status FROM products WHERE id = $1', [productId]);
    if (pendingResult.rows.length > 0) {
      console.log(`📊 ecommerce_pending after approval: ${pendingResult.rows[0].title} (${pendingResult.rows[0].status})`);
    } else {
      console.log('📊 ecommerce_pending after approval: Product not found');
    }
    pendingClient.release();
    
    // Check marketplace database
    const marketplaceClient = await marketplacePool.connect();
    const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products WHERE id = $1', [productId]);
    if (marketplaceResult.rows.length > 0) {
      console.log(`📊 ecommerce_marketplace after approval: ${marketplaceResult.rows[0].title} (${marketplaceResult.rows[0].status})`);
    } else {
      console.log('📊 ecommerce_marketplace after approval: Product not found');
    }
    marketplaceClient.release();
    
    await pendingPool.end();
    await marketplacePool.end();
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
  }
}

debugApprovalWorkflow();
