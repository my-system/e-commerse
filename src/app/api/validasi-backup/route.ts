// API Endpoint Validasi Central Backup dalam Bahasa Indonesia
import { NextResponse } from 'next/server';
import CentralBackupValidator from '@/lib/central-backup-validator';

const validator = new CentralBackupValidator();

export async function GET() {
  try {
    console.log(`🛡️ [API] Memulai validasi Central Backup`);
    
    const report = await validator.generateBackupReport();
    
    return NextResponse.json({
      sukses: true,
      pesan: 'Validasi Central Backup selesai',
      data: report,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Validasi Central Backup gagal:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Validasi Central Backup gagal',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log(`🔧 [API] Memulai perbaikan Central Backup manual`);
    
    // Force validasi dan auto-repair
    const validation = await validator.validateCentralBackup();
    
    return NextResponse.json({
      sukses: true,
      pesan: 'Perbaikan Central Backup manual selesai',
      data: {
        validasi: validation,
        ringkasanPerbaikan: {
          totalMasalah: validation.issues.length,
          autoFixed: validation.issues.filter(i => i.autoFixed).length,
          perluPerhatian: validation.issues.filter(i => !i.autoFixed).length
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Perbaikan Central Backup manual gagal:`, error);
    return NextResponse.json({
      sukses: false,
      pesan: 'Perbaikan Central Backup manual gagal',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
