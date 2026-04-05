// Test complete approval workflow
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testApprovalWorkflow() {
  console.log('🧪 TESTING COMPLETE APPROVAL WORKFLOW');
  console.log('====================================\n');
  
  try {
    // Step 1: Check current state
    console.log('📊 STEP 1: Check current database state');
    
    // Check pending products
    const pendingResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/pending-products',
      method: 'GET'
    });
    
    console.log(`   Pending products: ${pendingResponse.data.products?.length || 0}`);
    if (pendingResponse.data.products && pendingResponse.data.products.length > 0) {
      pendingResponse.data.products.forEach((p, i) => {
        console.log(`     ${i+1}. ${p.title} - ${p.status}`);
      });
    }
    
    // Check marketplace products
    const marketplaceResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/marketplace-products',
      method: 'GET'
    });
    
    console.log(`   Marketplace products: ${marketplaceResponse.data.products?.length || 0}`);
    if (marketplaceResponse.data.products && marketplaceResponse.data.products.length > 0) {
      marketplaceResponse.data.products.forEach((p, i) => {
        console.log(`     ${i+1}. ${p.title} - ${p.status}`);
      });
    }
    
    // Step 2: Test approval workflow
    if (pendingResponse.data.products && pendingResponse.data.products.length > 0) {
      const testProduct = pendingResponse.data.products[0];
      console.log(`\n📝 STEP 2: Testing approval for "${testProduct.title}"`);
      
      // Approve product
      const postData = JSON.stringify({
        productId: testProduct.id,
        action: 'approve'
      });
      
      const approveResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/pending-products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, postData);
      
      console.log(`   Approval status: ${approveResponse.statusCode}`);
      console.log(`   Approval success: ${approveResponse.data.success}`);
      console.log(`   Message: ${approveResponse.data.message || approveResponse.data.error}`);
      
      // Step 3: Verify results
      console.log('\n🔍 STEP 3: Verify workflow results');
      
      // Check pending again
      const newPendingResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/pending-products',
        method: 'GET'
      });
      
      console.log(`   Pending products after approval: ${newPendingResponse.data.products?.length || 0}`);
      
      // Check marketplace again
      const newMarketplaceResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/marketplace-products',
        method: 'GET'
      });
      
      console.log(`   Marketplace products after approval: ${newMarketplaceResponse.data.products?.length || 0}`);
      
      // Check if product moved correctly
      const productInMarketplace = newMarketplaceResponse.data.products?.find(p => p.id === testProduct.id);
      const productInPending = newPendingResponse.data.products?.find(p => p.id === testProduct.id);
      
      if (productInMarketplace && !productInPending) {
        console.log('   ✅ SUCCESS: Product moved from pending to marketplace correctly');
        console.log(`   📦 Product in marketplace: ${productInMarketplace.title} - ${productInMarketplace.status}`);
      } else {
        console.log('   ❌ ISSUE: Product not moved correctly');
        if (productInPending) console.log(`   ⚠️  Still in pending: ${productInPending.title}`);
        if (!productInMarketplace) console.log(`   ⚠️  Not found in marketplace`);
      }
      
    } else {
      console.log('\n⚠️  No products to test approval workflow');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApprovalWorkflow();
