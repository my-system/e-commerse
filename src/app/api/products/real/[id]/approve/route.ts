import { NextRequest, NextResponse } from 'next/server';
import { productDb } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Update product status
    const updatedProduct = await productDb.update(productId, {
      status: 'approved'
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
