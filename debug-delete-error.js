// Debug delete error with detailed logging
const http = require('http');

async function debugDeleteError() {
  try {
    console.log('=== DEBUGGING DELETE ERROR ===');
    
    // Test 1: Check if server is running
    console.log('\n1️⃣ Checking server status...');
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/pending-products',
        method: 'GET'
      };
      
      const req = http.request(options, (res) => {
        console.log(`Server Status: ${res.statusCode} (running)`);
        
        // Test 2: Try delete with different methods
        console.log('\n2️⃣ Testing DELETE methods...');
        
        // Get a product ID first
        const getReq = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/pending-products',
          method: 'GET'
        }, (getRes) => {
          let data = '';
          getRes.on('data', chunk => data += chunk);
          getRes.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (response.products && response.products.length > 0) {
                const productId = response.products[0].id;
                console.log(`Testing delete with product ID: ${productId}`);
                
                // Test DELETE with query parameter
                console.log('\n3️⃣ Testing DELETE with query parameter...');
                const deleteReq = http.request({
                  hostname: 'localhost',
                  port: 3000,
                  path: `/api/pending-products?id=${productId}`,
                  method: 'DELETE'
                }, (deleteRes) => {
                  let deleteData = '';
                  deleteRes.on('data', chunk => deleteData += chunk);
                  deleteRes.on('end', () => {
                    console.log(`DELETE Status: ${deleteRes.statusCode}`);
                    console.log(`DELETE Response: ${deleteData}`);
                    
                    // Test 4: Try with different URL format
                    console.log('\n4️⃣ Testing with URLSearchParams format...');
                    const deleteReq2 = http.request({
                      hostname: 'localhost',
                      port: 3000,
                      path: `/api/pending-products?id=${productId}&method=delete`,
                      method: 'DELETE'
                    }, (deleteRes2) => {
                    let deleteData2 = '';
                    deleteRes2.on('data', chunk => deleteData2 += chunk);
                    deleteRes2.on('end', () => {
                      console.log(`DELETE 2 Status: ${deleteRes2.statusCode}`);
                      console.log(`DELETE 2 Response: ${deleteData2}`);
                    });
                  });
                  deleteReq2.on('error', (error) => {
                    console.log('DELETE 2 Error:', error.message);
                  });
                  deleteReq2.end();
                  });
                });
                deleteReq.on('error', (error) => {
                  console.log('DELETE Error:', error.message);
                });
                deleteReq.end();
              } else {
                console.log('No products found to test delete');
              }
            } catch (e) {
              console.log('GET Response Error:', e.message);
            }
          });
        });
        getReq.on('error', (error) => {
          console.log('GET Error:', error.message);
        });
        getReq.end();
      });
      
      req.on('error', (error) => {
        console.log('Server check error:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.log('❌ Debug failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDeleteError();
