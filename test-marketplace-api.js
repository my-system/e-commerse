// Test API untuk memverifikasi marketplace products
async function testMarketplaceAPI() {
  try {
    console.log('🧪 Testing Marketplace API...');
    
    // Test 1: Get marketplace products
    const response = await fetch('http://localhost:3000/api/marketplace-products');
    const data = await response.json();
    
    if (data.success && data.products) {
      console.log(`✅ Found ${data.products.length} products in marketplace`);
      
      // Test 2: Check first product structure
      if (data.products.length > 0) {
        const firstProduct = data.products[0];
        console.log('\n📦 First Product Details:');
        console.log(`   ID: ${firstProduct.id}`);
        console.log(`   Title: ${firstProduct.title}`);
        console.log(`   Price: ${firstProduct.price}`);
        console.log(`   Category: ${firstProduct.category}`);
        console.log(`   Images: ${firstProduct.images ? JSON.parse(firstProduct.images).length : 0} images`);
        
        // Generate slug
        const slug = firstProduct.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        console.log(`   Generated Slug: ${slug}`);
        console.log(`   Detail URL: http://localhost:3000/product/${slug}`);
        
        // Test 3: Test slug API
        console.log('\n🔍 Testing Slug API...');
        const slugResponse = await fetch(`http://localhost:3000/api/products/slug/${slug}`);
        const slugData = await slugResponse.json();
        
        if (slugData.success) {
          console.log(`✅ Slug API works for: ${slug}`);
        } else {
          console.log(`❌ Slug API failed for: ${slug}`);
          console.log(`   Error: ${slugData.message}`);
        }
      }
      
      // Test 4: List all products with their slugs
      console.log('\n📋 All Products with Slugs:');
      data.products.forEach((product, index) => {
        const slug = product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        console.log(`   ${index + 1}. ${product.title} -> /product/${slug}`);
      });
      
    } else {
      console.log('❌ No products found in marketplace');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
testMarketplaceAPI();
