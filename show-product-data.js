// Show how product data is stored
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
});

async function showProductData() {
  try {
    console.log('=== HOW PRODUCT DATA IS STORED ===');
    
    const client = await pool.connect();
    
    // Show one product example
    const result = await client.query('SELECT id, title, price, category, images, status FROM products LIMIT 1');
    
    if (result.rows.length > 0) {
      const product = result.rows[0];
      
      console.log('📋 Product Record in Database:');
      console.log(`ID: ${product.id}`);
      console.log(`Title: ${product.title}`);
      console.log(`Price: ${product.price}`);
      console.log(`Category: ${product.category}`);
      console.log(`Status: ${product.status}`);
      console.log(`Images (JSON): ${product.images}`);
      
      // Parse images
      const images = JSON.parse(product.images || '[]');
      console.log('\n🖼️ Image Paths:');
      images.forEach((image, index) => {
        console.log(`  ${index + 1}. ${image}`);
        console.log(`     File: ${image.split('/').pop()}`);
        console.log(`     Full path: c:\\Users\\My System\\Documents\\TRAE\\e-commerce-shopify\\public${image}`);
      });
      
      console.log('\n📁 File System Check:');
      const fs = require('fs');
      images.forEach((image, index) => {
        const fullPath = `c:\\Users\\My System\\Documents\\TRAE\\e-commerce-shopify\\public${image}`;
        const exists = fs.existsSync(fullPath);
        console.log(`  ${index + 1}. ${image.split('/').pop()} - ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
      });
    }
    
    client.release();
    
    console.log('\n🎯 SUMMARY:');
    console.log('✅ Image Files: public/uploads/products/');
    console.log('✅ Product Data: PostgreSQL database (commercedb)');
    console.log('✅ Persistence: True database (survive restarts)');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

showProductData();
