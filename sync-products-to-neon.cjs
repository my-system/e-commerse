const { Pool } = require('pg');
const { products } = require('./src/data/products.ts');

// Database configuration - read from database-env.txt
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from database-env.txt
let DATABASE_URL;
try {
  const envPath = path.join(__dirname, 'database-env.txt');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match) {
    DATABASE_URL = match[1];
    console.log('✅ DATABASE_URL found in database-env.txt');
  }
} catch (error) {
  console.error('❌ Error reading database-env.txt:', error.message);
}

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in database-env.txt');
  process.exit(1);
}

// Update environment variable
process.env.DATABASE_URL = DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    // Use SSL for Neon cloud database
    sslmode: 'require'
  }
});

async function syncProductsToNeon() {
  try {
    console.log('🔄 Memulai sinkronisasi produk ke Neon PostgreSQL...');
    console.log(`📊 Total produk dummy: ${products.length}`);
    
    await pool.connect();
    console.log('✅ Terhubung ke database Neon');
    
    // Cek apakah tabel products ada
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️ Tabel products tidak ditemukan, membuat tabel baru...');
      
      // Buat tabel products
      await pool.query(`
        CREATE TABLE products (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          featured BOOLEAN DEFAULT FALSE,
          instock BOOLEAN DEFAULT TRUE,
          rating DECIMAL(3,2) DEFAULT 0.0,
          reviews INTEGER DEFAULT 0,
          images TEXT,
          material VARCHAR(255),
          care VARCHAR(500),
          status VARCHAR(20) DEFAULT 'pending',
          sellerid VARCHAR(255),
          createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          approvedat TIMESTAMP,
          rejectedreason TEXT
        );
      `);
      
      console.log('✅ Tabel products berhasil dibuat');
    } else {
      console.log('✅ Tabel products sudah ada');
    }
    
    // Kosongkan tabel existing data (opsional - uncomment jika ingin reset)
    // await pool.query('DELETE FROM products');
    // console.log('🗑️ Tabel products dikosongkan');
    
    // Insert produk dummy dengan status 'approved' untuk marketplace
    let insertedCount = 0;
    for (const product of products) {
      try {
        // Convert images array to JSON string
        const imagesJson = JSON.stringify(product.images || []);
        
        await pool.query(`
          INSERT INTO products (
            id, title, price, category, description, featured, instock, 
            rating, reviews, images, material, care, status, sellerid,
            createdat, updatedat
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            price = EXCLUDED.price,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            featured = EXCLUDED.featured,
            instock = EXCLUDED.instock,
            rating = EXCLUDED.rating,
            reviews = EXCLUDED.reviews,
            images = EXCLUDED.images,
            material = EXCLUDED.material,
            care = EXCLUDED.care,
            status = EXCLUDED.status,
            updatedat = CURRENT_TIMESTAMP
        `, [
          product.id,
          product.title,
          product.price,
          product.category,
          product.description || null,
          product.featured || false,
          product.instock !== undefined ? product.instock : true,
          product.rating || 4.5,
          product.reviews || 0,
          imagesJson,
          product.material || null,
          product.care || null,
          'approved', // Set status ke 'approved' agar muncul di marketplace
          'system-seed', // sellerId
        ]);
        
        insertedCount++;
        console.log(`✅ ${insertedCount}. ${product.title} - Rp ${product.price.toLocaleString('id-ID')}`);
        
      } catch (error) {
        console.error(`❌ Gagal insert ${product.title}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Sinkronisasi selesai!`);
    console.log(`📊 Total produk berhasil disinkronkan: ${insertedCount}/${products.length}`);
    
    // Verifikasi data
    const verifyResult = await pool.query('SELECT COUNT(*) as total FROM products WHERE status = $1', ['approved']);
    const approvedCount = parseInt(verifyResult.rows[0].total);
    
    console.log(`✅ Verifikasi: ${approvedCount} produk dengan status 'approved' di database`);
    
    // Tampilkan 5 produk pertama yang berhasil disinkronkan
    const sampleProducts = await pool.query(`
      SELECT id, title, price, category, status, featured, instock 
      FROM products 
      WHERE status = 'approved' 
      ORDER BY createdat DESC 
      LIMIT 5
    `);
    
    console.log('\n📋 Contoh produk di database Neon:');
    sampleProducts.rows.forEach((product, index) => {
      const featured = product.featured ? '⭐' : '';
      const stock = product.instock ? '✅' : '❌';
      console.log(`${index + 1}. ${featured} ${product.title} - Rp ${Number(product.price).toLocaleString('id-ID')} ${stock}`);
    });
    
  } catch (error) {
    console.error('❌ Error sinkronisasi:', error.message);
  } finally {
    await pool.end();
    console.log('🔌 Koneksi database ditutup');
  }
}

syncProductsToNeon();
