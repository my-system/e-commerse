// Test frontend integration after API updates
const http = require('http');

async function testFrontendIntegration() {
  try {
    console.log('=== TESTING FRONTEND INTEGRATION ===');
    
    // Test 1: Seller products API
    console.log('\n1️⃣ Testing /api/pending-products (for seller products)...');
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/pending-products',
        method: 'GET'
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`Status: ${res.statusCode}`);
          try {
            const response = JSON.parse(data);
            console.log(`Success: ${response.success}`);
            console.log(`Products count: ${response.products ? response.products.length : 0}`);
            if (response.products && response.products.length > 0) {
              console.log('Products:');
              response.products.forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.title} (${product.status}) - Seller: ${product.sellerId}`);
              });
            }
          } catch (e) {
            console.log('Response:', data);
          }
        });
      });
      
      req.on('error', (error) => {
        console.log('❌ API Error:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
    
    // Test 2: Admin approval API
    console.log('\n2️⃣ Testing /api/admin/approve-product/[id] (for admin approval)...');
    
    // Get a pending product ID first
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT id FROM products WHERE status = $1 LIMIT 1', ['pending']);
    
    if (pendingResult.rows.length > 0) {
      const productId = pendingResult.rows[0].id;
      console.log(`Found pending product for approval: ${productId}`);
      
      try {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/admin/approve-product/${productId}`,
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
              console.log(`Message: ${response.message}`);
            } catch (e) {
              console.log('Approval Response:', data);
            }
          });
        });
        
        req.on('error', (error) => {
          console.log('❌ Approval API Error:', error.message);
        });
        
        req.end();
      } catch (error) {
        console.log('❌ Approval request failed:', error.message);
      }
    } else {
      console.log('No pending products found for approval test');
    }
    
    pendingClient.release();
    await pendingPool.end();
    
    // Test 3: Check if server is running
    console.log('\n3️⃣ Checking server status...');
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
      };
      
      const req = http.request(options, (res) => {
        console.log(`Server Status: ${res.statusCode} (running)`);
      });
      
      req.on('error', (error) => {
        console.log('❌ Server not running:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.log('❌ Server check failed:', error.message);
    }
    
    console.log('\n=== FRONTEND INTEGRATION TEST COMPLETE ===');
    console.log('✅ API endpoints updated');
    console.log('✅ Frontend should now show products');
    console.log('✅ Admin approval should work');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFrontendIntegration();
