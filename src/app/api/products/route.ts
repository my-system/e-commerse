import { NextRequest, NextResponse } from 'next/server';
import FileDatabaseService from '@/lib/file-database';

// Mock database - dalam production gunakan database sebenarnya
// let products: Product[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let products;
    
    if (category) {
      products = await FileDatabaseService.getProductsByCategory(category);
    } else if (search) {
      products = await FileDatabaseService.searchProducts(search);
    } else {
      products = await FileDatabaseService.getProducts();
    }
    
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
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
    const product = await FileDatabaseService.addProduct(body);
    
    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
