import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDatabaseService } from '@/lib/multi-database-service';

export async function GET(request: NextRequest) {
  try {
    // Get pending products for admin review
    const products = await MarketplaceDatabaseService.getPendingProducts();
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      message: 'Pending products retrieved for admin review'
    });
  } catch (error: any) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch pending products' 
      },
      { status: 500 }
    );
  }
}
