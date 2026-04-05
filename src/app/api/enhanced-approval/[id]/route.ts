// Enhanced API Routes for 3-Database Synchronization with AI Auto-Detect & Repair
import { NextRequest, NextResponse } from 'next/server';
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

// Enhanced Approve Product Endpoint
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  try {
    console.log(`🚀 [API] Starting enhanced approval process for product: ${productId}`);
    
    const result = await syncService.approveProduct(productId);
    
    if (result.success) {
      console.log(`✅ [API] Product ${productId} approval completed successfully`);
      return NextResponse.json({
        success: true,
        message: 'Product approved and synchronized successfully',
        productId,
        workflow: 'A → B → C (Pending → Marketplace → Backup)',
        steps: result.steps,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`❌ [API] Product ${productId} approval failed`);
      return NextResponse.json({
        success: false,
        message: 'Product approval failed',
        productId,
        error: result.error,
        steps: result.steps,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error(`💥 [API] Critical error in approve endpoint:`, error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error during product approval',
      productId,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Health Check Endpoint
export async function GET() {
  try {
    console.log(`🔍 [API] Starting AI-powered health check`);
    
    const healthResult = await syncService.runHealthCheck();
    const systemStats = await syncService.getSystemStats();
    
    return NextResponse.json({
      success: true,
      health: healthResult,
      stats: systemStats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`💥 [API] Health check failed:`, error);
    return NextResponse.json({
      success: false,
      message: 'Health check failed',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
