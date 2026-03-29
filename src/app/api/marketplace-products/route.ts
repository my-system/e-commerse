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
