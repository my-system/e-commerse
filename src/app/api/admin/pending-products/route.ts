import { NextRequest, NextResponse } from 'next/server';
import { PendingDatabaseService, ApprovalWorkflowService } from '@/lib/multi-database-service';

// GET - Fetch pending products for admin
export async function GET(request: NextRequest) {
  try {
    const products = await PendingDatabaseService.getPendingProducts();
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length
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

// POST - Approve or reject product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, action, reason } = body;
    
    if (!productId || !action) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'productId and action are required' 
        },
        { status: 400 }
      );
    }
    
    let success = false;
    let message = '';
    
    if (action === 'approve') {
      success = await ApprovalWorkflowService.approveProduct(productId);
      message = success ? 'Product approved successfully' : 'Failed to approve product';
    } else if (action === 'reject') {
      success = await ApprovalWorkflowService.rejectProduct(productId);
      message = success ? 'Product rejected successfully' : 'Failed to reject product';
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid action. Must be "approve" or "reject"' 
        },
        { status: 400 }
      );
    }
    
    // Get updated products list
    const updatedProducts = await PendingDatabaseService.getPendingProducts();
    
    return NextResponse.json({
      success,
      message,
      products: updatedProducts
    });
    
  } catch (error: any) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process approval' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete product from pending database
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID is required' 
        },
        { status: 400 }
      );
    }
    
    // Delete product from pending database
    const success = await PendingDatabaseService.deleteProduct(productId);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete product' 
        },
        { status: 500 }
      );
    }
    
    // Get updated products list
    const updatedProducts = await PendingDatabaseService.getPendingProducts();
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      products: updatedProducts
    });
    
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete product' 
      },
      { status: 500 }
    );
  }
}
