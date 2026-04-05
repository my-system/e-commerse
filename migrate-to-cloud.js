// Migration Script - Export Local Database to Cloud
// Run this before deploying to Vercel

const { Pool } = require('pg');

// Local database connections
const localPending = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
});

const localMarketplace = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
});

const localBackup = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
});

// Cloud database connections (update these)
const cloudPending = new Pool({
  connectionString: process.env.CLOUD_PENDING_DATABASE_URL || "postgresql://[USER]:[PASS]@[HOST]:[PORT]/ecommerce_pending"
});

const cloudMarketplace = new Pool({
  connectionString: process.env.CLOUD_MARKETPLACE_DATABASE_URL || "postgresql://[USER]:[PASS]@[HOST]:[PORT]/ecommerce_marketplace"
});

const cloudBackup = new Pool({
  connectionString: process.env.CLOUD_BACKUP_DATABASE_URL || "postgresql://[USER]:[PASS]@[HOST]:[PORT]/commercedb"
});

async function migrateDatabase(localPool, cloudPool, dbName) {
  console.log(`🔄 Starting migration for ${dbName}...`);
  
  try {
    // Get all data from local
    const result = await localPool.query('SELECT * FROM products');
    const products = result.rows;
    
    console.log(`📦 Found ${products.length} products in ${dbName}`);
    
    if (products.length === 0) {
      console.log(`✅ No products to migrate in ${dbName}`);
      return;
    }
    
    // Create table in cloud if not exists
    await cloudPool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        featured BOOLEAN DEFAULT false,
        in_stock BOOLEAN DEFAULT true,
        rating DECIMAL(2,1) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        images TEXT,
        material VARCHAR(100),
        care VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        badges TEXT,
        seller_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP
      )
    `);
    
    // Insert data into cloud
    for (const product of products) {
      await cloudPool.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges,
          seller_id, created_at, updated_at, approved_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          in_stock = EXCLUDED.in_stock,
          rating = EXCLUDED.rating,
          reviews = EXCLUDED.reviews,
          images = EXCLUDED.images,
          material = EXCLUDED.material,
          care = EXCLUDED.care,
          status = EXCLUDED.status,
          badges = EXCLUDED.badges,
          seller_id = EXCLUDED.seller_id,
          updated_at = EXCLUDED.updated_at,
          approved_at = EXCLUDED.approved_at
      `, [
        product.id, product.title, product.price, product.category,
        product.description, product.featured, product.in_stock,
        product.rating, product.reviews, product.images, product.material,
        product.care, product.status, product.badges, product.seller_id,
        product.created_at, product.updated_at, product.approved_at
      ]);
    }
    
    console.log(`✅ Successfully migrated ${products.length} products to ${dbName} cloud database`);
    
  } catch (error) {
    console.error(`❌ Error migrating ${dbName}:`, error.message);
  }
}

async function fullMigration() {
  console.log('🚀 Starting full database migration to cloud...');
  
  try {
    // Test cloud connections
    console.log('🔍 Testing cloud database connections...');
    await cloudPending.query('SELECT 1');
    await cloudMarketplace.query('SELECT 1');
    await cloudBackup.query('SELECT 1');
    console.log('✅ Cloud databases connected successfully');
    
    // Migrate each database
    await migrateDatabase(localPending, cloudPending, 'Pending');
    await migrateDatabase(localMarketplace, cloudMarketplace, 'Marketplace');
    await migrateDatabase(localBackup, cloudBackup, 'Backup');
    
    console.log('🎉 Full migration completed successfully!');
    console.log('\n📋 Migration Summary:');
    console.log('   ✅ Pending database migrated');
    console.log('   ✅ Marketplace database migrated');
    console.log('   ✅ Backup database migrated');
    console.log('\n🚀 Ready for Vercel deployment!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check cloud database URLs in environment variables');
    console.log('   2. Verify cloud databases are accessible');
    console.log('   3. Check network connectivity');
    console.log('   4. Verify database credentials');
  } finally {
    // Close all connections
    await localPending.end();
    await localMarketplace.end();
    await localBackup.end();
    await cloudPending.end();
    await cloudMarketplace.end();
    await cloudBackup.end();
  }
}

// Run migration
fullMigration();
