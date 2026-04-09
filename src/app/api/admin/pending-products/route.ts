import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDatabaseService, ApprovalWorkflowService, PendingDatabaseService } from '@/lib/multi-database-service';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, action, reason } = body;

    if (!productId || !action) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID and action are required' 
        },
        { status: 400 }
      );
    }

    let success = false;
    let message = '';

    switch (action) {
      case 'approve':
        success = await ApprovalWorkflowService.approveProduct(productId);
        message = success 
          ? 'Product approved and moved to marketplace successfully'
          : 'Failed to approve product';
        break;

      case 'reject':
        if (!reason) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Reason is required for rejection' 
            },
            { status: 400 }
          );
        }
        success = await ApprovalWorkflowService.rejectProduct(productId);
        message = success 
          ? `Product rejected: ${reason}`
          : 'Failed to reject product';
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action. Use "approve" or "reject"' 
          },
          { status: 400 }
        );
    }

    if (success) {
      // Get updated products list
      const updatedProducts = await MarketplaceDatabaseService.getPendingProducts();
      
      return NextResponse.json({
        success: true,
        message,
        products: updatedProducts
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: message 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error processing admin action:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process action' 
      },
      { status: 500 }
    );
  }
}

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
    const success = await PendingDatabaseService.deletePendingProduct(productId);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete pending product' 
        },
        { status: 500 }
      );
    }

    // Get updated products list
    const updatedProducts = await MarketplaceDatabaseService.getPendingProducts();
    
    return NextResponse.json({
      success: true,
      message: 'Pending product deleted successfully',
      products: updatedProducts
    });
    
  } catch (error: any) {
    console.error('Error deleting pending product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete pending product' 
      },
      { status: 500 }
    );
  }
}
