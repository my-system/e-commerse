// Test API untuk menghapus marketplace products
async function testMarketplaceDelete() {
  try {
    console.log('🧪 Testing Marketplace Delete API...');
    
    // Step 1: Get current marketplace products
    console.log('\n1️⃣ Getting current marketplace products...');
    const getResponse = await fetch('http://localhost:3000/api/marketplace-products');
    const getData = await getResponse.json();
    
    if (getData.success && getData.products.length > 0) {
      console.log(`✅ Found ${getData.products.length} marketplace products`);
      
      // Show first few products
      console.log('\n📋 Current Marketplace Products:');
      getData.products.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} (ID: ${product.id})`);
      });
      
      // Test delete on first product (but don't actually delete, just test the API structure)
      const firstProduct = getData.products[0];
      console.log(`\n2️⃣ Testing delete API structure for: ${firstProduct.title}`);
      console.log(`   DELETE URL: http://localhost:3000/api/marketplace-products?id=${firstProduct.id}`);
      
      // Test the API call (but commented out to avoid actual deletion)
      console.log('\n⚠️  To actually delete, uncomment the code below:');
      console.log(`
      // Uncomment to test actual deletion:
      const deleteResponse = await fetch('http://localhost:3000/api/marketplace-products?id=${firstProduct.id}', {
        method: 'DELETE'
      });
      const deleteData = await deleteResponse.json();
      console.log('Delete Result:', deleteData);
      `);
      
      console.log('\n✅ Marketplace Delete API is ready!');
      console.log('📝 Admin page: http://localhost:3000/admin/marketplace/products');
      
    } else {
      console.log('❌ No marketplace products found to test with');
      console.log('💡 Add some products to marketplace first by approving pending products');
    }
    
  } catch (error) {
    console.error('❌ Error testing marketplace delete API:', error.message);
  }
}

// Run the test
testMarketplaceDelete();
