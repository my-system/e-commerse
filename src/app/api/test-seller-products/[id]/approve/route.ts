import { NextRequest, NextResponse } from 'next/server';
import { updateProduct } from '../database-storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Update product status using database function
    const updatedProduct = await updateProduct(productId, {
      status: 'approved' as const
    });
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct
    });
    
  } catch (error) {
    console.error('Error approving product:', error);
    return NextResponse.json(
      { error: 'Failed to approve product' },
      { status: 500 }
    );
  }
}
