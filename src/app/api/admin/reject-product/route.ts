import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDatabaseService } from '@/lib/multi-database-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, reason, rejectedBy } = body;

    if (!productId || !reason || !rejectedBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID, reason, and rejected by are required' 
        },
        { status: 400 }
      );
    }

    const success = await MarketplaceDatabaseService.rejectProduct(productId, reason, rejectedBy);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Product rejected successfully',
        productId,
        reason
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to reject product' 
        },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error rejecting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to reject product' 
      },
      { status: 500 }
    );
  }
}
