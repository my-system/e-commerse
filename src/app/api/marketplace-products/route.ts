import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDatabaseService } from '@/lib/multi-database-service';

// GET - Fetch approved products for marketplace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    let products = await MarketplaceDatabaseService.getMarketplaceProducts();
    
    // Apply filters
    if (category && category !== 'all') {
      products = products.filter(product => product.category === category);
    }
    
    if (featured === 'true') {
      products = products.filter(product => product.featured);
    }
    
    return NextResponse.json({
      success: true,
      products: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace products' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product from marketplace
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
    
    // Delete product from marketplace database
    const success = await MarketplaceDatabaseService.deleteMarketplaceProduct(productId);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete product from marketplace' 
        },
        { status: 500 }
      );
    }
    
    // Get updated products list
    const updatedProducts = await MarketplaceDatabaseService.getMarketplaceProducts();
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted from marketplace successfully',
      products: updatedProducts
    });
    
  } catch (error: any) {
    console.error('Error deleting marketplace product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete marketplace product' 
      },
      { status: 500 }
    );
  }
}
