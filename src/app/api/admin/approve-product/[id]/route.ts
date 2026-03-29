import { NextRequest, NextResponse } from 'next/server';
import { PendingDatabaseService, MarketplaceDatabaseService } from '@/lib/multi-database-service';

// POST - Approve product and move to marketplace
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Get product from pending database
    const pendingProducts = await PendingDatabaseService.getPendingProducts();
    const product = pendingProducts.find(p => p.id === productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found in pending database' },
        { status: 404 }
      );
    }
    
    // Add to marketplace database
    await MarketplaceDatabaseService.addApprovedProduct(product);
    
    // Update status in pending database
    await PendingDatabaseService.updateProductStatus(productId, 'approved');
    
    console.log(`✅ Product ${productId} approved and moved to marketplace`);
    
    return NextResponse.json({
      success: true,
      message: 'Product approved and moved to marketplace'
    });
    
  } catch (error) {
    console.error('Error approving product:', error);
    return NextResponse.json(
      { error: 'Failed to approve product' },
      { status: 500 }
    );
  }
}

// DELETE - Reject product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Update status to rejected
    const success = await PendingDatabaseService.updateProductStatus(productId, 'rejected');
    
    if (!success) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    console.log(`❌ Product ${productId} rejected`);
    
    return NextResponse.json({
      success: true,
      message: 'Product rejected'
    });
    
  } catch (error) {
    console.error('Error rejecting product:', error);
    return NextResponse.json(
      { error: 'Failed to reject product' },
      { status: 500 }
    );
  }
}
