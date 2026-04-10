import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    
    let whereClause: any = {};
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    
    if (featured === 'true') {
      whereClause.featured = true;
    }
    
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        sizes: true,
        colors: true,
        specs: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]')
      })),
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}

// POST - Create new product (dengan otomatis slug dari middleware)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi required fields
    const requiredFields = ['title', 'price', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `${field} is required` 
          },
          { status: 400 }
        );
      }
    }
    
    // Prepare product data
    const productData = {
      title: body.title,
      price: parseFloat(body.price),
      category: body.category,
      description: body.description || null,
      featured: body.featured || false,
      inStock: body.inStock !== undefined ? body.inStock : true,
      rating: body.rating || 0,
      images: JSON.stringify(body.images || []),
      material: body.material || null,
      care: body.care || null,
      sellerId: body.sellerId || null,
      status: body.status || 'PENDING',
      // Slug akan otomatis dibuat oleh middleware!
    };
    
    // Middleware Prisma akan otomatis membuat slug dari title
    const newProduct = await prisma.product.create({
      data: productData,
      include: {
        sizes: true,
        colors: true,
        specs: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Jika ada sizes, tambahkan ke database
    if (body.sizes && Array.isArray(body.sizes)) {
      for (const size of body.sizes) {
        await prisma.productSize.create({
          data: {
            name: size.name,
            value: size.value || size.name,
            inStock: size.inStock !== undefined ? size.inStock : true,
            productId: newProduct.id
          }
        });
      }
    }
    
    // Jika ada colors, tambahkan ke database
    if (body.colors && Array.isArray(body.colors)) {
      for (const color of body.colors) {
        await prisma.productColor.create({
          data: {
            name: color.name,
            value: color.value || color.hex || color.name,
            inStock: color.inStock !== undefined ? color.inStock : true,
            productId: newProduct.id
          }
        });
      }
    }
    
    // Jika ada specs, tambahkan ke database
    if (body.specs && typeof body.specs === 'object') {
      for (const [key, value] of Object.entries(body.specs)) {
        await prisma.productSpec.create({
          data: {
            key,
            value: String(value),
            productId: newProduct.id
          }
        });
      }
    }
    
    // Fetch product dengan semua relasi
    const completeProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        sizes: true,
        colors: true,
        specs: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      product: {
        ...completeProduct,
        images: JSON.parse(completeProduct?.images || '[]')
      },
      message: 'Product created successfully with auto-generated slug!'
    });
    
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint error untuk slug
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A product with this slug already exists. Please try a different title.' 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create product' 
      },
      { status: 500 }
    );
  }
}
