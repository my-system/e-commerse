const { Pool } = require('pg');

// Move products from marketplace to pending database
const marketplacePool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace",
  ssl: false
});

const pendingPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
  ssl: false
});

async function moveProductsToPending() {
  try {
    console.log('🔄 MOVING PENDING PRODUCTS FROM MARKETPLACE TO PENDING DATABASE');
    console.log('================================================================\n');
    
    // 1. Get pending products from marketplace database
    const marketplaceClient = await marketplacePool.connect();
    try {
      const result = await marketplaceClient.query(`
        SELECT * FROM products 
        WHERE status = 'pending' 
        ORDER BY created_at DESC
      `);
      
      console.log(`📦 Found ${result.rows.length} pending products in marketplace database:`);
      
      if (result.rows.length === 0) {
        console.log('❌ No pending products found in marketplace database');
        return;
      }
      
      // 2. Insert these products into pending database
      const pendingClient = await pendingPool.connect();
      try {
        for (const row of result.rows) {
          console.log(`\n🔄 Moving product: ${row.title}`);
          console.log(`   🆔 ID: ${row.id}`);
          console.log(`   💰 Price: Rp ${parseFloat(row.price).toLocaleString('id-ID')}`);
          console.log(`   📊 Status: ${row.status}`);
          
          // Check if product already exists in pending database
          const existingCheck = await pendingClient.query(
            'SELECT id FROM products WHERE id = $1',
            [row.id]
          );
          
          if (existingCheck.rows.length > 0) {
            console.log(`   ⚠️  Product already exists in pending database, skipping...`);
            continue;
          }
          
          // Insert into pending database
          await pendingClient.query(`
            INSERT INTO products (
              id, title, price, category, description, featured, in_stock,
              rating, reviews, images, material, care, status, badges, seller_id,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          `, [
            row.id, row.title, row.price, row.category, row.description,
            row.featured, row.in_stock, row.rating, row.reviews,
            row.images, row.material, row.care, 'pending', // Set status to pending
            row.badges, row.seller_id, row.created_at, row.updated_at
          ]);
          
          console.log(`   ✅ Successfully moved to pending database`);
          
          // Optional: Remove from marketplace database after moving
          // await marketplaceClient.query('DELETE FROM products WHERE id = $1', [row.id]);
          // console.log(`   🗑️  Removed from marketplace database`);
        }
        
        console.log('\n✅ All pending products moved successfully!');
        
      } finally {
        pendingClient.release();
      }
      
    } finally {
      marketplaceClient.release();
    }
    
    // 3. Verify the results
    console.log('\n🔍 VERIFICATION:');
    console.log('================');
    
    const pendingClient = await pendingPool.connect();
    try {
      const pendingResult = await pendingClient.query(`
        SELECT id, title, price, status, created_at 
        FROM products 
        ORDER BY created_at DESC
      `);
      
      console.log(`📋 Pending database now has ${pendingResult.rows.length} products:`);
      pendingResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.title} (${row.status}) - Rp ${parseFloat(row.price).toLocaleString('id-ID')}`);
      });
      
    } finally {
      pendingClient.release();
    }
    
  } catch (error) {
    console.error('❌ Error moving products:', error.message);
  } finally {
    await marketplacePool.end();
    await pendingPool.end();
  }
}

moveProductsToPending();
