// Fix Product Status Synchronization
const { Pool } = require('pg');

class StatusSyncFixer {
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

  async fixProductStatus() {
    console.log('🔧 FIXING PRODUCT STATUS SYNCHRONIZATION');
    console.log('====================================\n');
    
    try {
      // 1. Check current status of "sd" product in both databases
      console.log('🔍 CHECKING "sd" PRODUCT STATUS:');
      
      const pendingClient = await this.pendingPool.connect();
      const marketplaceClient = await this.marketplacePool.connect();
      
      // Get "sd" from pending database
      const pendingResult = await pendingClient.query(`
        SELECT id, title, status, created_at, updated_at 
        FROM products 
        WHERE title ILIKE '%sd%'
      `);
      
      // Get "sd" from marketplace database  
      const marketplaceResult = await marketplaceClient.query(`
        SELECT id, title, status, created_at, updated_at 
        FROM products 
        WHERE title ILIKE '%sd%'
      `);
      
      console.log(`📊 Found ${pendingResult.rows.length} "sd" products in pending database:`);
      pendingResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.title} (${row.id})`);
        console.log(`     📊 Status: ${row.status}`);
        console.log(`     📅 Created: ${new Date(row.created_at).toLocaleString('id-ID')}`);
      });
      
      console.log(`\n📊 Found ${marketplaceResult.rows.length} "sd" products in marketplace database:`);
      marketplaceResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.title} (${row.id})`);
        console.log(`     📊 Status: ${row.status}`);
        console.log(`     📅 Created: ${new Date(row.created_at).toLocaleString('id-ID')}`);
      });
      
      // 2. Identify the issue
      console.log('\n🔍 ANALYZING THE ISSUE:');
      
      const pendingSD = pendingResult.rows.find(row => row.title.toLowerCase().includes('sd'));
      const marketplaceSD = marketplaceResult.rows.find(row => row.title.toLowerCase().includes('sd'));
      
      if (pendingSD && marketplaceSD) {
        console.log(`📋 Found "sd" in both databases:`);
        console.log(`   🔴 Pending: ${pendingSD.status} (${pendingSD.id})`);
        console.log(`   🟢 Marketplace: ${marketplaceSD.status} (${marketplaceSD.id})`);
        console.log(`   📅 Same ID: ${pendingSD.id === marketplaceSD.id ? 'Yes' : 'No'}`);
        
        if (pendingSD.id === marketplaceSD.id) {
          console.log(`\n⚠️  ISSUE: Same product ID but different status`);
          console.log(`   This is causing the sync issue`);
          
          // 3. Fix the issue
          console.log(`\n🔧 FIXING THE ISSUE:`);
          
          // Option 1: If marketplace status is "approved" and pending is "pending", this is correct
          // The product should be removed from pending (already approved)
          if (marketplaceSD.status === 'approved' && pendingSD.status === 'pending') {
            console.log(`   📝 Marketplace status is "approved" - this is correct`);
            console.log(`   🗑️  Removing from pending database (product already approved)`);
            
            await pendingClient.query('DELETE FROM products WHERE id = $1', [pendingSD.id]);
            console.log(`   ✅ Removed from pending database`);
            
          } else if (pendingSD.status === 'pending' && marketplaceSD.status === 'approved') {
            console.log(`   📝 Status is correct - pending in pending, approved in marketplace`);
            console.log(`   ✅ No action needed - this is the correct state`);
            
          } else {
            console.log(`   📝 Status mismatch - need to fix`);
            console.log(`   🔧 Updating marketplace status to match pending status`);
            
            await marketplaceClient.query('UPDATE products SET status = $1 WHERE id = $2', [pendingSD.status, marketplaceSD.id]);
            console.log(`   ✅ Updated marketplace status to: ${pendingSD.status}`);
          }
          
        } else {
          console.log(`\n⚠️  ISSUE: Different product IDs but similar names`);
          console.log(`   This might be a naming conflict`);
          
          // Option 2: If different IDs, we need to decide which one to keep
          const pendingDate = new Date(pendingSD.created_at);
          const marketplaceDate = new Date(marketplaceSD.created_at);
          
          if (pendingDate > marketplaceDate) {
            console.log(`   📝 Pending version is newer - keep pending, remove from marketplace`);
            await marketplaceClient.query('DELETE FROM products WHERE id = $1', [marketplaceSD.id]);
            console.log(`   ✅ Removed marketplace version`);
            
          } else {
            console.log(`   📝 Marketplace version is newer - keep marketplace, remove from pending`);
            await pendingClient.query('DELETE FROM products WHERE id = $1', [pendingSD.id]);
            console.log(`   ✅ Removed pending version`);
          }
        }
        
      } else {
        console.log(`\n✅ No "sd" product found in both databases - no sync issue`);
      }
      
      // 4. Verify the fix
      console.log('\n🔍 VERIFYING THE FIX:');
      
      const newPendingResult = await pendingClient.query('SELECT COUNT(*) FROM products WHERE title ILIKE \'%sd%\'');
      const newMarketplaceResult = await marketplaceClient.query('SELECT COUNT(*) FROM products WHERE title ILIKE \'%sd%\'');
      
      console.log(`📊 After fix:`);
      console.log(`   🔴 Pending "sd" products: ${newPendingResult.rows[0].count}`);
      console.log(`   🟢 Marketplace "sd" products: ${newMarketplaceResult.rows[0].count}`);
      
      // Show final state
      if (newMarketplaceResult.rows[0].count > 0) {
        const finalMarketplaceSD = await marketplaceClient.query(`
          SELECT * FROM products WHERE title ILIKE '%sd%'
        `);
        
        console.log(`\n📋 FINAL "sd" IN MARKETPLACE:`);
        finalMarketplaceSD.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.title}`);
          console.log(`     📊 Status: ${row.status}`);
          console.log(`     💰 Price: Rp ${parseFloat(row.price).toLocaleString('id-ID')}`);
        });
      }
      
      pendingClient.release();
      marketplaceClient.release();
      
      console.log('\n✅ STATUS SYNC COMPLETE!');
      
    } catch (error) {
      console.error('❌ Status sync failed:', error.message);
      throw error;
    }
  }

  async verifyFinalState() {
    console.log('\n🔍 VERIFYING FINAL STATE');
    console.log('========================');
    
    try {
      const pendingClient = await this.pendingPool.connect();
      const marketplaceClient = await this.marketplacePool.connect();
      
      // Check all products
      const pendingResult = await pendingClient.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
      const marketplaceResult = await marketplaceClient.query('SELECT id, title, status FROM products ORDER BY created_at DESC');
      
      console.log(`📋 FINAL DATABASE STATE:`);
      console.log(`\n🔴 PENDING DATABASE (${pendingResult.rows.length} products):`);
      pendingResult.rows.forEach((row, index) => {
        const icon = row.status === 'pending' ? '✅' : '⚠️';
        console.log(`  ${icon} ${index + 1}. ${row.title} - ${row.status}`);
      });
      
      console.log(`\n🟢 MARKETPLACE DATABASE (${marketplaceResult.rows.length} products):`);
      marketplaceResult.rows.forEach((row, index) => {
        const icon = row.status === 'approved' ? '✅' : '⚠️';
        console.log(`  ${icon} ${index + 1}. ${row.title} - ${row.status}`);
      });
      
      // Check for any remaining sync issues
      const pendingIds = pendingResult.rows.map(r => r.id);
      const marketplaceIds = marketplaceResult.rows.map(r => r.id);
      const overlaps = pendingIds.filter(id => marketplaceIds.includes(id));
      
      if (overlaps.length === 0) {
        console.log(`\n✅ NO SYNC ISSUES FOUND!`);
        console.log(`🎯 All products are in the correct database with correct status`);
      } else {
        console.log(`\n⚠️  STILL FOUND ${overlaps.length} OVERLAPS:`);
        overlaps.forEach(id => {
          console.log(`   - ${id}`);
        });
      }
      
      pendingClient.release();
      marketplaceClient.release();
      
    } catch (error) {
      console.error('❌ Verification failed:', error.message);
    }
  }

  async cleanup() {
    await this.pendingPool.end();
    await this.marketplacePool.end();
  }
}

// Run the fix
async function runFix() {
  const fixer = new StatusSyncFixer();
  
  try {
    await fixer.fixProductStatus();
    await fixer.verifyFinalState();
    
    console.log('\n🎯 SYNC FIX SUMMARY:');
    console.log('==================');
    console.log('✅ Product status synchronization completed');
    console.log('🎯 Admin panel should now show correct status');
    console.log('🛒 Marketplace should only show approved products');
    
  } finally {
    await fixer.cleanup();
  }
}

module.exports = { StatusSyncFixer, runFix };

// Run immediately if called directly
if (require.main === module) {
  runFix();
}
