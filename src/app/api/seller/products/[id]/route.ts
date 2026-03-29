import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Get seller ID from session or auth token
    const sellerId = 'mock-seller-id'; // Replace with actual auth logic

    // Check if product belongs to this seller
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: sellerId
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: {
        id: productId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
