// COMPREHENSIVE SYSTEM VERIFICATION
// Step by step verification of marketplace-admin synchronization

const { Pool } = require('pg');

async function verifySystemSynchronization() {
  console.log('🔍 COMPREHENSIVE SYSTEM VERIFICATION');
  console.log('====================================\n');
  
  // Database connections
  const pendingPool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
  });
  
  const marketplacePool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
  });
  
  try {
    console.log('📊 STEP 1: DATABASE INVENTORY');
    console.log('============================\n');
    
    // Check pending database
    const pendingClient = await pendingPool.connect();
    const pendingResult = await pendingClient.query('SELECT id, title, status, seller_id, created_at FROM products ORDER BY created_at DESC');
    
    console.log('🗄️ PENDING DATABASE:');
    console.log(`   Total products: ${pendingResult.rows.length}`);
    pendingResult.rows.forEach((row, i) => {
      console.log(`   ${i+1}. ${row.title} (${row.id})`);
      console.log(`      Status: ${row.status}`);
      console.log(`      Seller: ${row.seller_id}`);
      console.log(`      Created: ${row.created_at}`);
      console.log('');
    });
    
    // Check marketplace database
    const marketplaceClient = await marketplacePool.connect();
    const marketplaceResult = await marketplaceClient.query('SELECT id, title, status, seller_id, created_at, approved_at FROM products ORDER BY created_at DESC');
    
    console.log('🛒 MARKETPLACE DATABASE:');
    console.log(`   Total products: ${marketplaceResult.rows.length}`);
    marketplaceResult.rows.forEach((row, i) => {
      console.log(`   ${i+1}. ${row.title} (${row.id})`);
      console.log(`      Status: ${row.status}`);
      console.log(`      Seller: ${row.seller_id}`);
      console.log(`      Created: ${row.created_at}`);
      console.log(`      Approved: ${row.approved_at || 'N/A'}`);
      console.log('');
    });
    
    console.log('🔍 STEP 2: SYNCHRONIZATION ANALYSIS');
    console.log('=================================\n');
    
    // Find duplicates
    const pendingIds = new Set(pendingResult.rows.map(r => r.id));
    const marketplaceIds = new Set(marketplaceResult.rows.map(r => r.id));
    const duplicates = [...pendingIds].filter(id => marketplaceIds.has(id));
    
    console.log('📋 DUPLICATE ANALYSIS:');
    console.log(`   Products in both databases: ${duplicates.length}`);
    if (duplicates.length > 0) {
      duplicates.forEach(id => {
        const pendingProduct = pendingResult.rows.find(r => r.id === id);
        const marketplaceProduct = marketplaceResult.rows.find(r => r.id === id);
        console.log(`   ⚠️  ${pendingProduct.title}`);
        console.log(`      Pending status: ${pendingProduct.status}`);
        console.log(`      Marketplace status: ${marketplaceProduct.status}`);
      });
    }
    
    // Find products that should be in pending but are in marketplace
    const shouldNotBeInMarketplace = marketplaceResult.rows.filter(
      product => product.status !== 'approved'
    );
    
    console.log('\n📋 MARKETPLACE VIOLATIONS:');
    console.log(`   Non-approved products in marketplace: ${shouldNotBeInMarketplace.length}`);
    shouldNotBeInMarketplace.forEach(product => {
      console.log(`   ❌ ${product.title} - Status: ${product.status}`);
    });
    
    // Find approved products that should be in marketplace but aren't
    const approvedInPending = pendingResult.rows.filter(p => p.status === 'approved');
    const missingFromMarketplace = approvedInPending.filter(
      pending => !marketplaceResult.rows.find(m => m.id === pending.id)
    );
    
    console.log('\n📋 MISSING FROM MARKETPLACE:');
    console.log(`   Approved products not in marketplace: ${missingFromMarketplace.length}`);
    missingFromMarketplace.forEach(product => {
      console.log(`   ⚠️  ${product.title} - Status: ${product.status}`);
    });
    
    console.log('\n🔍 STEP 3: API ENDPOINT VERIFICATION');
    console.log('=================================\n');
    
    // Test admin API
    console.log('📡 Testing /api/admin/pending-products...');
    try {
      const http = require('http');
      const adminResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/pending-products',
          method: 'GET'
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ error: 'Invalid JSON', raw: data });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
      
      console.log(`   Status: ${adminResponse.success ? '✅ Working' : '❌ Failed'}`);
      console.log(`   Products returned: ${adminResponse.products?.length || 0}`);
      
      if (adminResponse.products) {
        console.log('   Products from API:');
        adminResponse.products.forEach((p, i) => {
          console.log(`     ${i+1}. ${p.title} - ${p.status}`);
        });
      }
      
    } catch (error) {
      console.log(`   ❌ API Error: ${error.message}`);
    }
    
    // Test marketplace API
    console.log('\n📡 Testing /api/marketplace-products...');
    try {
      const http = require('http');
      const marketplaceAPIResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/marketplace-products',
          method: 'GET'
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ error: 'Invalid JSON', raw: data });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
      
      console.log(`   Status: ${marketplaceAPIResponse.success ? '✅ Working' : '❌ Failed'}`);
      console.log(`   Products returned: ${marketplaceAPIResponse.products?.length || 0}`);
      
      if (marketplaceAPIResponse.products) {
        console.log('   Products from API:');
        marketplaceAPIResponse.products.forEach((p, i) => {
          console.log(`     ${i+1}. ${p.title} - ${p.status}`);
        });
      }
      
    } catch (error) {
      console.log(`   ❌ API Error: ${error.message}`);
    }
    
    console.log('\n🔍 STEP 4: WORKFLOW VERIFICATION');
    console.log('==============================\n');
    
    // Check seller add product workflow
    console.log('🛍️  SELLER ADD PRODUCT WORKFLOW:');
    console.log('   Expected: Seller → Pending → Admin Review → Marketplace');
    console.log('   Current: ???');
    
    // Look for recently added products
    const recentProducts = pendingResult.rows.filter(
      p => new Date(p.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    console.log(`   Products added in last 24h: ${recentProducts.length}`);
    recentProducts.forEach(p => {
      console.log(`   📦 ${p.title} - ${p.status} (${p.created_at})`);
      
      // Check if this product is also in marketplace
      const inMarketplace = marketplaceResult.rows.find(m => m.id === p.id);
      if (inMarketplace) {
        console.log(`      ⚠️  Also in marketplace! Status: ${inMarketplace.status}`);
        console.log(`      ⚠️  This indicates workflow bypass!`);
      } else {
        console.log(`      ✅ Correctly in pending only`);
      }
    });
    
    console.log('\n🎯 STEP 5: ROOT CAUSE ANALYSIS');
    console.log('============================\n');
    
    // Identify issues
    const issues = [];
    
    if (duplicates.length > 0) {
      issues.push('❌ Duplicate products across databases');
    }
    
    if (shouldNotBeInMarketplace.length > 0) {
      issues.push('❌ Non-approved products in marketplace');
    }
    
    if (missingFromMarketplace.length > 0) {
      issues.push('⚠️  Approved products missing from marketplace');
    }
    
    if (recentProducts.some(p => marketplaceResult.rows.find(m => m.id === p.id))) {
      issues.push('❌ Seller products bypassing admin approval');
    }
    
    console.log('🚨 ISSUES FOUND:');
    if (issues.length === 0) {
      console.log('   ✅ No synchronization issues detected');
    } else {
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log('\n🎯 STEP 6: RECOMMENDATIONS');
    console.log('========================\n');
    
    if (issues.length > 0) {
      console.log('🔧 RECOMMENDED FIXES:');
      console.log('   1. Clean up duplicate products');
      console.log('   2. Remove non-approved products from marketplace');
      console.log('   3. Fix seller add product workflow');
      console.log('   4. Ensure proper API filtering');
      console.log('   5. Implement proper status transitions');
    } else {
      console.log('✅ System appears to be synchronized correctly');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
  }
}

verifySystemSynchronization();
