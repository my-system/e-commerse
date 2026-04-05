// Database Health Monitor & Validation System
const { Pool } = require('pg');

class DatabaseHealthMonitor {
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

  async runFullHealthCheck() {
    console.log('🔍 RUNNING DATABASE HEALTH CHECK');
    console.log('=====================================\n');
    
    const results = {
      pending: await this.checkPendingDatabase(),
      marketplace: await this.checkMarketplaceDatabase(),
      consistency: await this.checkDataConsistency(),
      workflow: await this.checkWorkflowIntegrity(),
      timestamp: new Date().toISOString()
    };
    
    this.generateReport(results);
    return results;
  }

  async checkPendingDatabase() {
    console.log('🔴 CHECKING PENDING DATABASE:');
    console.log('-------------------------------');
    
    const client = await this.pendingPool.connect();
    try {
      // Check table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'products'
        );
      `);
      
      const tableExists = tableCheck.rows[0].exists;
      console.log(`  📋 Table exists: ${tableExists ? '✅' : '❌'}`);
      
      if (!tableExists) {
        return { status: 'error', message: 'Products table does not exist' };
      }
      
      // Check data integrity
      const countResult = await client.query('SELECT COUNT(*) FROM products');
      const total = parseInt(countResult.rows[0].count);
      console.log(`  📦 Total products: ${total}`);
      
      // Check status consistency
      const statusCheck = await client.query(`
        SELECT status, COUNT(*) as count 
        FROM products 
        GROUP BY status
      `);
      
      console.log(`  📊 Status breakdown:`);
      let hasInvalidStatus = false;
      statusCheck.rows.forEach(row => {
        console.log(`    - ${row.status}: ${row.count}`);
        if (row.status !== 'pending') {
          hasInvalidStatus = true;
        }
      });
      
      if (hasInvalidStatus) {
        console.log(`  ⚠️  Found invalid status in pending database`);
        await this.fixPendingStatus(client);
      }
      
      return { 
        status: hasInvalidStatus ? 'warning' : 'healthy', 
        total, 
        statusBreakdown: statusCheck.rows 
      };
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      client.release();
    }
  }

  async checkMarketplaceDatabase() {
    console.log('\n🟢 CHECKING MARKETPLACE DATABASE:');
    console.log('---------------------------------');
    
    const client = await this.marketplacePool.connect();
    try {
      // Check table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'products'
        );
      `);
      
      const tableExists = tableCheck.rows[0].exists;
      console.log(`  📋 Table exists: ${tableExists ? '✅' : '❌'}`);
      
      if (!tableExists) {
        return { status: 'error', message: 'Products table does not exist' };
      }
      
      // Check data integrity
      const countResult = await client.query('SELECT COUNT(*) FROM products');
      const total = parseInt(countResult.rows[0].count);
      console.log(`  📦 Total products: ${total}`);
      
      // Check status consistency
      const statusCheck = await client.query(`
        SELECT status, COUNT(*) as count 
        FROM products 
        GROUP BY status
      `);
      
      console.log(`  📊 Status breakdown:`);
      let hasInvalidStatus = false;
      statusCheck.rows.forEach(row => {
        console.log(`    - ${row.status}: ${row.count}`);
        if (row.status !== 'approved') {
          hasInvalidStatus = true;
        }
      });
      
      if (hasInvalidStatus) {
        console.log(`  ⚠️  Found pending products in marketplace database`);
        await this.movePendingToCorrectDatabase(client);
      }
      
      return { 
        status: hasInvalidStatus ? 'warning' : 'healthy', 
        total, 
        statusBreakdown: statusCheck.rows 
      };
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      client.release();
    }
  }

  async checkDataConsistency() {
    console.log('\n🔄 CHECKING DATA CONSISTENCY:');
    console.log('------------------------------');
    
    try {
      // Get all products from both databases
      const pendingClient = await this.pendingPool.connect();
      const marketplaceClient = await this.marketplacePool.connect();
      
      try {
        const pendingResult = await pendingClient.query('SELECT id, title FROM products');
        const marketplaceResult = await marketplaceClient.query('SELECT id, title FROM products');
        
        const pendingIds = pendingResult.rows.map(r => r.id);
        const marketplaceIds = marketplaceResult.rows.map(r => r.id);
        
        // Check for duplicates
        const duplicates = pendingIds.filter(id => marketplaceIds.includes(id));
        
        if (duplicates.length > 0) {
          console.log(`  ⚠️  Found ${duplicates.length} duplicate products:`);
          duplicates.forEach(id => {
            const pendingProduct = pendingResult.rows.find(r => r.id === id);
            console.log(`    - ${id}: ${pendingProduct.title}`);
          });
          
          return { status: 'warning', duplicates };
        } else {
          console.log(`  ✅ No duplicates found`);
          return { status: 'healthy', duplicates: [] };
        }
      } finally {
        pendingClient.release();
        marketplaceClient.release();
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkWorkflowIntegrity() {
    console.log('\n🔄 CHECKING WORKFLOW INTEGRITY:');
    console.log('--------------------------------');
    
    // This would check if the workflow is working correctly
    // For now, just verify API endpoints are responding
    const endpoints = [
      '/api/pending-products',
      '/api/admin/pending-products', 
      '/api/marketplace-products'
    ];
    
    const results = [];
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        if (response.ok) {
          console.log(`  ✅ ${endpoint} - OK`);
          results.push({ endpoint, status: 'healthy' });
        } else {
          console.log(`  ❌ ${endpoint} - Status: ${response.status}`);
          results.push({ endpoint, status: 'error', code: response.status });
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
        results.push({ endpoint, status: 'error', message: error.message });
      }
    }
    
    const allHealthy = results.every(r => r.status === 'healthy');
    return { status: allHealthy ? 'healthy' : 'warning', endpoints: results };
  }

  async fixPendingStatus(client) {
    console.log(`  🔧 Fixing invalid status in pending database...`);
    
    await client.query('UPDATE products SET status = $1 WHERE status != $1', ['pending']);
    console.log(`  ✅ Fixed: All products in pending database now have 'pending' status`);
  }

  async movePendingToCorrectDatabase(client) {
    console.log(`  🔧 Moving pending products to correct database...`);
    
    // Get pending products from marketplace
    const pendingProducts = await client.query('SELECT * FROM products WHERE status = $1', ['pending']);
    
    if (pendingProducts.rows.length > 0) {
      const pendingClient = await this.pendingPool.connect();
      try {
        for (const row of pendingProducts.rows) {
          // Check if already exists in pending database
          const existingCheck = await pendingClient.query('SELECT id FROM products WHERE id = $1', [row.id]);
          
          if (existingCheck.rows.length === 0) {
            await pendingClient.query(`
              INSERT INTO products (
                id, title, price, category, description, featured, in_stock,
                rating, reviews, images, material, care, status, badges, seller_id,
                created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            `, [
              row.id, row.title, row.price, row.category, row.description,
              row.featured, row.in_stock, row.rating, row.reviews,
              row.images, row.material, row.care, 'pending',
              row.badges, row.seller_id, row.created_at, row.updated_at
            ]);
            
            console.log(`    ✅ Moved ${row.title} to pending database`);
          }
        }
      } finally {
        pendingClient.release();
      }
    }
  }

  generateReport(results) {
    console.log('\n📊 HEALTH CHECK REPORT');
    console.log('======================');
    console.log(`🕐 Timestamp: ${results.timestamp}`);
    console.log(`🔴 Pending DB: ${results.pending.status}`);
    console.log(`🟢 Marketplace DB: ${results.marketplace.status}`);
    console.log(`🔄 Consistency: ${results.consistency.status}`);
    console.log(`🌐 Workflow: ${results.workflow.status}`);
    
    const overallStatus = [
      results.pending.status,
      results.marketplace.status, 
      results.consistency.status,
      results.workflow.status
    ].every(s => s === 'healthy') ? 'HEALTHY' : 'NEEDS ATTENTION';
    
    console.log(`\n🎯 OVERALL STATUS: ${overallStatus}`);
    
    if (overallStatus !== 'HEALTHY') {
      console.log('\n⚠️  RECOMMENDATIONS:');
      console.log('- Review database configurations');
      console.log('- Check API endpoints');
      console.log('- Verify data integrity');
      console.log('- Run automated fixes');
    }
  }

  async cleanup() {
    await this.pendingPool.end();
    await this.marketplacePool.end();
  }
}

// Run the health check
async function runHealthCheck() {
  const monitor = new DatabaseHealthMonitor();
  try {
    await monitor.runFullHealthCheck();
  } finally {
    await monitor.cleanup();
  }
}

// Auto-run every 5 minutes in production
if (process.env.NODE_ENV === 'production') {
  setInterval(runHealthCheck, 5 * 60 * 1000);
}

// Export for manual use
module.exports = { DatabaseHealthMonitor, runHealthCheck };

// Run immediately if called directly
if (require.main === module) {
  runHealthCheck();
}
