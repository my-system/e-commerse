// Test approval with browser-like request
const http = require('http');

async function testApprovalBrowser() {
  try {
    console.log('=== TESTING APPROVAL BROWSER-STYLE ===');
    
    // First, get the pending products list
    console.log('\n1️⃣ Getting pending products...');
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pending-products',
      method: 'GET'
    };
    
    const getReq = http.request(getOptions, (getRes) => {
      let getData = '';
      getRes.on('data', chunk => getData += chunk);
      getRes.on('end', () => {
        console.log(`GET Status: ${getRes.statusCode}`);
        
        try {
          const getResponse = JSON.parse(getData);
          console.log(`GET Success: ${getResponse.success}`);
          console.log(`GET Products: ${getResponse.products ? getResponse.products.length : 0}`);
          
          if (getResponse.products && getResponse.products.length > 0) {
            const product = getResponse.products[0];
            console.log(`\nFound product: ${product.title} (ID: ${product.id})`);
            
            // Now test approval
            console.log('\n2️⃣ Testing approval...');
            const postOptions = {
              hostname: 'localhost',
              port: 3000,
              path: `/api/admin/approve-product/${product.id}`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            };
            
            const postReq = http.request(postOptions, (postRes) => {
              let postData = '';
              postRes.on('data', chunk => postData += chunk);
              postRes.on('end', () => {
                console.log(`POST Status: ${postRes.statusCode}`);
                console.log(`POST Headers:`, postRes.headers);
                console.log(`POST Response: ${postData}`);
                
                // Check if approval worked
                setTimeout(() => {
                  checkApprovalResult(product.id);
                }, 1000);
              });
            });
            
            postReq.on('error', (error) => {
              console.log('❌ POST Request Error:', error.message);
            });
            
            postReq.end();
          }
        } catch (e) {
          console.log('GET Response Error:', e.message);
          console.log('Raw GET Response:', getData);
        }
      });
    });
    
    getReq.on('error', (error) => {
      console.log('❌ GET Request Error:', error.message);
    });
    
    getReq.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function checkApprovalResult(productId) {
  console.log('\n3️⃣ Checking approval result...');
  
  const { Pool } = require('pg');
  
  // Check pending database
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  const pendingClient = await pendingPool.connect();
  const pendingResult = await pendingClient.query('SELECT id, title, status FROM products WHERE id = $1', [productId]);
  if (pendingResult.rows.length > 0) {
    console.log(`📊 Pending after approval: ${pendingResult.rows[0].title} (${pendingResult.rows[0].status})`);
  } else {
    console.log('📊 Pending after approval: Product not found');
  }
  pendingClient.release();
  
  // Check marketplace database
  const marketplacePool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
  });
  
  const marketplaceClient = await marketplacePool.connect();
  const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products WHERE id = $1', [productId]);
  if (marketplaceResult.rows.length > 0) {
    console.log(`📊 Marketplace after approval: ${marketplaceResult.rows[0].title} (${marketplaceResult.rows[0].status})`);
  } else {
    console.log('📊 Marketplace after approval: Product not found');
  }
  marketplaceClient.release();
  
  // Count marketplace products
  const countClient = await marketplacePool.connect();
  const countResult = await countClient.query('SELECT COUNT(*) FROM products');
  console.log(`📊 Total marketplace products: ${countResult.rows[0].count}`);
  countClient.release();
  
  await pendingPool.end();
  await marketplacePool.end();
  
  console.log('\n=== APPROVAL TEST COMPLETE ===');
}

testApprovalBrowser();
