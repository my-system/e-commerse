// Script Detail Pemeriksaan Database
// Melihat data di ketiga database secara detail
const { Pool } = require('pg');

class DatabaseDetailChecker {
  constructor() {
    console.log('🔍 DETAIL DATABASE CHECKER');
    console.log('==========================\n');
    
    this.pools = {
      pending: new Pool({
        connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
        connectionTimeoutMillis: 30000
      }),
      marketplace: new Pool({
        connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace", 
        connectionTimeoutMillis: 30000
      }),
      backup: new Pool({
        connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb",
        connectionTimeoutMillis: 30000
      })
    };
  }

  async checkDatabaseDetails() {
    const databases = [
      { name: 'Database A (Pending)', key: 'pending', color: '🔴' },
      { name: 'Database B (Marketplace)', key: 'marketplace', color: '🟢' },
      { name: 'Database C (Backup)', key: 'backup', color: '🛡️' }
    ];

    const allData = {};

    for (const db of databases) {
      console.log(`${db.color} ${db.name}`);
      console.log('-'.repeat(db.name.length + 4));
      
      const client = await this.pools[db.key].connect();
      try {
        // Get all products
        const result = await client.query(`
          SELECT id, title, status, seller_id, created_at, updated_at 
          FROM products 
          ORDER BY created_at DESC
        `);
        
        allData[db.key] = result.rows;
        
        console.log(`📦 Total Produk: ${result.rows.length}`);
        
        if (result.rows.length > 0) {
          // Status breakdown
          const statusBreakdown = {};
          result.rows.forEach(row => {
            statusBreakdown[row.status] = (statusBreakdown[row.status] || 0) + 1;
          });
          
          console.log('📊 Status Breakdown:');
          Object.entries(statusBreakdown).forEach(([status, count]) => {
            const icon = status === 'pending' ? '⏳' : status === 'approved' ? '✅' : '❌';
            console.log(`   ${icon} ${status}: ${count}`);
          });
          
          // Show product details
          console.log('\n📋 Detail Produk:');
          result.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ID: ${row.id}`);
            console.log(`      Title: ${row.title}`);
            console.log(`      Status: ${row.status}`);
            console.log(`      Seller: ${row.seller_id}`);
            console.log(`      Created: ${row.created_at}`);
            console.log(`      Updated: ${row.updated_at}`);
            console.log('');
          });
        } else {
          console.log('📭 Tidak ada produk dalam database ini');
        }
        
      } catch (error) {
        console.error(`❌ Error checking ${db.name}:`, error.message);
        allData[db.key] = { error: error.message };
      } finally {
        client.release();
      }
      
      console.log('\n' + '='.repeat(50) + '\n');
    }

    // Cross-database analysis
    console.log('🔄 CROSS-DATABASE ANALYSIS');
    console.log('========================');
    
    const pendingIds = new Set(allData.pending?.filter(row => row.id).map(row => row.id) || []);
    const marketplaceIds = new Set(allData.marketplace?.filter(row => row.id).map(row => row.id) || []);
    const backupIds = new Set(allData.backup?.filter(row => row.id).map(row => row.id) || []);
    
    // Check for duplicates
    console.log('🔍 DETEKSI DUPLIKAT:');
    const duplicates = [];
    for (const id of pendingIds) {
      if (marketplaceIds.has(id)) {
        duplicates.push(id);
      }
    }
    
    if (duplicates.length > 0) {
      console.log(`⚠️ Ditemukan ${duplicates.length} duplikat (ada di Pending & Marketplace):`);
      duplicates.forEach(id => console.log(`   - ${id}`));
    } else {
      console.log('✅ Tidak ada duplikat ditemukan');
    }
    
    // Check for missing backups
    console.log('\n🔍 DETEKSI BACKUP HILANG:');
    const allProductIds = new Set([...pendingIds, ...marketplaceIds]);
    const missingBackups = [];
    
    for (const id of allProductIds) {
      if (!backupIds.has(id)) {
        missingBackups.push(id);
      }
    }
    
    if (missingBackups.length > 0) {
      console.log(`⚠️ Ditemukan ${missingBackups.length} produk yang hilang dari backup:`);
      missingBackups.forEach(id => {
        const source = pendingIds.has(id) ? 'Pending' : 'Marketplace';
        console.log(`   - ${id} (dari ${source})`);
      });
    } else {
      console.log('✅ Semua produk memiliki backup');
    }
    
    // Check for orphaned backups
    console.log('\n🔍 DETEKSI BACKUP YATIM:');
    const orphanedBackups = [];
    
    for (const id of backupIds) {
      if (!allProductIds.has(id)) {
        orphanedBackups.push(id);
      }
    }
    
    if (orphanedBackups.length > 0) {
      console.log(`⚠️ Ditemukan ${orphanedBackups.length} backup yatim (ada di backup tapi tidak di A/B):`);
      orphanedBackups.forEach(id => console.log(`   - ${id}`));
    } else {
      console.log('✅ Tidak ada backup yatim');
    }
    
    // Status consistency check
    console.log('\n🔍 DETEKSI KETIDAKKONSISTENAN STATUS:');
    const inconsistencies = [];
    
    // Check marketplace products vs backup status
    const marketplaceMap = new Map(allData.marketplace?.filter(row => row.id).map(row => [row.id, row]) || []);
    const backupMap = new Map(allData.backup?.filter(row => row.id).map(row => [row.id, row]) || []);
    
    for (const [id, marketplaceProduct] of marketplaceMap) {
      const backupProduct = backupMap.get(id);
      if (backupProduct && backupProduct.status !== 'approved') {
        inconsistencies.push({
          id,
          marketplaceStatus: 'approved',
          backupStatus: backupProduct.status,
          issue: 'Marketplace product should have approved status in backup'
        });
      }
    }
    
    if (inconsistencies.length > 0) {
      console.log(`⚠️ Ditemukan ${inconsistencies.length} ketidakkonsistenan status:`);
      inconsistencies.forEach(inc => {
        console.log(`   - ${inc.id}: Marketplace=${inc.marketplaceStatus}, Backup=${inc.backupStatus}`);
        console.log(`     Issue: ${inc.issue}`);
      });
    } else {
      console.log('✅ Status konsisten di semua database');
    }
    
    return {
      databases: allData,
      analysis: {
        duplicates,
        missingBackups,
        orphanedBackups,
        inconsistencies,
        summary: {
          totalInPending: pendingIds.size,
          totalInMarketplace: marketplaceIds.size,
          totalInBackup: backupIds.size,
          totalUniqueProducts: allProductIds.size,
          issuesFound: duplicates.length + missingBackups.length + orphanedBackups.length + inconsistencies.length
        }
      }
    };
  }

  async cleanup() {
    await Promise.all([
      this.pools.pending.end(),
      this.pools.marketplace.end(),
      this.pools.backup.end()
    ]);
  }
}

// Main execution
async function main() {
  const checker = new DatabaseDetailChecker();
  
  try {
    const results = await checker.checkDatabaseDetails();
    
    console.log('\n📊 SUMMARY ANALYSIS:');
    console.log('===================');
    console.log(`Total Produk di Pending: ${results.analysis.summary.totalInPending}`);
    console.log(`Total Produk di Marketplace: ${results.analysis.summary.totalInMarketplace}`);
    console.log(`Total Produk di Backup: ${results.analysis.summary.totalInBackup}`);
    console.log(`Total Produk Unik: ${results.analysis.summary.totalUniqueProducts}`);
    console.log(`Total Issues Ditemukan: ${results.analysis.summary.issuesFound}`);
    
    if (results.analysis.summary.issuesFound > 0) {
      console.log('\n⚠️ REKOMENDASI:');
      console.log('1. Jalankan auto-repair untuk memperbaiki masalah yang terdeteksi');
      console.log('2. Backup produk yang hilang dari database C');
      console.log('3. Hapus duplikat dari database pending jika ada');
      console.log('4. Sinkronkan status ketidakcocokan');
    } else {
      console.log('\n✅ SEMUA DATABASE SEHAT DAN KONSISTEN!');
    }
    
  } catch (error) {
    console.error('💥 FATAL ERROR:', error);
  } finally {
    await checker.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DatabaseDetailChecker };
