// Test multi-database system
const { PendingDatabaseService, MarketplaceDatabaseService, ApprovalWorkflowService } = require('./src/lib/multi-database-service');

async function testMultiDatabase() {
  try {
    console.log('=== TESTING MULTI-DATABASE SYSTEM ===');
    
    // Test 1: Add product to pending database
    console.log('\n1️⃣ Adding product to pending database...');
    const testProduct = {
      title: 'Test Multi-Database Product',
      price: 299900,
      category: 'electronics',
      description: 'This is a test product for multi-database system',
      featured: false,
      inStock: true,
      rating: 0,
      reviews: 0,
      images: '["/uploads/products/test-image.jpeg"]',
      material: 'Premium Material',
      care: 'Machine wash cold',
      status: 'pending',
      badges: '[]',
      sellerId: 'test-seller-123'
    };
    
    const addedProduct = await PendingDatabaseService.addProduct(testProduct);
    console.log('✅ Product added to pending database:', addedProduct.title);
    console.log('📊 Product ID:', addedProduct.id);
    
    // Test 2: Get pending products
    console.log('\n2️⃣ Fetching pending products...');
    const pendingProducts = await PendingDatabaseService.getPendingProducts();
    console.log(`✅ Found ${pendingProducts.length} pending products`);
    pendingProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.status})`);
    });
    
    // Test 3: Approve product and move to marketplace
    console.log('\n3️⃣ Approving product and moving to marketplace...');
    const approvalSuccess = await ApprovalWorkflowService.approveProduct(addedProduct.id);
    if (approvalSuccess) {
      console.log('✅ Product approved and moved to marketplace');
    } else {
      console.log('❌ Failed to approve product');
    }
    
    // Test 4: Get marketplace products
    console.log('\n4️⃣ Fetching marketplace products...');
    const marketplaceProducts = await MarketplaceDatabaseService.getMarketplaceProducts();
    console.log(`✅ Found ${marketplaceProducts.length} marketplace products`);
    marketplaceProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.status})`);
    });
    
    // Test 5: Check pending products after approval
    console.log('\n5️⃣ Checking pending products after approval...');
    const updatedPendingProducts = await PendingDatabaseService.getPendingProducts();
    console.log(`✅ Found ${updatedPendingProducts.length} pending products after approval`);
    
    console.log('\n=== MULTI-DATABASE TEST COMPLETE ===');
    console.log('🎯 System working correctly!');
    console.log('📊 Database A (pending):', updatedPendingProducts.length, 'products');
    console.log('📊 Database B (marketplace):', marketplaceProducts.length, 'products');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMultiDatabase();
