// Test admin page access
const http = require('http');

async function testAdminAccess() {
  try {
    console.log('=== TESTING ADMIN PAGE ACCESS ===');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/admin/database',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('✅ SUCCESS: Admin page accessible');
            console.log(`Products count: ${response.products ? response.products.length : 0}`);
          } catch (e) {
            console.log('Response (raw):', data);
          }
        } else {
          console.log('❌ FAILED: Admin page not accessible');
          console.log('Response:', data);
        }
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

testAdminAccess();
