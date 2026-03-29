// Debug why seller product not showing
const { Pool } = require('pg');

async function debugSellerProduct() {
  try {
    console.log('=== DEBUGGING SELLER PRODUCT ISSUE ===');
    
    // Check pending database
    const pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
    });
    
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT * FROM products ORDER BY created_at DESC');
    
    console.log(`\n📊 ecommerce_pending Database (${pendingResult.rows.length} products):`);
    pendingResult.rows.forEach((product, index) => {
      console.log(`  ${index + 1}. ID: ${product.id}`);
      console.log(`     Title: ${product.title}`);
      console.log(`     Status: ${product.status}`);
      console.log(`     Seller: ${product.seller_id}`);
      console.log(`     Created: ${product.created_at}`);
      console.log('');
    });
    
    pendingClient.release();
    
    // Test API endpoints
    console.log('\n=== TESTING API ENDPOINTS ===');
    
    const https = require('https');
    const http = require('http');
    
    // Test pending-products API
    console.log('\n1️⃣ Testing /api/pending-products...');
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
              response.products.forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.title} (${product.status})`);
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
    
    // Test with sellerId parameter
    console.log('\n2️⃣ Testing /api/pending-products?sellerId=mock-seller-id...');
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/pending-products?sellerId=mock-seller-id',
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
              response.products.forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.title} (${product.status})`);
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
    
    // Check if server is running
    console.log('\n3️⃣ Checking if server is running...');
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/test-seller-products',
        method: 'GET'
      };
      
      const req = http.request(options, (res) => {
        console.log(`Server status: ${res.statusCode} (running)`);
      });
      
      req.on('error', (error) => {
        console.log('❌ Server not running:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.log('❌ Server check failed:', error.message);
    }
    
    await pendingPool.end();
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugSellerProduct();
