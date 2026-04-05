// API Endpoint Persetujuan Produk Tingkat Lanjut dengan AI Auto-Detect & Repair
import { NextRequest, NextResponse } from 'next/server';
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

// Endpoint Persetujuan Produk Tingkat Lanjut
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  
  try {
    console.log(`🚀 [API] Memulai proses persetujuan tingkat lanjut untuk produk: ${productId}`);
    
    const result = await syncService.approveProduct(productId);
    
    if (result.success) {
      console.log(`✅ [API] Produk ${productId} berhasil disetujui`);
      return NextResponse.json({
        sukses: true,
        pesan: 'Produk berhasil disetujui dan disinkronkan',
        productId,
        alurKerja: 'A → B → C (Pending → Marketplace → Backup)',
        langkah: result.steps,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`❌ [API] Persetujuan produk ${productId} gagal`);
      return NextResponse.json({
        sukses: false,
        pesan: 'Persetujuan produk gagal',
        productId,
        error: result.error,
        langkah: result.steps,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error(`💥 [API] Error kritis di endpoint persetujuan:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Error server internal saat persetujuan produk',
      productId,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Endpoint Health Check
export async function GET() {
  try {
    console.log(`🔍 [API] Memulai pemeriksaan kesehatan AI`);
    
    const healthResult = await syncService.runHealthCheck();
    const systemStats = await syncService.getSystemStats();
    
    return NextResponse.json({
      sukses: true,
      kesehatan: healthResult,
      statistik: systemStats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Pemeriksaan kesehatan gagal:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Pemeriksaan kesehatan gagal',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
