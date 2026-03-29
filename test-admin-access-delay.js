// Test admin page access with delay
const http = require('http');

async function testAdminAccess() {
  try {
    console.log('=== TESTING ADMIN PAGE ACCESS (with delay) ===');
    
    // Wait for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
          console.log('✅ SUCCESS: Admin page accessible');
          if (data.includes('<!DOCTYPE html>')) {
            console.log('✅ HTML page loaded (not redirecting to login)');
          } else {
            console.log('Response data:', data.substring(0, 200));
          }
        } else {
          console.log('❌ FAILED: Admin page not accessible');
          console.log('Response:', data.substring(0, 200));
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
