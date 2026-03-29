import { NextRequest, NextResponse } from 'next/server';
import { productDb } from '@/lib/database';

// Mock database - dalam production gunakan database sebenarnya
// let products: Product[] = [];

export async function GET(request: NextRequest) {
  try {
    const products = productDb.getAll();
    
    return NextResponse.json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi input
    const requiredFields = ['title', 'price', 'category', 'images'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Buat produk baru
    const newProduct = productDb.create({
      title: body.title.trim(),
      price: parseFloat(body.price),
      images: body.images,
      category: body.category,
      description: body.description?.trim() || undefined,
      featured: body.featured || false,
      inStock: body.inStock !== false,
      rating: 0,
      reviews: 0,
      material: body.material?.trim() || undefined,
      care: body.care?.trim() || undefined,
      sizes: body.sizes?.length > 0 ? body.sizes : undefined,
      colors: body.colors?.length > 0 ? body.colors : undefined,
      specifications: body.specifications && Object.keys(body.specifications).length > 0 ? body.specifications : undefined,
      status: body.status || 'pending' // Default to pending if not specified
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
