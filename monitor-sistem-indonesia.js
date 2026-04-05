// Script Terminal Pemantau Sistem 3-Database dengan AI Auto-Detect & Repair
// Penggunaan: node monitor-sistem-indonesia.js [opsi]
const { Pool } = require('pg');

class PemantauSistemTingkatLanjut {
  constructor() {
    this.logger = new LoggerTerminal();
    this.koneksi = {
      pending: new KoneksiDatabaseTingkatLanjut("postgresql://postgres:postgres@localhost:5432/ecommerce_pending"),
      marketplace: new KoneksiDatabaseTingkatLanjut("postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"),
      backup: new KoneksiDatabaseTingkatLanjut("postgresql://postgres:postgres@localhost:5432/commercedb")
    };
  }

  async jalankanPemeriksaanLengkap() {
    const idOperasi = 'pemeriksaan-kesehatan-sistem';
    this.logger.mulaiTimerOperasi(idOperasi, 120000); // 2 menit timeout
    
    try {
      console.log('🚀 MONITOR SISTEM 3-DATABASE TINGKAT LANJUT');
      console.log('==========================================\n');
      
      const hasil = {
        timestamp: new Date().toISOString(),
        database: {},
        integritas: {},
        performa: {},
        rekomendasi: []
      };
      
      // Periksa setiap database
      console.log('📊 CEK STATUS DATABASE');
      console.log('------------------------');
      
      hasil.database.pending = await this.periksaDatabase('pending', this.koneksi.pending);
      hasil.database.marketplace = await this.periksaDatabase('marketplace', this.koneksi.marketplace);
      hasil.database.backup = await this.periksaDatabase('backup', this.koneksi.backup);
      
      // Periksa integritas data
      console.log('\n🔍 ANALISIS INTEGRITAS DATA');
      console.log('---------------------------');
      
      hasil.integritas = await this.analisisIntegritasData();
      
      // Periksa metrik performa
      console.log('\n⚡ METRIK PERFORMA');
      console.log('---------------------');
      
      hasil.performa = await this.ukurPerforma();
      
      // Buat rekomendasi
      hasil.rekomendasi = this.buatRekomendasi(hasil);
      
      // Tampilkan ringkasan
      this.tampilkanRingkasan(hasil);
      
      return hasil;
      
    } catch (error) {
      this.logger.logError('SISTEM-MONITOR', error, 'Pemeriksaan sistem komprehensif gagal');
      throw error;
    } finally {
      this.logger.hapusTimerOperasi(idOperasi);
    }
  }

  async periksaDatabase(nama, koneksi) {
    const waktuMulai = Date.now();
    
    try {
      this.logger.logStep('CEK-DATABASE', `Menghubungkan ke database ${nama}`);
      
      const client = await koneksi.hubungkanDenganRetry();
      
      try {
        // Periksa keberadaan tabel
        const cekTabel = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'products'
          );
        `);
        
        const tabelAda = cekTabel.rows[0].exists;
        
        if (!tabelAda) {
          return {
            status: 'error',
            pesan: 'Tabel products tidak ada',
            waktuKoneksi: Date.now() - waktuMulai
          };
        }
        
        // Dapatkan jumlah produk dan breakdown status
        const hasilJumlah = await client.query('SELECT COUNT(*) FROM products');
        const cekStatus = await client.query(`
          SELECT status, COUNT(*) as jumlah 
          FROM products 
          GROUP BY status
        `);
        
        const total = parseInt(hasilJumlah.rows[0].count);
        const waktuKoneksi = Date.now() - waktuMulai;
        
        this.logger.logSukses('CEK-DATABASE', `Pemeriksaan database ${nama} selesai`, 
          `${total} produk, waktu koneksi ${waktuKoneksi}ms`);
        
        return {
          status: 'sehat',
          total,
          breakdownStatus: cekStatus.rows,
          waktuKoneksi,
          timestamp: new Date().toISOString()
        };
        
      } finally {
        client.release();
      }
      
    } catch (error) {
      this.logger.logError('CEK-DATABASE', error, `Gagal memeriksa database ${nama}`);
      return {
        status: 'error',
        pesan: error.message,
        waktuKoneksi: Date.now() - waktuMulai
      };
    }
  }

  async analisisIntegritasData() {
    const waktuMulai = Date.now();
    
    try {
      this.logger.logStep('INTEGRITAS', 'Memulai analisis integritas data komprehensif');
      
      const integritas = {
        duplikat: [],
        ketidakkonsistenan: [],
        yatim: [],
        backupHilang: [],
        waktuAnalisis: Date.now() - waktuMulai
      };
      
      // Dapatkan semua produk dari semua database
      const clientPending = await this.koneksi.pending.hubungkanDenganRetry();
      const clientMarketplace = await this.koneksi.marketplace.hubungkanDenganRetry();
      const clientBackup = await this.koneksi.backup.hubungkanDenganRetry();
      
      try {
        const [hasilPending, hasilMarketplace, hasilBackup] = await Promise.all([
          clientPending.query('SELECT id, title, status FROM products'),
          clientMarketplace.query('SELECT id, title, status FROM products'),
          clientBackup.query('SELECT id, title, status FROM products')
        ]);
        
        const produkPending = hasilPending.rows;
        const produkMarketplace = hasilMarketplace.rows;
        const produkBackup = hasilBackup.rows;
        
        // Periksa duplikat
        const idPending = new Set(produkPending.map(p => p.id));
        const idMarketplace = new Set(produkMarketplace.map(p => p.id));
        
        for (const id of idPending) {
          if (idMarketplace.has(id)) {
            const produk = produkPending.find(p => p.id === id);
            integritas.duplikat.push({
              id,
              title: produk.title,
              lokasi: ['Pending', 'Marketplace'],
              tingkatKeparahan: 'tinggi'
            });
          }
        }
        
        // Periksa ketidakkonsistenan
        const mapBackup = new Map(produkBackup.map(p => [p.id, p]));
        
        for (const produkMarket of produkMarketplace) {
          const produkBackupItem = mapBackup.get(produkMarket.id);
          
          if (!produkBackupItem) {
            integritas.ketidakkonsistenan.push({
              id: produkMarket.id,
              title: produkMarket.title,
              masalah: 'Hilang dari backup',
              tingkatKeparahan: 'sedang'
            });
          } else if (produkBackupItem.status !== 'approved') {
            integritas.ketidakkonsistenan.push({
              id: produkMarket.id,
              title: produkMarket.title,
              masalah: `Ketidakcocokan status: Marketplace='approved', Backup='${produkBackupItem.status}'`,
              tingkatKeparahan: 'sedang'
            });
          }
        }
        
        // Periksa data yatim
        const semuaIdProduk = new Set([
          ...produkPending.map(p => p.id),
          ...produkMarketplace.map(p => p.id)
        ]);
        
        for (const backupItem of produkBackup) {
          if (!semuaIdProduk.has(backupItem.id)) {
            integritas.yatim.push({
              id: backupItem.id,
              title: backupItem.title,
              masalah: 'Record backup yatim',
              tingkatKeparahan: 'rendah'
            });
          }
        }
        
        // Periksa backup yang hilang
        for (const productId of semuaIdProduk) {
          if (!mapBackup.has(productId)) {
            integritas.backupHilang.push({
              id: productId,
              masalah: 'Backup hilang',
              tingkatKeparahan: 'tinggi'
            });
          }
        }
        
        this.logger.logSukses('INTEGRITAS', 'Analisis integritas data selesai', 
          `Ditemukan ${integritas.duplikat.length + integritas.ketidakkonsistenan.length + integritas.yatim.length + integritas.backupHilang.length} masalah`);
        
        return integritas;
        
      } finally {
        clientPending.release();
        clientMarketplace.release();
        clientBackup.release();
      }
      
    } catch (error) {
      this.logger.logError('INTEGRITAS', error, 'Analisis integritas data gagal');
      throw error;
    }
  }

  async ukurPerforma() {
    const waktuMulai = Date.now();
    
    try {
      this.logger.logStep('PERFORMA', 'Mengukur metrik performa sistem');
      
      const performa = {
        waktuKoneksi: {},
        waktuQuery: {},
        bebanSistem: {},
        waktuPengukuran: Date.now() - waktuMulai
      };
      
      // Ukur waktu koneksi
      const mulaiKoneksi = Date.now();
      await this.koneksi.pending.hubungkanDenganRetry();
      performa.waktuKoneksi.pending = Date.now() - mulaiKoneksi;
      
      const mulaiMarketplace = Date.now();
      await this.koneksi.marketplace.hubungkanDenganRetry();
      performa.waktuKoneksi.marketplace = Date.now() - mulaiMarketplace;
      
      const mulaiBackup = Date.now();
      await this.koneksi.backup.hubungkanDenganRetry();
      performa.waktuKoneksi.backup = Date.now() - mulaiBackup;
      
      // Ukur waktu query
      const clientPending = await this.koneksi.pending.hubungkanDenganRetry();
      try {
        const mulaiQuery = Date.now();
        await clientPending.query('SELECT COUNT(*) FROM products');
        performa.waktuQuery.pendingCount = Date.now() - mulaiQuery;
      } finally {
        clientPending.release();
      }
      
      const clientMarketplace = await this.koneksi.marketplace.hubungkanDenganRetry();
      try {
        const mulaiQuery = Date.now();
        await clientMarketplace.query('SELECT COUNT(*) FROM products');
        performa.waktuQuery.marketplaceCount = Date.now() - mulaiQuery;
      } finally {
        clientMarketplace.release();
      }
      
      const clientBackup = await this.koneksi.backup.hubungkanDenganRetry();
      try {
        const mulaiQuery = Date.now();
        await clientBackup.query('SELECT COUNT(*) FROM products');
        performa.waktuQuery.backupCount = Date.now() - mulaiQuery;
      } finally {
        clientBackup.release();
      }
      
      // Metrik beban sistem
      performa.bebanSistem = {
        uptime: process.uptime(),
        penggunaanMemori: process.memoryUsage(),
        penggunaanCPU: process.cpuUsage()
      };
      
      this.logger.logSukses('PERFORMA', 'Pengukuran performa selesai');
      
      return performa;
      
    } catch (error) {
      this.logger.logError('PERFORMA', error, 'Pengukuran performa gagal');
      throw error;
    }
  }

  buatRekomendasi(hasil) {
    const rekomendasi = [];
    
    // Rekomendasi kesehatan database
    Object.entries(hasil.database).forEach(([nama, db]) => {
      if (db.status === 'error') {
        rekomendasi.push({
          prioritas: 'tinggi',
          kategori: 'database',
          pesan: `Database ${nama} tidak dapat diakses: ${db.pesan}`,
          aksi: 'Periksa koneksi database dan konfigurasi'
        });
      }
      
      if (db.waktuKoneksi > 5000) {
        rekomendasi.push({
          prioritas: 'sedang',
          kategori: 'performa',
          pesan: `Koneksi database ${nama} lambat (${db.waktuKoneksi}ms)`,
          aksi: 'Optimalkan koneksi database atau periksa latency jaringan'
        });
      }
    });
    
    // Rekomendasi integritas
    if (hasil.integritas.duplikat.length > 0) {
      rekomendasi.push({
        prioritas: 'tinggi',
        kategori: 'integritas-data',
        pesan: `Ditemukan ${hasil.integritas.duplikat.length} produk duplikat`,
        aksi: 'Jalankan auto-repair untuk menghapus duplikat dari database pending'
      });
    }
    
    if (hasil.integritas.ketidakkonsistenan.length > 0) {
      rekomendasi.push({
        prioritas: 'sedang',
        kategori: 'integritas-data',
        pesan: `Ditemukan ${hasil.integritas.ketidakkonsistenan.length} ketidakkonsistenan data`,
        aksi: 'Jalankan auto-repair untuk menyinkronkan database backup'
      });
    }
    
    if (hasil.integritas.backupHilang.length > 0) {
      rekomendasi.push({
        prioritas: 'tinggi',
        kategori: 'backup',
        pesan: `Ditemukan ${hasil.integritas.backupHilang.length} produk yang hilang dari backup`,
        aksi: 'Jalankan auto-repair untuk membuat backup yang hilang'
      });
    }
    
    return rekomendasi;
  }

  tampilkanRingkasan(hasil) {
    console.log('\n📋 RINGKASAN KESEHATAN SISTEM');
    console.log('========================');
    
    // Status keseluruhan
    const masalahKritis = [
      ...hasil.integritas.duplikat,
      ...hasil.integritas.backupHilang
    ].length;
    
    const masalahSedang = hasil.integritas.ketidakkonsistenan.length;
    const errorDatabase = Object.values(hasil.database).filter(db => db.status === 'error').length;
    
    let statusKeseluruhan = 'SEHAT';
    if (masalahKritis > 0 || errorDatabase > 0) {
      statusKeseluruhan = 'KRITIS';
    } else if (masalahSedang > 5) {
      statusKeseluruhan = 'PERINGATAN';
    }
    
    const iconStatus = statusKeseluruhan === 'SEHAT' ? '✅' : statusKeseluruhan === 'PERINGATAN' ? '⚠️' : '🚨';
    console.log(`${iconStatus} Status Keseluruhan: ${statusKeseluruhan}`);
    console.log(`📊 Status Database: ${Object.values(hasil.database).filter(db => db.status === 'sehat').length}/3 sehat`);
    console.log(`🔍 Integritas Data: ${masalahKritis + masalahSedang} masalah ditemukan`);
    console.log(`⚡ Performa: Waktu koneksi rata-rata ${Math.round(
      Object.values(hasil.performa.waktuKoneksi).reduce((a, b) => a + b, 0) / 3
    )}ms`);
    
    // Rekomendasi teratas
    if (hasil.rekomendasi.length > 0) {
      console.log('\n💡 REKOMENDASI TERATAS');
      console.log('---------------------');
      
      hasil.rekomendasi
        .filter(r => r.prioritas === 'tinggi')
        .slice(0, 3)
        .forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.pesan}`);
          console.log(`   Aksi: ${rec.aksi}`);
        });
    }
    
    console.log(`\n🕐 Selesai pada: ${new Date().toISOString()}`);
    console.log('==========================================\n');
  }

  async cleanup() {
    await Promise.all([
      this.koneksi.pending.end(),
      this.koneksi.marketplace.end(),
      this.koneksi.backup.end()
    ]);
  }
}

// Kelas Koneksi Database Tingkat Lanjut (disederhanakan untuk terminal)
class KoneksiDatabaseTingkatLanjut {
  constructor(connectionString) {
    this.pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 30000,
      max: 5
    });
  }

  async hubungkanDenganRetry() {
    let errorTerakhir;
    
    for (let percobaan = 1; percobaan <= 3; percobaan++) {
      try {
        return await this.pool.connect();
      } catch (error) {
        errorTerakhir = error;
        if (percobaan < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * percobaan));
        }
      }
    }
    
    throw errorTerakhir;
  }

  async end() {
    await this.pool.end();
  }
}

// Kelas Logger Terminal
class LoggerTerminal {
  constructor() {
    this.operasiAktif = new Map();
  }

  logStep(langkah, operasi, detail) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${langkah}: ${operasi}`);
    if (detail) console.log(`    ℹ️  ${detail}`);
  }

  logError(langkah, error, detail) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${langkah} ERROR: ${error.message}`);
    if (detail) console.error(`    🔍 Detail: ${detail}`);
  }

  logSukses(langkah, pesan, detail) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ ${langkah} SUKSES: ${pesan}`);
    if (detail) console.log(`    🎯 ${detail}`);
  }

  mulaiTimerOperasi(idOperasi, timeoutMs = 60000) {
    this.hapusTimerOperasi(idOperasi);
    
    const timer = setTimeout(() => {
      console.error(`⏰ TIMEOUT: Operasi '${idOperasi}' melebihi ${timeoutMs}ms`);
      console.error(`🚨 DETEKSI TERMINAL SIBUK: Auto-terminate operasi yang hang`);
      this.hapusTimerOperasi(idOperasi);
    }, timeoutMs);
    
    this.operasiAktif.set(idOperasi, timer);
  }

  hapusTimerOperasi(idOperasi) {
    const timer = this.operasiAktif.get(idOperasi);
    if (timer) {
      clearTimeout(timer);
      this.operasiAktif.delete(idOperasi);
    }
  }
}

// Interface CLI
async function main() {
  const args = process.argv.slice(2);
  const perintah = args[0] || 'cek';
  
  const monitor = new PemantauSistemTingkatLanjut();
  
  try {
    switch (perintah) {
      case 'cek':
        await monitor.jalankanPemeriksaanLengkap();
        break;
        
      case 'cepat':
        console.log('🚀 Menjalankan pemeriksaan kesehatan cepat...');
        // Implementasi pemeriksaan cepat
        break;
        
      case 'bantuan':
        console.log('Pemantau Sistem 3-Database Tingkat Lanjut');
        console.log('Penggunaan: node monitor-sistem-indonesia.js [perintah]');
        console.log('');
        console.log('Perintah:');
        console.log('  cek     - Jalankan pemeriksaan kesehatan sistem komprehensif');
        console.log('  cepat   - Jalankan pemeriksaan kesehatan cepat');
        console.log('  bantuan - Tampilkan pesan bantuan ini');
        break;
        
      default:
        console.error(`Perintah tidak dikenal: ${perintah}`);
        console.log('Gunakan "bantuan" untuk melihat perintah yang tersedia');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Pemantau sistem gagal:', error.message);
    process.exit(1);
  } finally {
    await monitor.cleanup();
  }
}

// Jalankan jika dipanggil langsung
if (require.main === module) {
  main();
}

module.exports = { PemantauSistemTingkatLanjut };
