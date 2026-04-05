// AI Health Check & Auto-Repair API Endpoint
import { NextResponse } from 'next/server';
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

export async function GET() {
  try {
    console.log(`🤖 [API] Starting AI-powered system health check and auto-repair`);
    
    const healthResult = await syncService.runHealthCheck();
    const systemStats = await syncService.getSystemStats();
    
    return NextResponse.json({
      success: true,
      message: 'AI health check completed',
      data: {
        health: healthResult,
        stats: systemStats,
        recommendations: generateRecommendations(healthResult),
        autoFixSummary: {
          totalIssues: healthResult.issues.length,
          autoFixed: healthResult.issues.filter(i => i.autoFixed).length,
          requiresAttention: healthResult.issues.filter(i => !i.autoFixed).length
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] AI health check failed:`, error);
    return NextResponse.json({
      success: false,
      message: 'AI health check failed',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log(`🔧 [API] Starting manual AI auto-repair process`);
    
    // Force run auto-repair even if system appears healthy
    const healthResult = await syncService.runHealthCheck();
    
    return NextResponse.json({
      success: true,
      message: 'Manual auto-repair completed',
      data: {
        health: healthResult,
        repairActions: healthResult.issues.filter(i => i.autoFixed).map(i => ({
          type: i.type,
          description: i.description,
          severity: i.severity
        })),
        remainingIssues: healthResult.issues.filter(i => !i.autoFixed)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Manual auto-repair failed:`, error);
    return NextResponse.json({
      success: false,
      message: 'Manual auto-repair failed',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function generateRecommendations(healthResult: any): string[] {
  const recommendations = [];
  
  if (healthResult.status === 'critical') {
    recommendations.push('🚨 CRITICAL: Immediate attention required. Check database connections and data integrity.');
    recommendations.push('🔧 Run manual repair process to fix critical issues.');
  }
  
  if (healthResult.status === 'warning') {
    recommendations.push('⚠️ WARNING: System has inconsistencies that should be addressed.');
    recommendations.push('📊 Review the detected issues and consider running auto-repair.');
  }
  
  const duplicateIssues = healthResult.issues.filter((i: any) => i.type === 'duplicate');
  if (duplicateIssues.length > 0) {
    recommendations.push(`🔄 Found ${duplicateIssues.length} duplicate products. Auto-repair will remove duplicates from pending database.`);
  }
  
  const inconsistencyIssues = healthResult.issues.filter((i: any) => i.type === 'inconsistency');
  if (inconsistencyIssues.length > 0) {
    recommendations.push(`⚖️ Found ${inconsistencyIssues.length} data inconsistencies. Auto-repair will synchronize backup database.`);
  }
  
  const orphanIssues = healthResult.issues.filter((i: any) => i.type === 'orphan');
  if (orphanIssues.length > 0) {
    recommendations.push(`👻 Found ${orphanIssues.length} orphaned records. Auto-repair will restore missing marketplace products.`);
  }
  
  if (healthResult.issues.filter((i: any) => i.autoFixed).length > 0) {
    recommendations.push('✅ Some issues were automatically fixed. Review the details in the report.');
  }
  
  if (healthResult.issues.filter((i: any) => !i.autoFixed).length > 0) {
    recommendations.push('⚠️ Some issues require manual intervention. Check the issue details for guidance.');
  }
  
  return recommendations;
}
