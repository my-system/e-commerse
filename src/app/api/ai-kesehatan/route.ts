// API Endpoint AI Health Check & Auto-Repair dalam Bahasa Indonesia
import { NextResponse } from 'next/server';
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

export async function GET() {
  try {
    console.log(`🤖 [API] Memulai pemeriksaan kesehatan sistem AI dan auto-repair`);
    
    const healthResult = await syncService.runHealthCheck();
    const systemStats = await syncService.getSystemStats();
    
    return NextResponse.json({
      sukses: true,
      pesan: 'Pemeriksaan kesehatan AI selesai',
      data: {
        kesehatan: healthResult,
        statistik: systemStats,
        rekomendasi: buatRekomendasi(healthResult),
        ringkasanAutoFix: {
          totalMasalah: healthResult.issues.length,
          autoFixed: healthResult.issues.filter(i => i.autoFixed).length,
          perluPerhatian: healthResult.issues.filter(i => !i.autoFixed).length
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Pemeriksaan kesehatan AI gagal:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Pemeriksaan kesehatan AI gagal',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log(`🔧 [API] Memulai proses auto-repair manual AI`);
    
    // Force jalankan auto-repair bahkan jika sistem terlihat sehat
    const healthResult = await syncService.runHealthCheck();
    
    return NextResponse.json({
      sukses: true,
      pesan: 'Auto-repair manual selesai',
      data: {
        kesehatan: healthResult,
        aksiPerbaikan: healthResult.issues.filter(i => i.autoFixed).map(i => ({
          tipe: i.type,
          deskripsi: i.description,
          tingkatKeparahan: i.severity
        })),
        masalahTersisa: healthResult.issues.filter(i => !i.autoFixed)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Auto-repair manual gagal:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Auto-repair manual gagal',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function buatRekomendasi(healthResult: any): string[] {
  const rekomendasi = [];
  
  if (healthResult.status === 'critical') {
    rekomendasi.push('🚨 KRITIS: Perhatian segera diperlukan. Periksa koneksi database dan integritas data.');
    rekomendasi.push('🔧 Jalankan proses perbaikan manual untuk memperbaiki masalah kritis.');
  }
  
  if (healthResult.status === 'warning') {
    rekomendasi.push('⚠️ PERINGATAN: Sistem memiliki ketidakkonsistenan yang harus ditangani.');
    rekomendasi.push('📊 Tinjau masalah yang terdeteksi dan pertimbangkan untuk menjalankan auto-repair.');
  }
  
  const masalahDuplikat = healthResult.issues.filter((i: any) => i.type === 'duplicate');
  if (masalahDuplikat.length > 0) {
    rekomendasi.push(`🔄 Ditemukan ${masalahDuplikat.length} produk duplikat. Auto-repair akan menghapus duplikat dari database pending.`);
  }
  
  const masalahKetidakkonsistenan = healthResult.issues.filter((i: any) => i.type === 'inconsistency');
  if (masalahKetidakkonsistenan.length > 0) {
    rekomendasi.push(`⚖️ Ditemukan ${masalahKetidakkonsistenan.length} ketidakkonsistenan data. Auto-repair akan menyinkronkan database backup.`);
  }
  
  const masalahYatim = healthResult.issues.filter((i: any) => i.type === 'orphan');
  if (masalahYatim.length > 0) {
    rekomendasi.push(`👻 Ditemukan ${masalahYatim.length} record yatim. Auto-repair akan mengembalikan produk marketplace yang hilang.`);
  }
  
  if (healthResult.issues.filter((i: any) => i.autoFixed).length > 0) {
    rekomendasi.push('✅ Beberapa masalah diperbaiki secara otomatis. Tinjau detail dalam laporan.');
  }
  
  if (healthResult.issues.filter((i: any) => !i.autoFixed).length > 0) {
    rekomendasi.push('⚠️ Beberapa masalah memerlukan intervensi manual. Periksa detail masalah untuk panduan.');
  }
  
  return rekomendasi;
}
