// Test admin API after fixing statuses
const http = require('http');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testAdminAPI() {
  console.log('🧪 TESTING ADMIN API AFTER FIX');
  console.log('===============================\n');
  
  try {
    // Test GET pending products
    console.log('1️⃣ Testing GET /api/admin/pending-products');
    const getResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/pending-products',
      method: 'GET'
    });
    
    console.log(`   Status: ${getResponse.statusCode}`);
    
    if (getResponse.statusCode === 200 && getResponse.data.success) {
      console.log(`   ✅ Success: ${getResponse.data.success}`);
      console.log(`   📦 Products: ${getResponse.data.products?.length || 0}`);
      
      if (getResponse.data.products && getResponse.data.products.length > 0) {
        console.log('   📋 Products found:');
        getResponse.data.products.forEach((product, i) => {
          console.log(`     ${i+1}. ${product.title} - ${product.status}`);
        });
        
        // Test approve action
        const testProduct = getResponse.data.products[0];
        console.log(`\n2️⃣ Testing approve action for: ${testProduct.title}`);
        
        const approveResponse = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/pending-products',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify({
              productId: testProduct.id,
              action: 'approve'
            }))
          }
        });
        
        approveResponse.write(JSON.stringify({
          productId: testProduct.id,
          action: 'approve'
        }));
        
        console.log(`   Status: ${approveResponse.statusCode}`);
        console.log(`   Success: ${approveResponse.data.success}`);
        console.log(`   Message: ${approveResponse.data.message || approveResponse.data.error}`);
        
        if (approveResponse.data.success) {
          console.log('   ✅ Approve action working correctly!');
        } else {
          console.log('   ❌ Approve action failed');
        }
      }
    } else {
      console.log(`   ❌ API Error: ${getResponse.data.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminAPI();
