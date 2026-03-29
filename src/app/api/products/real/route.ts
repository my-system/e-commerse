import { NextRequest, NextResponse } from 'next/server';
import { productDb } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const products = await productDb.getAll();
    
    return NextResponse.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new product
    const newProduct = await productDb.create({
      title: body.title,
      price: parseFloat(body.price),
      category: body.category,
      description: body.description,
      featured: body.featured || false,
      inStock: body.inStock !== false,
      rating: 0,
      reviews: 0,
      images: JSON.stringify(body.images || []),
      material: body.material,
      care: body.care,
      status: 'pending',
      badges: JSON.stringify(body.badges || []),
      sellerId: 'mock-seller-id'
    });
    
    return NextResponse.json({
      success: true,
      product: newProduct
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
