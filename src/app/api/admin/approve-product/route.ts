import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDatabaseService } from '@/lib/multi-database-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, approvedBy } = body;

    if (!productId || !approvedBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID and approved by are required' 
        },
        { status: 400 }
      );
    }

    const success = await MarketplaceDatabaseService.approveProduct(productId, approvedBy);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Product approved successfully',
        productId
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to approve product' 
        },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error approving product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to approve product' 
      },
      { status: 500 }
    );
  }
}
