// Test Admin Products Functionality
const fetch = require('node-fetch');

async function testAdminFeatures() {
  console.log('🧪 TESTING ADMIN PRODUCTS FUNCTIONALITY');
  console.log('=====================================\n');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test 1: Fetch pending products
    console.log('1️⃣ Testing GET /api/admin/pending-products');
    const getResponse = await fetch(`${baseUrl}/api/admin/pending-products`);
    const getData = await getResponse.json();
    
    console.log(`   Status: ${getResponse.status}`);
    console.log(`   Success: ${getData.success}`);
    console.log(`   Products: ${getData.products?.length || 0}`);
    
    if (getData.products && getData.products.length > 0) {
      const testProduct = getData.products[0];
      console.log(`   Sample product: ${testProduct.title} (${testProduct.status})`);
      
      // Test 2: Approve product
      console.log('\n2️⃣ Testing POST approve action');
      try {
        const approveResponse = await fetch(`${baseUrl}/api/admin/pending-products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: testProduct.id,
            action: 'approve'
          })
        });
        
        const approveData = await approveResponse.json();
        console.log(`   Status: ${approveResponse.status}`);
        console.log(`   Success: ${approveData.success}`);
        console.log(`   Message: ${approveData.message || approveData.error}`);
        
        if (approveData.success) {
          console.log('   ✅ Approve action working correctly');
        } else {
          console.log('   ❌ Approve action failed');
        }
        
      } catch (error) {
        console.log(`   ❌ Approve action error: ${error.message}`);
      }
      
      // Test 3: Reject product
      console.log('\n3️⃣ Testing POST reject action');
      try {
        const rejectResponse = await fetch(`${baseUrl}/api/admin/pending-products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: testProduct.id,
            action: 'reject',
            reason: 'Test rejection'
          })
        });
        
        const rejectData = await rejectResponse.json();
        console.log(`   Status: ${rejectResponse.status}`);
        console.log(`   Success: ${rejectData.success}`);
        console.log(`   Message: ${rejectData.message || rejectData.error}`);
        
        if (rejectData.success) {
          console.log('   ✅ Reject action working correctly');
        } else {
          console.log('   ❌ Reject action failed');
        }
        
      } catch (error) {
        console.log(`   ❌ Reject action error: ${error.message}`);
      }
      
      // Test 4: Delete product
      console.log('\n4️⃣ Testing DELETE action');
      try {
        const deleteResponse = await fetch(`${baseUrl}/api/admin/pending-products?id=${testProduct.id}`, {
          method: 'DELETE'
        });
        
        const deleteData = await deleteResponse.json();
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   Success: ${deleteData.success}`);
        console.log(`   Message: ${deleteData.message || deleteData.error}`);
        
        if (deleteData.success) {
          console.log('   ✅ Delete action working correctly');
        } else {
          console.log('   ❌ Delete action failed');
        }
        
      } catch (error) {
        console.log(`   ❌ Delete action error: ${error.message}`);
      }
      
    } else {
      console.log('   ⚠️  No products found to test actions');
    }
    
    // Test 5: Check marketplace products after approval
    console.log('\n5️⃣ Testing GET /api/marketplace-products');
    try {
      const marketplaceResponse = await fetch(`${baseUrl}/api/marketplace-products`);
      const marketplaceData = await marketplaceResponse.json();
      
      console.log(`   Status: ${marketplaceResponse.status}`);
      console.log(`   Success: ${marketplaceData.success}`);
      console.log(`   Products: ${marketplaceData.products?.length || 0}`);
      
      if (marketplaceData.success && marketplaceData.products) {
        const approvedProducts = marketplaceData.products.filter(p => p.status === 'approved');
        console.log(`   Approved products: ${approvedProducts.length}`);
        
        if (approvedProducts.length > 0) {
          console.log('   ✅ Marketplace showing approved products correctly');
        } else {
          console.log('   ⚠️  No approved products in marketplace');
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Marketplace API error: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAdminFeatures();
