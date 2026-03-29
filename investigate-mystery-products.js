// Investigate mystery products
const { Pool } = require('pg');

async function investigateMysteryProducts() {
  try {
    console.log('=== INVESTIGATING MYSTERY PRODUCTS ===');
    
    // Check all databases
    const databases = [
      { name: 'ecommerce_pending', url: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending" },
      { name: 'ecommerce_marketplace', url: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace" },
      { name: 'commercedb', url: "postgresql://postgres:postgres@localhost:5432/commercedb" }
    ];
    
    for (const db of databases) {
      console.log(`\n📊 Checking ${db.name}...`);
      
      try {
        const pool = new Pool({ connectionString: db.url });
        const client = await pool.connect();
        
        const result = await client.query(`
          SELECT id, title, seller_id, status, created_at, updated_at 
          FROM products 
          ORDER BY created_at DESC
        `);
        
        console.log(`  Products in ${db.name}: ${result.rows.length}`);
        
        result.rows.forEach((product, index) => {
          console.log(`    ${index + 1}. ID: ${product.id}`);
          console.log(`       Title: ${product.title}`);
          console.log(`       Seller: ${product.seller_id}`);
          console.log(`       Status: ${product.status}`);
          console.log(`       Created: ${product.created_at}`);
          console.log(`       Updated: ${product.updated_at}`);
          console.log('');
        });
        
        client.release();
        await pool.end();
        
      } catch (error) {
        console.log(`  ❌ Error checking ${db.name}: ${error.message}`);
      }
    }
    
    // Check API response
    console.log('\n=== CHECKING API RESPONSE ===');
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pending-products',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`API Status: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log(`API Success: ${response.success}`);
          console.log(`API Products Count: ${response.products ? response.products.length : 0}`);
          
          if (response.products && response.products.length > 0) {
            console.log('\nAPI Products:');
            response.products.forEach((product, index) => {
              console.log(`  ${index + 1}. ${product.title} (${product.status}) - Seller: ${product.sellerId}`);
              console.log(`     ID: ${product.id}`);
              console.log(`     Created: ${product.createdAt}`);
              console.log('');
            });
          }
        } catch (e) {
          console.log('API Response Error:', e.message);
          console.log('Raw Response:', data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ API Error:', error.message);
    });
    
    req.end();
    
  } catch (error) {
    console.error('❌ Investigation failed:', error);
  }
}

investigateMysteryProducts();
