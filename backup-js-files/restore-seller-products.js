// Restore Seller Products to Pending Database
const { Pool } = require('pg');

class ProductRestorer {
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

  async restoreSellerProducts() {
    console.log('🔄 RESTORING SELLER PRODUCTS TO PENDING DATABASE');
    console.log('===============================================\n');
    
    try {
      // 1. Get all products from marketplace database
      const marketplaceClient = await this.marketplacePool.connect();
      const marketplaceResult = await marketplaceClient.query(`
        SELECT * FROM products 
        ORDER BY created_at DESC
      `);
      
      const allMarketplaceProducts = marketplaceResult.rows;
      console.log(`📊 Found ${allMarketplaceProducts.length} products in marketplace database`);
      
      // 2. Identify seller products (not admin/test products)
      const sellerProducts = allMarketplaceProducts.filter(product => {
        // Consider as seller product if:
        // - Has seller_id that's not 'demo-seller' or 'admin'
        // - Title doesn't contain 'TEST' or 'ADMIN'
        // - Created in last 30 days (recent uploads)
        const createdAt = new Date(product.created_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const isRecentSellerProduct = createdAt > thirtyDaysAgo;
        const isNotAdminTest = !product.title.toUpperCase().includes('TEST') && 
                               !product.title.toUpperCase().includes('ADMIN');
        const isNotDemoSeller = product.seller_id !== 'demo-seller';
        
        return isRecentSellerProduct && isNotAdminTest && isNotDemoSeller;
      });
      
      console.log(`🔍 Identified ${sellerProducts.length} potential seller products:`);
      sellerProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title} (${product.created_at})`);
      });
      
      // 3. Restore to pending database
      const pendingClient = await this.pendingPool.connect();
      let restored = 0;
      
      for (const product of sellerProducts) {
        // Check if already exists in pending
        const existingCheck = await pendingClient.query(
          'SELECT id FROM products WHERE id = $1',
          [product.id]
        );
        
        if (existingCheck.rows.length === 0) {
          // Insert into pending database with correct status
          await pendingClient.query(`
            INSERT INTO products (
              id, title, price, category, description, featured, in_stock,
              rating, reviews, images, material, care, status, badges, seller_id,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          `, [
            product.id, 
            product.title, 
            product.price, 
            product.category, 
            product.description,
            product.featured, 
            product.in_stock, 
            product.rating, 
            product.reviews,
            product.images, 
            product.material, 
            product.care, 
            'pending', // Set to pending for admin review
            product.badges, 
            product.seller_id,
            product.created_at, 
            new Date().toISOString()
          ]);
          
          console.log(`  ✅ Restored: ${product.title}`);
          restored++;
        } else {
          console.log(`  ⚠️  Already exists: ${product.title}`);
        }
      }
      
      // 4. Verify restoration
      const pendingResult = await pendingClient.query('SELECT COUNT(*) FROM products');
      const finalCount = parseInt(pendingResult.rows[0].count);
      
      console.log(`\n📊 RESTORATION COMPLETE:`);
      console.log(`  ✅ Products restored: ${restored}`);
      console.log(`  📋 Total in pending database: ${finalCount}`);
      
      // 5. Show final state
      const finalProducts = await pendingClient.query(`
        SELECT id, title, status, created_at, seller_id 
        FROM products 
        ORDER BY created_at DESC
      `);
      
      console.log(`\n📋 FINAL PENDING DATABASE CONTENT:`);
      finalProducts.rows.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     🆔 ID: ${product.id}`);
        console.log(`     📊 Status: ${product.status}`);
        console.log(`     👤 Seller: ${product.seller_id}`);
        console.log(`     📅 Created: ${new Date(product.created_at).toLocaleString('id-ID')}`);
        console.log('');
      });
      
      pendingClient.release();
      marketplaceClient.release();
      
      return {
        restored,
        totalInPending: finalCount,
        products: finalProducts.rows
      };
      
    } catch (error) {
      console.error('❌ Restoration failed:', error.message);
      throw error;
    }
  }

  async checkCurrentState() {
    console.log('🔍 CHECKING CURRENT DATABASE STATE');
    console.log('==================================\n');
    
    try {
      const pendingClient = await this.pendingPool.connect();
      const marketplaceClient = await this.marketplacePool.connect();
      
      // Check pending database
      const pendingResult = await pendingClient.query('SELECT COUNT(*) FROM products');
      const pendingCount = parseInt(pendingResult.rows[0].count);
      
      // Check marketplace database  
      const marketplaceResult = await marketplaceClient.query('SELECT COUNT(*) FROM products');
      const marketplaceCount = parseInt(marketplaceResult.rows[0].count);
      
      console.log(`📊 CURRENT STATE:`);
      console.log(`  🔴 Pending Database: ${pendingCount} products`);
      console.log(`  🟢 Marketplace Database: ${marketplaceCount} products`);
      console.log(`  📈 Total Products: ${pendingCount + marketplaceCount}`);
      
      if (pendingCount === 0) {
        console.log(`\n⚠️  PENDING DATABASE IS EMPTY!`);
        console.log(`💡 This means admin panel will show no products`);
        console.log(`💡 Seller products page will show no products`);
        console.log(`🔧 Need to restore seller products to pending database`);
      }
      
      pendingClient.release();
      marketplaceClient.release();
      
      return { pendingCount, marketplaceCount };
      
    } catch (error) {
      console.error('❌ Check failed:', error.message);
    }
  }

  async cleanup() {
    await this.pendingPool.end();
    await this.marketplacePool.end();
  }
}

// Run restoration
async function runRestoration() {
  const restorer = new ProductRestorer();
  
  try {
    // First check current state
    await restorer.checkCurrentState();
    
    // Then restore products
    const result = await restorer.restoreSellerProducts();
    
    console.log('\n🎯 RESTORATION SUMMARY:');
    console.log('======================');
    console.log(`✅ Products restored: ${result.restored}`);
    console.log(`📋 Total in pending DB: ${result.totalInPending}`);
    
    if (result.restored > 0) {
      console.log('🎉 Admin panel and seller products should now show the restored products!');
    }
    
  } finally {
    await restorer.cleanup();
  }
}

module.exports = { ProductRestorer, runRestoration };

// Run immediately if called directly
if (require.main === module) {
  runRestoration();
}
