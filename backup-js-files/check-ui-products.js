// Script untuk melihat produk yang ditampilkan di UI
console.log('🔍 CHECKING PRODUCTS IN UI');
console.log('========================\n');

// Check Seller Products Page
console.log('📱 SELLER PRODUCTS PAGE:');
console.log('------------------------');
console.log('📍 URL: http://localhost:3000/seller/products');
console.log('🔄 API yang dipanggil: /api/pending-products');
console.log('📊 Expected: Menampilkan produk dari pending database\n');

// Check Admin Products Page  
console.log('👨‍💻 ADMIN PRODUCTS PAGE:');
console.log('------------------------');
console.log('📍 URL: http://localhost:3000/admin/products');
console.log('🔄 API yang dipanggil: /api/admin/pending-products');
console.log('📊 Expected: Menampilkan produk dari pending database\n');

// Check Marketplace Page
console.log('🛒 MARKETPLACE PAGE:');
console.log('----------------------');
console.log('📍 URL: http://localhost:3000/marketplace');
console.log('🔄 API yang dipanggil: /api/marketplace-products');
console.log('📊 Expected: Menampilkan produk approved dari marketplace database\n');

// Test API endpoints
console.log('🧪 TESTING API ENDPOINTS:');
console.log('-------------------------');

async function testAPIs() {
  try {
    // Test pending products API
    console.log('1️⃣ Testing /api/pending-products:');
    const pendingResponse = await fetch('http://localhost:3000/api/pending-products');
    const pendingData = await pendingResponse.json();
    console.log(`   ✅ Status: ${pendingResponse.status}`);
    console.log(`   📦 Products: ${pendingData.products?.length || 0} items`);
    if (pendingData.products?.length > 0) {
      pendingData.products.forEach((p, i) => {
        console.log(`   ${i+1}. ${p.title} (${p.status})`);
      });
    }
    console.log('');
    
    // Test admin pending products API
    console.log('2️⃣ Testing /api/admin/pending-products:');
    const adminResponse = await fetch('http://localhost:3000/api/admin/pending-products');
    const adminData = await adminResponse.json();
    console.log(`   ✅ Status: ${adminResponse.status}`);
    console.log(`   📦 Products: ${adminData.products?.length || 0} items`);
    if (adminData.products?.length > 0) {
      adminData.products.forEach((p, i) => {
        console.log(`   ${i+1}. ${p.title} (${p.status})`);
      });
    }
    console.log('');
    
    // Test marketplace products API
    console.log('3️⃣ Testing /api/marketplace-products:');
    const marketplaceResponse = await fetch('http://localhost:3000/api/marketplace-products');
    const marketplaceData = await marketplaceResponse.json();
    console.log(`   ✅ Status: ${marketplaceResponse.status}`);
    console.log(`   📦 Products: ${marketplaceData.products?.length || 0} items`);
    if (marketplaceData.products?.length > 0) {
      marketplaceData.products.forEach((p, i) => {
        console.log(`   ${i+1}. ${p.title} (${p.status})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing APIs:', error.message);
    console.log('\n💡 Make sure your Next.js server is running (npm run dev)');
  }
}

// Run the test
testAPIs();

console.log('\n📝 INSTRUCTIONS:');
console.log('================');
console.log('1. Make sure Next.js server is running');
console.log('2. Open browser console and run this script');
console.log('3. Check each page manually:');
console.log('   - Seller: http://localhost:3000/seller/products');
console.log('   - Admin:  http://localhost:3000/admin/products');
console.log('   - Market: http://localhost:3000/marketplace');
console.log('4. Compare with API results above');

// Check localStorage
console.log('\n💾 CHECKING LOCALSTORAGE:');
console.log('Run this in browser console:');
console.log('const localProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");');
console.log('console.log("Local products:", localProducts);');
console.log('console.log("Local products count:", localProducts.length);');
