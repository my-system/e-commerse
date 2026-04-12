import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDatabaseService } from '@/lib/multi-database-service';

// GET - Fetch approved products for marketplace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Server-side pagination - 50 products per page
    const all = searchParams.get('all') === 'true'; // Get all products (for admin)

    // If 'all' parameter is true, fetch all products without pagination
    if (all) {
      const { products, total } = await MarketplaceDatabaseService.getMarketplaceProducts(
        1,
        1000, // Large limit to get all products
        search || undefined,
        category || undefined,
        featured === 'true' ? true : undefined
      );

      // Parse images to array to match Product Detail page format
      const productsWithParsedImages = products.map(product => ({
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || [])
      }));

      return NextResponse.json({
        success: true,
        products: productsWithParsedImages,
        total,
        page,
        limit,
        totalPages: 1,
        message: 'Marketplace products retrieved'
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // Pass filter params to database service
    const { products, total } = await MarketplaceDatabaseService.getMarketplaceProducts(
      page,
      limit,
      search || undefined,
      category || undefined,
      featured === 'true' ? true : undefined
    );

    // Parse images to array to match Product Detail page format
    const productsWithParsedImages = products.map(product => ({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || [])
    }));

    return NextResponse.json({
      success: true,
      products: productsWithParsedImages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch marketplace products'
      },
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
    const { products: updatedProducts } = await MarketplaceDatabaseService.getMarketplaceProducts();
    
    // Parse images to array for consistency
    const productsWithParsedImages = updatedProducts.map(product => ({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || [])
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted from marketplace successfully',
      products: productsWithParsedImages
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
