import { NextRequest, NextResponse } from 'next/server';

async function queryDatabase(query: string, params: any[] = []) {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result;
  } finally {
    await client.end();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    // Update product status
    const result = await queryDatabase(`
      UPDATE products 
      SET status = 'approved', "updatedAt" = NOW()
      WHERE id = $1
      RETURNING *
    `, [productId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error approving product:', error);
    return NextResponse.json(
      { error: 'Failed to approve product' },
      { status: 500 }
    );
  }
}
