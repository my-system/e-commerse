import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for testing
    const mockProducts = [
      {
        id: '1',
        title: 'Test Product 1',
        price: 299900,
        category: 'electronics',
        description: 'Test description',
        featured: false,
        inStock: true,
        rating: 0,
        reviews: 0,
        images: '["/api/placeholder/600/800/test"]',
        material: null,
        care: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        badges: '[]',
        sellerId: 'mock-seller-id'
      },
      {
        id: '2',
        title: 'Test Product 2',
        price: 499900,
        category: 'fashion',
        description: 'Another test product',
        featured: true,
        inStock: true,
        rating: 0,
        reviews: 0,
        images: '["/api/placeholder/600/800/test2"]',
        material: 'Cotton',
        care: 'Machine wash',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'approved',
        badges: '["HOT"]',
        sellerId: 'mock-seller-id'
      }
    ];

    return NextResponse.json({
      success: true,
      products: mockProducts
    });

  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test products' },
      { status: 500 }
    );
  }
}
