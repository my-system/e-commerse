import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from './database-storage';

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    
    return NextResponse.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new product with complete data structure
    const newProduct = {
      id: Date.now().toString(),
      title: body.title,
      price: parseFloat(body.price),
      category: body.category, // Now using category name (fashion, electronics, etc.)
      description: body.description || undefined,
      featured: body.featured || false,
      inStock: true,
      rating: 0,
      reviews: 0,
      images: JSON.stringify(body.images || []),
      material: body.material || undefined,
      care: body.care || undefined,
      sizes: body.sizes || [],
      colors: body.colors || [],
      specifications: body.specifications || {},
      status: 'pending' as const, // Auto set status to pending for seller products
      badges: JSON.stringify(body.badges || []),
      sellerId: 'mock-seller-id', // In production, this would come from authentication
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedProduct = await addProduct(newProduct);
    
    return NextResponse.json({
      success: true,
      product: savedProduct
    });
    
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
