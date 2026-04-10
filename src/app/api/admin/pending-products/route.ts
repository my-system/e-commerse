import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ApprovalWorkflowService, MarketplaceDatabaseService, PendingDatabaseService } from '@/lib/multi-database-service';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get pending products for admin review using Prisma directly
    const products = await prisma.product.findMany({
      where: {
        status: 'PENDING'
      },
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        description: true,
        featured: true,
        inStock: true,
        rating: true,
        reviews: true,
        images: true,
        material: true,
        care: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        sellerId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      message: 'Pending products retrieved for admin review'
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
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
        try {
          // Direct update status in Neon database using Prisma
          const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { 
              status: 'APPROVED',
              approvedAt: new Date(),
              updatedAt: new Date()
            }
          });
          
          console.log(`Product ${productId} approved successfully in Neon database`);
          success = true;
          message = 'Product approved successfully';
        } catch (error) {
          console.error('Error approving product in Neon:', error);
          success = false;
          message = 'Failed to approve product in database';
        }
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
        try {
          // Direct update status in Neon database using Prisma
          const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { 
              status: 'REJECTED',
              rejectedAt: new Date(),
              updatedAt: new Date()
            }
          });
          
          console.log(`Product ${productId} rejected successfully in Neon database`);
          success = true;
          message = `Product rejected: ${reason}`;
        } catch (error) {
          console.error('Error rejecting product in Neon:', error);
          success = false;
          message = 'Failed to reject product in database';
        }
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
      // Get updated products list using Prisma directly
      const updatedProducts = await prisma.product.findMany({
        where: {
          status: 'PENDING'
        },
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          description: true,
          featured: true,
          inStock: true,
          rating: true,
          reviews: true,
          images: true,
          material: true,
          care: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          sellerId: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      await prisma.$disconnect();
      
      return NextResponse.json({
        success: true,
        message,
        products: updatedProducts
      });
    } else {
      await prisma.$disconnect();
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
    await prisma.$disconnect();
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
