// Central Backup Validation API Endpoint
import { NextResponse } from 'next/server';
import CentralBackupValidator from '@/lib/central-backup-validator';

const validator = new CentralBackupValidator();

export async function GET() {
  try {
    console.log(`🛡️ [API] Starting Central Backup validation`);
    
    const report = await validator.generateBackupReport();
    
    return NextResponse.json({
      success: true,
      message: 'Central Backup validation completed',
      data: report,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Central Backup validation failed:`, error);
    return NextResponse.json({
      success: false,
      message: 'Central Backup validation failed',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log(`🔧 [API] Starting manual Central Backup repair`);
    
    // Force validation and auto-repair
    const validation = await validator.validateCentralBackup();
    
    return NextResponse.json({
      success: true,
      message: 'Manual Central Backup repair completed',
      data: {
        validation,
        repairSummary: {
          totalIssues: validation.issues.length,
          autoFixed: validation.issues.filter(i => i.autoFixed).length,
          requiresAttention: validation.issues.filter(i => !i.autoFixed).length
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Manual Central Backup repair failed:`, error);
    return NextResponse.json({
      success: false,
      message: 'Manual Central Backup repair failed',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
