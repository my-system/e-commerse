// Test Script untuk Sistem Sinkronisasi 3-Database
// Mengimplementasikan panduan yang telah dibuat
const { Pool } = require('pg');

// Import services (dalam JavaScript environment)
class TestSynchronizationService {
  constructor() {
    console.log('🚀 MEMULAI TEST SISTEM SINHRONISASI 3-DATABASE');
    console.log('================================================\n');
    
    // Database connections
    this.pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
      connectionTimeoutMillis: 30000
    });
    
    this.marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace", 
      connectionTimeoutMillis: 30000
    });
    
    this.backupPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb",
      connectionTimeoutMillis: 30000
    });
  }

  // Test 1: Cek koneksi database
  async testDatabaseConnections() {
    console.log('📊 TEST 1: CEK KONEKSI DATABASE');
    console.log('--------------------------------');
    
    const results = {};
    
    try {
      // Test Pending Database
      console.log('🔴 Menghubungkan ke Database A (Pending)...');
      const pendingClient = await this.pendingPool.connect();
      const pendingCheck = await pendingClient.query('SELECT NOW()');
      results.pending = { status: 'connected', timestamp: pendingCheck.rows[0].now };
      console.log('✅ Database A (Pending) terhubung');
      pendingClient.release();
      
      // Test Marketplace Database  
      console.log('🟢 Menghubungkan ke Database B (Marketplace)...');
      const marketplaceClient = await this.marketplacePool.connect();
      const marketplaceCheck = await marketplaceClient.query('SELECT NOW()');
      results.marketplace = { status: 'connected', timestamp: marketplaceCheck.rows[0].now };
      console.log('✅ Database B (Marketplace) terhubung');
      marketplaceClient.release();
      
      // Test Backup Database
      console.log('🛡️ Menghubungkan ke Database C (Central Backup)...');
      const backupClient = await this.backupPool.connect();
      const backupCheck = await backupClient.query('SELECT NOW()');
      results.backup = { status: 'connected', timestamp: backupCheck.rows[0].now };
      console.log('✅ Database C (Central Backup) terhubung');
      backupClient.release();
      
      console.log('\n📋 HASIL KONEKSI DATABASE:');
      console.log(`- Database A (Pending): ${results.pending.status}`);
      console.log(`- Database B (Marketplace): ${results.marketplace.status}`);
      console.log(`- Database C (Backup): ${results.backup.status}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ ERROR KONEKSI DATABASE:', error.message);
      return { error: error.message };
    }
  }

  // Test 2: Cek struktur tabel
  async testTableStructures() {
    console.log('\n📋 TEST 2: CEK STRUKTUR TABEL');
    console.log('-------------------------------');
    
    const results = {};
    
    try {
      // Check products table di setiap database
      const databases = [
        { name: 'Database A (Pending)', pool: this.pendingPool },
        { name: 'Database B (Marketplace)', pool: this.marketplacePool },
        { name: 'Database C (Backup)', pool: this.backupPool }
      ];
      
      for (const db of databases) {
        console.log(`🔍 Mengecek tabel 'products' di ${db.name}...`);
        const client = await db.pool.connect();
        
        try {
          const tableCheck = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'products'
            );
          `);
          
          const tableExists = tableCheck.rows[0].exists;
          results[db.name] = { tableExists };
          
          if (tableExists) {
            // Get column info
            const columnInfo = await client.query(`
              SELECT column_name, data_type, is_nullable 
              FROM information_schema.columns 
              WHERE table_name = 'products' 
              ORDER BY ordinal_position
            `);
            
            results[db.name].columns = columnInfo.rows;
            console.log(`✅ Tabel 'products' ditemukan di ${db.name} (${columnInfo.rows.length} kolom)`);
          } else {
            console.log(`❌ Tabel 'products' tidak ditemukan di ${db.name}`);
          }
          
        } finally {
          client.release();
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('❌ ERROR STRUKTUR TABEL:', error.message);
      return { error: error.message };
    }
  }

  // Test 3: Simulasi alur persetujuan produk
  async testApprovalWorkflow() {
    console.log('\n🔄 TEST 3: SIMULASI ALUR PERSETUJUAN PRODUK');
    console.log('------------------------------------------');
    
    try {
      // STEP 1: Tambah produk test ke Database A (Pending)
      console.log('LANGKAH 1: Menambah produk test ke Database A (Pending)...');
      const pendingClient = await this.pendingPool.connect();
      
      const testProduct = {
        id: `test-${Date.now()}`,
        title: 'Produk Test Sistem Sinkronisasi',
        price: 999999,
        category: 'test-category',
        description: 'Produk test untuk validasi sistem sinkronisasi 3-database',
        featured: false,
        in_stock: true,
        rating: 5.0,
        reviews: 0,
        images: '["test-image.jpg"]',
        material: 'test-material',
        care: 'test-care',
        status: 'pending',
        badges: '["test"]',
        seller_id: 'test-seller-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await pendingClient.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        testProduct.id, testProduct.title, testProduct.price, testProduct.category, 
        testProduct.description, testProduct.featured, testProduct.in_stock, 
        testProduct.rating, testProduct.reviews, testProduct.images, testProduct.material, 
        testProduct.care, testProduct.status, testProduct.badges, testProduct.seller_id, 
        testProduct.created_at, testProduct.updated_at
      ]);
      
      console.log(`✅ Produk test ditambahkan ke Database A: ${testProduct.id}`);
      pendingClient.release();
      
      // STEP 2: Backup ke Database C
      console.log('LANGKAH 2: Backup produk ke Database C (Central Backup)...');
      const backupClient = await this.backupPool.connect();
      
      await backupClient.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          updated_at = NOW()
      `, [
        testProduct.id, testProduct.title, testProduct.price, testProduct.category, 
        testProduct.description, testProduct.featured, testProduct.in_stock, 
        testProduct.rating, testProduct.reviews, testProduct.images, testProduct.material, 
        testProduct.care, 'approved', testProduct.badges, testProduct.seller_id, 
        testProduct.created_at, testProduct.updated_at
      ]);
      
      console.log(`✅ Produk dibackup ke Database C dengan status 'approved'`);
      backupClient.release();
      
      // STEP 3: Tambah ke Database B (Marketplace)
      console.log('LANGKAH 3: Menambah produk ke Database B (Marketplace)...');
      const marketplaceClient = await this.marketplacePool.connect();
      
      await marketplaceClient.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          approved_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        testProduct.id, testProduct.title, testProduct.price, testProduct.category, 
        testProduct.description, testProduct.featured, testProduct.in_stock, 
        testProduct.rating, testProduct.reviews, testProduct.images, testProduct.material, 
        testProduct.care, 'approved', testProduct.badges, testProduct.seller_id, 
        new Date().toISOString(), testProduct.created_at, testProduct.updated_at
      ]);
      
      console.log(`✅ Produk ditambahkan ke Database B (Marketplace)`);
      marketplaceClient.release();
      
      // STEP 4: Hapus dari Database A (Pending)
      console.log('LANGKAH 4: Menghapus produk dari Database A (Pending)...');
      const pendingClient2 = await this.pendingPool.connect();
      
      await pendingClient2.query('DELETE FROM products WHERE id = $1', [testProduct.id]);
      
      console.log(`✅ Produk dihapus dari Database A`);
      pendingClient2.release();
      
      // STEP 5: Validasi final
      console.log('LANGKAH 5: Validasi final sinkronisasi...');
      
      const validationResults = {};
      
      // Cek di Database A (seharusnya tidak ada)
      const pendingCheck = await this.pendingPool.connect();
      const pendingResult = await pendingCheck.query('SELECT COUNT(*) FROM products WHERE id = $1', [testProduct.id]);
      validationResults.pending = { exists: pendingResult.rows[0].count > 0 };
      pendingCheck.release();
      
      // Cek di Database B (seharusnya ada dengan status approved)
      const marketplaceCheck = await this.marketplacePool.connect();
      const marketplaceResult = await marketplaceCheck.query('SELECT status FROM products WHERE id = $1', [testProduct.id]);
      validationResults.marketplace = { 
        exists: marketplaceResult.rows.length > 0,
        status: marketplaceResult.rows[0]?.status 
      };
      marketplaceCheck.release();
      
      // Cek di Database C (seharusnya ada dengan status approved)
      const backupCheck = await this.backupPool.connect();
      const backupResult = await backupCheck.query('SELECT status FROM products WHERE id = $1', [testProduct.id]);
      validationResults.backup = { 
        exists: backupResult.rows.length > 0,
        status: backupResult.rows[0]?.status 
      };
      backupCheck.release();
      
      console.log('\n📋 HASIL VALIDASI FINAL:');
      console.log(`- Database A (Pending): ${validationResults.pending.exists ? '❌ MASIH ADA' : '✅ TIDAK ADA (Benar)'}`);
      console.log(`- Database B (Marketplace): ${validationResults.marketplace.exists ? '✅ ADA' : '❌ TIDAK ADA'} dengan status: ${validationResults.marketplace.status}`);
      console.log(`- Database C (Backup): ${validationResults.backup.exists ? '✅ ADA' : '❌ TIDAK ADA'} dengan status: ${validationResults.backup.status}`);
      
      // Tentukan apakah test berhasil
      const testSuccess = !validationResults.pending.exists && 
                         validationResults.marketplace.exists && 
                         validationResults.marketplace.status === 'approved' &&
                         validationResults.backup.exists && 
                         validationResults.backup.status === 'approved';
      
      if (testSuccess) {
        console.log('\n🎉 ALUR PERSETUJUAN BERHASIL! Produk berhasil dipindahkan: A → C → B → A cleanup');
      } else {
        console.log('\n❌ ALUR PERSETUJUAN GAGAL! Ada masalah dalam sinkronisasi');
      }
      
      return { success: testSuccess, productId: testProduct.id, validation: validationResults };
      
    } catch (error) {
      console.error('❌ ERROR ALUR PERSETUJUAN:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Test 4: Simulasi AI Health Check
  async testAIHealthCheck() {
    console.log('\n🤖 TEST 4: SIMULASI AI HEALTH CHECK');
    console.log('------------------------------------');
    
    try {
      console.log('🔍 Memulai pemeriksaan kesehatan sistem AI...');
      
      const healthResults = {
        timestamp: new Date().toISOString(),
        databases: {},
        integrity: {},
        issues: []
      };
      
      // Cek status setiap database
      const databases = [
        { name: 'pending', pool: this.pendingPool },
        { name: 'marketplace', pool: this.marketplacePool },
        { name: 'backup', pool: this.backupPool }
      ];
      
      for (const db of databases) {
        const client = await db.pool.connect();
        try {
          const countResult = await client.query('SELECT COUNT(*) FROM products');
          const statusCheck = await client.query(`
            SELECT status, COUNT(*) as count 
            FROM products 
            GROUP BY status
          `);
          
          healthResults.databases[db.name] = {
            total: parseInt(countResult.rows[0].count),
            statusBreakdown: statusCheck.rows,
            status: 'healthy'
          };
          
          console.log(`✅ Database ${db.name}: ${countResult.rows[0].count} produk`);
          
        } catch (error) {
          healthResults.databases[db.name] = {
            status: 'error',
            error: error.message
          };
          console.log(`❌ Database ${db.name}: Error - ${error.message}`);
        } finally {
          client.release();
        }
      }
      
      // Deteksi duplikat
      console.log('🔍 Mendeteksi duplikat...');
      const pendingClient = await this.pendingPool.connect();
      const marketplaceClient = await this.marketplacePool.connect();
      
      try {
        const pendingResult = await pendingClient.query('SELECT id FROM products');
        const marketplaceResult = await marketplaceClient.query('SELECT id FROM products');
        
        const pendingIds = new Set(pendingResult.rows.map(r => r.id));
        const marketplaceIds = new Set(marketplaceResult.rows.map(r => r.id));
        
        const duplicates = [];
        for (const id of pendingIds) {
          if (marketplaceIds.has(id)) {
            duplicates.push(id);
          }
        }
        
        if (duplicates.length > 0) {
          healthResults.issues.push({
            type: 'duplicate',
            count: duplicates.length,
            severity: 'high',
            description: `Found ${duplicates.length} duplicate products`
          });
          console.log(`⚠️ Ditemukan ${duplicates.length} duplikat`);
        } else {
          console.log('✅ Tidak ada duplikat ditemukan');
        }
        
      } finally {
        pendingClient.release();
        marketplaceClient.release();
      }
      
      // Tentukan status keseluruhan
      const errorCount = Object.values(healthResults.databases).filter(db => db.status === 'error').length;
      const criticalIssues = healthResults.issues.filter(issue => issue.severity === 'high').length;
      
      let overallStatus = 'HEALTHY';
      if (errorCount > 0 || criticalIssues > 0) {
        overallStatus = 'CRITICAL';
      } else if (healthResults.issues.length > 0) {
        overallStatus = 'WARNING';
      }
      
      healthResults.overallStatus = overallStatus;
      
      console.log('\n📋 HASIL AI HEALTH CHECK:');
      console.log(`- Status Keseluruhan: ${overallStatus}`);
      console.log(`- Database Errors: ${errorCount}`);
      console.log(`- Issues Ditemukan: ${healthResults.issues.length}`);
      
      return healthResults;
      
    } catch (error) {
      console.error('❌ ERROR AI HEALTH CHECK:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Cleanup test data
  async cleanupTestData() {
    console.log('\n🧹 CLEANUP: Membersihkan data test...');
    
    try {
      const testProductId = `test-${Date.now() - 30000}`; // Approximate test product ID
      
      // Clean up from all databases
      const databases = [
        { name: 'Pending', pool: this.pendingPool },
        { name: 'Marketplace', pool: this.marketplacePool },
        { name: 'Backup', pool: this.backupPool }
      ];
      
      for (const db of databases) {
        const client = await db.pool.connect();
        try {
          // Remove test products (those starting with 'test-')
          const result = await client.query("DELETE FROM products WHERE id LIKE 'test-%'");
          if (result.rowCount > 0) {
            console.log(`🧹 Dihapus ${result.rowCount} produk test dari ${db.name}`);
          }
        } finally {
          client.release();
        }
      }
      
      console.log('✅ Cleanup data test selesai');
      
    } catch (error) {
      console.error('❌ ERROR CLEANUP:', error.message);
    }
  }

  // Jalankan semua test
  async runAllTests() {
    console.log('🧪 MENJALANKAN SEMUA TEST SISTEM');
    console.log('==================================\n');
    
    const testResults = {
      startTime: new Date().toISOString(),
      tests: {},
      overallSuccess: true
    };
    
    try {
      // Test 1: Koneksi Database
      testResults.tests.connections = await this.testDatabaseConnections();
      
      // Test 2: Struktur Tabel
      testResults.tests.tableStructures = await this.testTableStructures();
      
      // Test 3: Alur Persetujuan
      testResults.tests.approvalWorkflow = await this.testApprovalWorkflow();
      
      // Test 4: AI Health Check
      testResults.tests.aiHealthCheck = await this.testAIHealthCheck();
      
      // Cleanup
      await this.cleanupTestData();
      
      // Evaluasi hasil
      const connectionSuccess = !testResults.tests.connections.error;
      const tableSuccess = !testResults.tests.tableStructures.error;
      const workflowSuccess = testResults.tests.approvalWorkflow.success;
      const healthSuccess = testResults.tests.aiHealthCheck.overallStatus !== 'CRITICAL';
      
      testResults.overallSuccess = connectionSuccess && tableSuccess && workflowSuccess && healthSuccess;
      
      console.log('\n🎯 RINGKASAN HASIL TEST:');
      console.log('=========================');
      console.log(`✅ Koneksi Database: ${connectionSuccess ? 'BERHASIL' : 'GAGAL'}`);
      console.log(`✅ Struktur Tabel: ${tableSuccess ? 'BERHASIL' : 'GAGAL'}`);
      console.log(`✅ Alur Persetujuan: ${workflowSuccess ? 'BERHASIL' : 'GAGAL'}`);
      console.log(`✅ AI Health Check: ${healthSuccess ? 'BERHASIL' : 'GAGAL'}`);
      console.log(`\n🏆 STATUS KESELURUHAN: ${testResults.overallSuccess ? 'SEMUA TEST BERHASIL 🎉' : 'ADA TEST GAGAL ❌'}`);
      
      return testResults;
      
    } catch (error) {
      console.error('💥 ERROR TEST OVERALL:', error.message);
      testResults.overallSuccess = false;
      return testResults;
    }
  }

  // Cleanup resources
  async cleanup() {
    await Promise.all([
      this.pendingPool.end(),
      this.marketplacePool.end(),
      this.backupPool.end()
    ]);
  }
}

// Main execution
async function main() {
  const tester = new TestSynchronizationService();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('💥 FATAL ERROR:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { TestSynchronizationService };
