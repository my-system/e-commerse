// API Endpoint Penolakan Produk dengan AI Auto-Detect & Repair
import { NextRequest, NextResponse } from 'next/server';
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  
  try {
    console.log(`🚫 [API] Memulai proses penolakan tingkat lanjut untuk produk: ${productId}`);
    
    const result = await syncService.rejectProduct(productId, 'Ditolak oleh admin');
    
    if (result.success) {
      console.log(`✅ [API] Produk ${productId} berhasil ditolak`);
      return NextResponse.json({
        sukses: true,
        pesan: 'Produk berhasil ditolak dan dibackup',
        productId,
        alurKerja: 'A → C (Pending → Backup/Ditolak)',
        langkah: result.steps,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`❌ [API] Penolakan produk ${productId} gagal`);
      return NextResponse.json({
        sukses: false,
        pesan: 'Penolakan produk gagal',
        productId,
        error: result.error,
        langkah: result.steps,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error(`💥 [API] Error kritis di endpoint penolakan:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Error server internal saat penolakan produk',
      productId,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
