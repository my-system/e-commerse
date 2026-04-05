const { Pool } = require('pg');

// Check both databases
const pendingPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
  ssl: false
});

const marketplacePool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace",
  ssl: false
});

async function checkAllProducts() {
  try {
    console.log('🔍 CHECKING ALL PRODUCTS IN BOTH DATABASES');
    console.log('==========================================\n');
    
    // Check PENDING database
    console.log('🔴 PENDING DATABASE (Menunggu Approval):');
    console.log('------------------------------------------');
    
    const pendingClient = await pendingPool.connect();
    try {
      const pendingResult = await pendingClient.query(`
        SELECT id, title, price, category, status, created_at 
        FROM products 
        ORDER BY created_at DESC
      `);
      
      if (pendingResult.rows.length === 0) {
        console.log('  ❌ Tidak ada produk di pending database');
      } else {
        console.log(`  📦 Total: ${pendingResult.rows.length} produk`);
        pendingResult.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.id}`);
          console.log(`     📝 Title: ${row.title}`);
          console.log(`     💰 Price: Rp ${parseFloat(row.price).toLocaleString('id-ID')}`);
          console.log(`     📂 Category: ${row.category}`);
          console.log(`     📊 Status: ${row.status}`);
          console.log(`     📅 Created: ${new Date(row.created_at).toLocaleString('id-ID')}`);
          console.log('');
        });
      }
    } finally {
      pendingClient.release();
    }
    
    console.log('\n🟢 MARKETPLACE DATABASE (Sudah Di-approve):');
    console.log('-------------------------------------------');
    
    const marketplaceClient = await marketplacePool.connect();
    try {
      const marketplaceResult = await marketplaceClient.query(`
        SELECT id, title, price, category, status, created_at 
        FROM products 
        ORDER BY created_at DESC
      `);
      
      if (marketplaceResult.rows.length === 0) {
        console.log('  ❌ Tidak ada produk di marketplace database');
      } else {
        console.log(`  📦 Total: ${marketplaceResult.rows.length} produk`);
        marketplaceResult.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.id}`);
          console.log(`     📝 Title: ${row.title}`);
          console.log(`     💰 Price: Rp ${parseFloat(row.price).toLocaleString('id-ID')}`);
          console.log(`     📂 Category: ${row.category}`);
          console.log(`     📊 Status: ${row.status}`);
          console.log(`     📅 Created: ${new Date(row.created_at).toLocaleString('id-ID')}`);
          console.log('');
        });
      }
    } finally {
      marketplaceClient.release();
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('-----------');
    
    // Get counts properly
    let pendingCount = 0;
    let marketplaceCount = 0;
    let pendingTitles = [];
    let marketplaceTitles = [];
    
    try {
      const pendingClient = await pendingPool.connect();
      const pendingResult = await pendingClient.query('SELECT title FROM products');
      pendingCount = pendingResult.rows.length;
      pendingTitles = pendingResult.rows.map(row => row.title.toLowerCase());
      pendingClient.release();
    } catch (error) {
      console.log('Error getting pending count:', error.message);
    }
    
    try {
      const marketplaceClient = await marketplacePool.connect();
      const marketplaceResult = await marketplaceClient.query('SELECT title FROM products');
      marketplaceCount = marketplaceResult.rows.length;
      marketplaceTitles = marketplaceResult.rows.map(row => row.title.toLowerCase());
      marketplaceClient.release();
    } catch (error) {
      console.log('Error getting marketplace count:', error.message);
    }
    
    console.log(`🔴 Pending Products: ${pendingCount}`);
    console.log(`🟢 Approved Products: ${marketplaceCount}`);
    console.log(`📈 Total Products: ${pendingCount + marketplaceCount}`);
    
    // Check for duplicates (same title in both databases)
    const duplicates = pendingTitles.filter(title => marketplaceTitles.includes(title));
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  DUPLICATE PRODUCTS FOUND:');
      console.log('----------------------------');
      duplicates.forEach(title => {
        console.log(`  🔄 "${title}" ada di kedua database`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking products:', error.message);
  } finally {
    await pendingPool.end();
    await marketplacePool.end();
  }
}

checkAllProducts();
