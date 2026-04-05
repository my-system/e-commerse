const { Pool } = require('pg');

// Check all three databases
const databases = [
  { name: 'PENDING', url: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending" },
  { name: 'MARKETPLACE', url: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace" },
  { name: 'BACKUP', url: "postgresql://postgres:postgres@localhost:5432/commercedb" }
];

async function checkAllDatabases() {
  console.log('🔍 CHECKING ALL THREE DATABASES');
  console.log('================================\n');
  
  for (const db of databases) {
    console.log(`🗄️  ${db.name} DATABASE:`);
    console.log('------------------------');
    
    const pool = new Pool({
      connectionString: db.url,
      ssl: false
    });
    
    try {
      const client = await pool.connect();
      
      // Check if products table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'products'
        );
      `);
      
      const tableExists = tableCheck.rows[0].exists;
      console.log(`  📋 Products table exists: ${tableExists ? '✅' : '❌'}`);
      
      if (tableExists) {
        // Get all products
        const productsResult = await client.query(`
          SELECT id, title, price, category, status, created_at 
          FROM products 
          ORDER BY created_at DESC
        `);
        
        console.log(`  📦 Total products: ${productsResult.rows.length}`);
        
        if (productsResult.rows.length > 0) {
          productsResult.rows.forEach((row, index) => {
            console.log(`  ${index + 1}. ${row.id}`);
            console.log(`     📝 Title: "${row.title}"`);
            console.log(`     💰 Price: Rp ${parseFloat(row.price).toLocaleString('id-ID')}`);
            console.log(`     📂 Category: ${row.category || 'N/A'}`);
            console.log(`     📊 Status: ${row.status || 'N/A'}`);
            console.log(`     📅 Created: ${new Date(row.created_at).toLocaleString('id-ID')}`);
            console.log('');
          });
        } else {
          console.log('  ❌ No products found');
        }
      } else {
        console.log('  ❌ Products table does not exist');
      }
      
      client.release();
      
    } catch (error) {
      console.error(`  ❌ Error connecting to ${db.name} database:`, error.message);
    } finally {
      await pool.end();
    }
    
    console.log('\n');
  }
  
  // Check if there are any products in localStorage (for development)
  console.log('💾 LOCALSTORAGE CHECK (Development):');
  console.log('----------------------------------');
  console.log('  📝 Run this in browser console to check:');
  console.log('  console.log("Local products:", JSON.parse(localStorage.getItem("sellerProducts") || "[]"));');
}

checkAllDatabases();
