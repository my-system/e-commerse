// Enhanced Reject Product Endpoint with AI Auto-Detect & Repair
import { NextRequest, NextResponse } from 'next/server';
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  
  try {
    console.log(`🚫 [API] Starting enhanced rejection process for product: ${productId}`);
    
    const result = await syncService.rejectProduct(productId, 'Rejected by admin');
    
    if (result.success) {
      console.log(`✅ [API] Product ${productId} rejection completed successfully`);
      return NextResponse.json({
        success: true,
        message: 'Product rejected and backed up successfully',
        productId,
        workflow: 'A → C (Pending → Backup/Rejected)',
        steps: result.steps,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`❌ [API] Product ${productId} rejection failed`);
      return NextResponse.json({
        success: false,
        message: 'Product rejection failed',
        productId,
        error: result.error,
        steps: result.steps,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error(`💥 [API] Critical error in reject endpoint:`, error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error during product rejection',
      productId,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
