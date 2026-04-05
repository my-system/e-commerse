// Selective Reset - Remove Only User-Added Products, Keep Dummy Data
const { Pool } = require('pg');

class SelectiveReset {
  constructor() {
    this.pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
      ssl: false
    });
    
    this.marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace", 
      ssl: false
    });
  }

  async selectiveReset() {
    console.log('🎯 SELECTIVE RESET - Remove User Products Only');
    console.log('==========================================\n');
    
    try {
      // 1. Check current state
      await this.checkCurrentState();
      
      // 2. Identify user-added products vs dummy products
      const { userProducts, dummyProducts } = await this.identifyProductTypes();
      
      if (userProducts.length === 0) {
        console.log('✅ No user products found - no reset needed');
        return;
      }
      
      // 3. Show what will be deleted vs kept
      console.log('\n🗑️ USER PRODUCTS TO DELETE:');
      userProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     🆔 ID: ${product.id}`);
        console.log(`     💰 Price: Rp ${parseFloat(product.price).toLocaleString('id-ID')}`);
        console.log(`     📅 Created: ${new Date(product.created_at).toLocaleString('id-ID')}`);
        console.log(`     👤 Seller: ${product.seller_id}`);
      });
      
      console.log('\n✅ DUMMY PRODUCTS TO KEEP:');
      dummyProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     💰 Price: Rp ${parseFloat(product.price).toLocaleString('id-ID')}`);
        console.log(`     📊 Status: ${product.status}`);
      });
      
      // 4. Delete user products from both databases
      console.log(`\n🗑️ DELETING ${userProducts.length} USER PRODUCTS...`);
      
      const marketplaceClient = await this.marketplacePool.connect();
      const pendingClient = await this.pendingPool.connect();
      
      let deletedFromMarketplace = 0;
      let deletedFromPending = 0;
      
      // Delete from marketplace
      for (const product of userProducts) {
        await marketplaceClient.query('DELETE FROM products WHERE id = $1', [product.id]);
        console.log(`  ✅ Deleted from marketplace: ${product.title}`);
        deletedFromMarketplace++;
      }
      
      // Delete from pending if exists
      for (const product of userProducts) {
        const existsInPending = await pendingClient.query('SELECT id FROM products WHERE id = $1', [product.id]);
        if (existsInPending.rows.length > 0) {
          await pendingClient.query('DELETE FROM products WHERE id = $1', [product.id]);
          console.log(`  ✅ Deleted from pending: ${product.title}`);
          deletedFromPending++;
        }
      }
      
      // 5. Verify reset
      console.log('\n🔍 VERIFYING RESET...');
      const remainingMarketplace = await marketplaceClient.query('SELECT COUNT(*) FROM products');
      const remainingPending = await pendingClient.query('SELECT COUNT(*) FROM products');
      
      console.log(`\n📊 AFTER RESET:`);
      console.log(`  🟢 Marketplace: ${remainingMarketplace.rows[0].count} products remaining`);
      console.log(`  🔴 Pending: ${remainingPending.rows[0].count} products remaining`);
      console.log(`  🗑️ Deleted from marketplace: ${deletedFromMarketplace}`);
      console.log(`  🗑️ Deleted from pending: ${deletedFromPending}`);
      
      // 6. Show remaining products (should be only dummy products)
      const finalMarketplace = await marketplaceClient.query('SELECT * FROM products ORDER BY created_at DESC');
      if (finalMarketplace.rows.length > 0) {
        console.log(`\n✅ REMAINING PRODUCTS IN MARKETPLACE (Dummy Data Only):`);
        finalMarketplace.rows.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.title}`);
          console.log(`     💰 Price: Rp ${parseFloat(product.price).toLocaleString('id-ID')}`);
          console.log(`     📊 Status: ${product.status}`);
          console.log(`     👤 Type: Dummy Data`);
        });
      }
      
      marketplaceClient.release();
      pendingClient.release();
      
      console.log(`\n✅ SELECTIVE RESET COMPLETE!`);
      console.log(`🗑️ Deleted ${deletedFromMarketplace} user products from marketplace`);
      console.log(`✅ Kept ${dummyProducts.length} dummy products for display`);
      console.log(`🎯 Marketplace now contains only dummy data, ready for new architecture`);
      
      return {
        deletedFromMarketplace,
        deletedFromPending,
        dummyProductsKept: dummyProducts.length,
        remainingMarketplace: remainingMarketplace.rows[0].count,
        remainingPending: remainingPending.rows[0].count
      };
      
    } catch (error) {
      console.error('❌ Selective reset failed:', error.message);
      throw error;
    }
  }

  async checkCurrentState() {
    console.log('🔍 CHECKING CURRENT STATE');
    console.log('========================\n');
    
    try {
      const marketplaceClient = await this.marketplacePool.connect();
      const pendingClient = await this.pendingPool.connect();
      
      const marketplaceResult = await marketplaceClient.query('SELECT * FROM products ORDER BY created_at DESC');
      const pendingResult = await pendingClient.query('SELECT * FROM products ORDER BY created_at DESC');
      
      console.log(`📊 CURRENT STATE:`);
      console.log(`  🟢 Marketplace: ${marketplaceResult.rows.length} products`);
      console.log(`  🔴 Pending: ${pendingResult.rows.length} products`);
      
      if (marketplaceResult.rows.length > 0) {
        console.log(`\n📋 ALL MARKETPLACE PRODUCTS:`);
        marketplaceResult.rows.forEach((product, index) => {
          const type = this.identifyProductType(product);
          const icon = type === 'user' ? '👤' : '🤖';
          console.log(`  ${icon} ${index + 1}. ${product.title}`);
          console.log(`     📊 Status: ${product.status}`);
          console.log(`     👤 Seller: ${product.seller_id}`);
          console.log(`     📅 Created: ${new Date(product.created_at).toLocaleString('id-ID')}`);
          console.log(`     🏷️  Type: ${type === 'user' ? 'User Product' : 'Dummy Data'}`);
        });
      }
      
      marketplaceClient.release();
      pendingClient.release();
      
    } catch (error) {
      console.error('❌ Check failed:', error.message);
    }
  }

  async identifyProductTypes() {
    console.log('\n🔍 IDENTIFYING PRODUCT TYPES');
    console.log('============================\n');
    
    try {
      const marketplaceClient = await this.marketplacePool.connect();
      
      const allProducts = await marketplaceClient.query('SELECT * FROM products ORDER BY created_at DESC');
      
      // Separate user products vs dummy products
      const userProducts = [];
      const dummyProducts = [];
      
      allProducts.rows.forEach(product => {
        const type = this.identifyProductType(product);
        
        if (type === 'user') {
          userProducts.push(product);
        } else {
          dummyProducts.push(product);
        }
      });
      
      console.log(`📊 IDENTIFICATION RESULTS:`);
      console.log(`  👤 User products: ${userProducts.length}`);
      console.log(`  🤖 Dummy products: ${dummyProducts.length}`);
      
      console.log(`\n👤 USER PRODUCTS:`);
      userProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title} (${product.id})`);
        console.log(`     📅 Created: ${new Date(product.created_at).toLocaleString('id-ID')}`);
        console.log(`     👤 Seller: ${product.seller_id}`);
      });
      
      console.log(`\n🤖 DUMMY PRODUCTS:`);
      dummyProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title} (${product.id})`);
        console.log(`     📊 Status: ${product.status}`);
        console.log(`     👤 Seller: ${product.seller_id}`);
      });
      
      marketplaceClient.release();
      
      return { userProducts, dummyProducts };
      
    } catch (error) {
      console.error('❌ Identification failed:', error.message);
      return { userProducts: [], dummyProducts: [] };
    }
  }

  identifyProductType(product) {
    // Identify user products by these criteria:
    // 1. Recent uploads (last 30 days)
    // 2. Specific user-added patterns
    // 3. Not obvious dummy/test data
    
    const createdAt = new Date(product.created_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const isRecent = createdAt > thirtyDaysAgo;
    
    // Convert date to string for checking
    const createdString = product.created_at ? product.created_at.toString() : '';
    
    // User product indicators
    const isUserProduct = 
      // Recent uploads
      isRecent ||
      // Specific user patterns
      product.title.toLowerCase().includes('popok') ||
      product.title.toLowerCase().includes('sd') ||
      product.title.toLowerCase().includes('seller') ||
      // Real seller IDs (not demo)
      (product.seller_id && !product.seller_id.includes('demo')) ||
      // Realistic recent dates
      !createdString.includes('2023');
    
    // Dummy product indicators
    const isDummyProduct = 
      // Obvious test patterns
      product.title.toUpperCase().includes('TEST') ||
      product.title.toUpperCase().includes('ADMIN') ||
      product.title.toUpperCase().includes('DEMO') ||
      // Demo seller
      product.seller_id === 'demo-seller' ||
      // Old dates (dummy data)
      createdString.includes('2023');
    
    // Priority to user product detection
    if (isUserProduct && !isDummyProduct) {
      return 'user';
    } else {
      return 'dummy';
    }
  }

  async cleanup() {
    await this.pendingPool.end();
    await this.marketplacePool.end();
  }
}

// Run the selective reset
async function runSelectiveReset() {
  const reset = new SelectiveReset();
  
  try {
    const result = await reset.selectiveReset();
    
    console.log('\n🎯 SELECTIVE RESET SUMMARY:');
    console.log('==========================');
    console.log(`🗑️ User products deleted: ${result.deletedFromMarketplace}`);
    console.log(`✅ Dummy products kept: ${result.dummyProductsKept}`);
    console.log(`📋 Marketplace remaining: ${result.remainingMarketplace}`);
    console.log(`📋 Pending remaining: ${result.remainingPending}`);
    console.log('🎉 Ready for new architecture implementation!');
    
  } finally {
    await reset.cleanup();
  }
}

module.exports = { SelectiveReset, runSelectiveReset };

// Run immediately if called directly
if (require.main === module) {
  runSelectiveReset();
}
