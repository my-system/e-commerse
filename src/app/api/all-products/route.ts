// API to fetch ALL products from database regardless of status
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching ALL products from database...');
    
    // Fetch all products regardless of status
    const products = await prisma.product.findMany({
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
        status: true,
        createdAt: true,
        updatedAt: true,
        sellerId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${products.length} total products`);
    
    // Log status distribution
    const statusCount = products.reduce((acc: Record<string, number>, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {});
    console.log('Status distribution:', statusCount);
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      statusDistribution: statusCount,
      message: 'All products retrieved successfully'
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching all products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch all products' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
