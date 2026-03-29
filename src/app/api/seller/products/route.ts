import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get seller ID from session or auth token
    // For now, we'll use a mock seller ID - in production, get from auth
    const sellerId = 'mock-seller-id'; // Replace with actual auth logic

    const products = await prisma.product.findMany({
      where: {
        sellerId: sellerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        description: true,
        featured: true,
        inStock: true,
        rating: true,
        reviews: true,
        images: true,
        material: true,
        care: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        badges: true,
        sellerId: true
      }
    });

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
    
    // Get seller ID from session or auth token
    const sellerId = 'mock-seller-id'; // Replace with actual auth logic

    const product = await prisma.product.create({
      data: {
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
        status: 'pending', // New products start as pending
        badges: JSON.stringify(body.badges || []),
        sellerId: sellerId
      }
    });

    return NextResponse.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
