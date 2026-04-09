// Enhanced Seller Products API with Neon PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { PendingDatabaseService } from '@/lib/multi-database-service';

export async function GET(request: NextRequest) {
  try {
    // Get products from Pending Database - using Neon PostgreSQL
    const products = await PendingDatabaseService.getPendingProducts();
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      message: 'Products retrieved from Pending Database using Neon PostgreSQL'
    });
  } catch (error: any) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch seller products' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.price || !body.category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title, price, and category are required' 
        },
        { status: 400 }
      );
    }
    
    // Create new product for seller - add to Pending Database
    const newProduct = {
      title: body.title,
      price: parseFloat(body.price),
      category: body.category,
      description: body.description || '',
      featured: body.featured || false,
      inStock: body.inStock !== false, // default true
      rating: 0,
      reviews: 0,
      images: JSON.stringify(body.images || []),
      material: body.material || '',
      care: body.care || '',
      status: 'pending' as const, // Auto set ke pending untuk seller products
      badges: JSON.stringify(body.badges || []),
      sellerId: body.sellerId || 'mock-seller-id' // Dari auth system
    };

    // Save to Pending Database using Neon PostgreSQL
    const savedProduct = await PendingDatabaseService.addProduct(newProduct);
    
    console.log(`✅ Seller product added to Pending Database: ${savedProduct.id}`);
    
    return NextResponse.json({
      success: true,
      product: savedProduct,
      message: 'Product added to Pending Database using Neon PostgreSQL - waiting for admin approval',
      workflow: 'Product will move from Pending to Marketplace upon approval',
      detailPageUrl: `/database-products/${savedProduct.id}`,
      note: 'Product detail page automatically created and accessible'
    });
    
  } catch (error: any) {
    console.error('Error adding seller product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to add seller product' 
      },
      { status: 500 }
    );
  }
}

// GET products by seller ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sellerId } = body;
    
    if (!sellerId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seller ID is required' 
        },
        { status: 400 }
      );
    }
    
    // Get products by seller from Pending Database
    const allProducts = await PendingDatabaseService.getPendingProducts();
    const sellerProducts = allProducts.filter(p => p.sellerId === sellerId);
    
    return NextResponse.json({
      success: true,
      products: sellerProducts,
      total: sellerProducts.length,
      sellerId,
      message: `Retrieved ${sellerProducts.length} products for seller ${sellerId} from Pending Database using Neon PostgreSQL`
    });
    
  } catch (error: any) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch seller products' 
      },
      { status: 500 }
    );
  }
}
