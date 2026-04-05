import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    // Get all products with detailed info
    const result = await client.query(`
      SELECT 
        id,
        title,
        price,
        category,
        description,
        featured,
        in_stock,
        rating,
        reviews,
        images,
        material,
        care,
        status,
        badges,
        seller_id,
        created_at,
        updated_at
      FROM products 
      ORDER BY created_at DESC
    `);
    
    client.release();
    
    // Format the response
    const products = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description,
      featured: row.featured,
      inStock: row.in_stock,
      rating: row.rating,
      reviews: row.reviews,
      images: row.images,
      material: row.material,
      care: row.care,
      status: row.status,
      badges: row.badges,
      sellerId: row.seller_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    // Get statistics
    const stats = {
      total: products.length,
      approved: products.filter(p => p.status === 'approved').length,
      pending: products.filter(p => p.status === 'pending').length,
      rejected: products.filter(p => p.status === 'rejected').length,
      totalValue: products.reduce((sum, p) => sum + p.price, 0),
      categories: [...new Set(products.map(p => p.category))].length
    };
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        stats,
        database: 'ecommerce_marketplace',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        database: 'ecommerce_marketplace'
      },
      { status: 500 }
    );
  } finally {
    // Don't end pool here as it might be used elsewhere
  }
}
