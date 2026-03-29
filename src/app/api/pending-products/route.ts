import { NextRequest, NextResponse } from 'next/server';
import { PendingDatabaseService } from '@/lib/multi-database-service';

// GET - Fetch pending products for sellers and admins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    let products;
    if (sellerId) {
      // Get products for specific seller
      products = await PendingDatabaseService.getSellerProducts(sellerId);
    } else {
      // Get all pending products (for admin)
      products = await PendingDatabaseService.getPendingProducts();
    }
    
    return NextResponse.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}

// POST - Add new product to pending database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new product with complete data structure
    const newProduct = {
      title: body.title,
      price: parseFloat(body.price),
      category: body.category,
      description: body.description || undefined,
      featured: body.featured || false,
      inStock: true,
      rating: 0,
      reviews: 0,
      images: JSON.stringify(body.images || []),
      material: body.material || undefined,
      care: body.care || undefined,
      status: 'pending' as const,
      badges: JSON.stringify(body.badges || []),
      sellerId: 'mock-seller-id', // In production, get from auth
    };

    const savedProduct = await PendingDatabaseService.addProduct(newProduct);
    
    return NextResponse.json({
      success: true,
      product: savedProduct
    });
    
  } catch (error) {
    console.error('Error adding pending product:', error);
    return NextResponse.json(
      { error: 'Failed to add pending product' },
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
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const deleted = await PendingDatabaseService.deleteProduct(productId);
    
    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Error deleting pending product:', error);
    return NextResponse.json(
      { error: 'Failed to delete pending product' },
      { status: 500 }
    );
  }
}
