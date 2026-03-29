import { NextRequest, NextResponse } from 'next/server';

// Direct PostgreSQL connection
async function queryDatabase(query: string, params: any[] = []) {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if products table exists
    const tableCheck = await queryDatabase(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Products table does not exist, creating...');
      
      // Create tables
      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS sellers (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'seller',
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        );
      `);

      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(255) NOT NULL,
          description TEXT,
          featured BOOLEAN DEFAULT false,
          instock BOOLEAN DEFAULT true,
          rating DECIMAL(3,2) DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          images TEXT DEFAULT '[]',
          material VARCHAR(255),
          care VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          badges TEXT DEFAULT '[]',
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW(),
          sellerId VARCHAR(255) NOT NULL,
          FOREIGN KEY (sellerId) REFERENCES sellers(id)
        );
      `);

      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS product_sizes (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          value VARCHAR(255) NOT NULL,
          instock BOOLEAN DEFAULT true,
          "productId" VARCHAR(255) NOT NULL,
          FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
        );
      `);

      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS product_colors (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          value VARCHAR(255) NOT NULL,
          instock BOOLEAN DEFAULT true,
          "productId" VARCHAR(255) NOT NULL,
          FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
        );
      `);

      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS product_specs (
          id VARCHAR(255) PRIMARY KEY,
          key VARCHAR(255) NOT NULL,
          value TEXT NOT NULL,
          "productId" VARCHAR(255) NOT NULL,
          FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
        );
      `);

      // Insert default seller
      await queryDatabase(`
        INSERT INTO sellers (id, name, email, phone)
        VALUES ('mock-seller-id', 'Test Seller', 'seller@test.com', '1234567890')
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log('Tables created successfully');
    }

    const result = await queryDatabase(`
      SELECT 
        p.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ps.id,
              'name', ps.name,
              'value', ps.value,
              'inStock', ps.instock
            )
          ) FILTER (WHERE ps.id IS NOT NULL), 
          '[]'
        ) as sizes,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', pc.id,
              'name', pc.name,
              'value', pc.value,
              'inStock', pc.instock
            )
          ) FILTER (WHERE pc.id IS NOT NULL),
          '[]'
        ) as colors,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', psec.id,
              'key', psec.key,
              'value', psec.value
            )
          ) FILTER (WHERE psec.id IS NOT NULL),
          '[]'
        ) as specifications
      FROM products p
      LEFT JOIN product_sizes ps ON p.id = ps."productId"
      LEFT JOIN product_colors pc ON p.id = pc."productId"
      LEFT JOIN product_specs psec ON p.id = psec."productId"
      GROUP BY p.id
      ORDER BY p."createdAt" DESC
    `);

    const products = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description,
      featured: row.featured,
      inStock: row.instock,
      rating: parseFloat(row.rating),
      reviews: row.reviews,
      images: JSON.parse(row.images || '[]'),
      material: row.material,
      care: row.care,
      status: row.status,
      badges: JSON.parse(row.badges || '[]'),
      sellerId: row.sellerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      sizes: Array.isArray(row.sizes) ? row.sizes.filter((s: any) => s.id) : [],
      colors: Array.isArray(row.colors) ? row.colors.filter((c: any) => c.id) : [],
      specifications: Array.isArray(row.specifications) 
        ? row.specifications.reduce((acc: any, spec: any) => {
            if (spec.id) {
              acc[spec.key] = spec.value;
            }
            return acc;
          }, {}) 
        : {}
    }));

    return NextResponse.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Error in GET /api/products/database:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Start transaction
    const client = require('pg').Client;
    const pgClient = new client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await pgClient.connect();
    await pgClient.query('BEGIN');

    try {
      // Insert main product
      const productResult = await pgClient.query(`
        INSERT INTO products (
          title, price, category, description, featured, instock, 
          rating, reviews, images, material, care, status, badges, sellerId
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        body.title,
        parseFloat(body.price),
        body.category,
        body.description,
        body.featured || false,
        body.inStock !== false,
        0,
        0,
        JSON.stringify(body.images || []),
        body.material,
        body.care,
        'pending',
        JSON.stringify(body.badges || []),
        'mock-seller-id'
      ]);

      const productId = productResult.rows[0].id;

      // Insert sizes if provided
      if (body.sizes && body.sizes.length > 0) {
        for (const size of body.sizes) {
          await pgClient.query(`
            INSERT INTO product_sizes (id, name, value, instock, "productId")
            VALUES ($1, $2, $3, $4, $5)
          `, [size.id, size.name, size.value, size.inStock, productId]);
        }
      }

      // Insert colors if provided
      if (body.colors && body.colors.length > 0) {
        for (const color of body.colors) {
          await pgClient.query(`
            INSERT INTO product_colors (id, name, value, instock, "productId")
            VALUES ($1, $2, $3, $4, $5)
          `, [color.id, color.name, color.value, color.inStock, productId]);
        }
      }

      // Insert specifications if provided
      if (body.specifications && Object.keys(body.specifications).length > 0) {
        for (const [key, value] of Object.entries(body.specifications)) {
          await pgClient.query(`
            INSERT INTO product_specs (id, key, value, "productId")
            VALUES ($1, $2, $3, $4)
          `, [`${productId}-spec-${key}`, key, value, productId]);
        }
      }

      await pgClient.query('COMMIT');

      // Fetch the complete product
      const completeResult = await pgClient.query(`
        SELECT 
          p.*,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ps.id,
              'name', ps.name,
              'value', ps.value,
              'inStock', ps.inStock
            )
          ) FILTER (WHERE ps.id IS NOT NULL) as sizes,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', pc.id,
              'name', pc.name,
              'value', pc.value,
              'inStock', pc.inStock
            )
          ) FILTER (WHERE pc.id IS NOT NULL) as colors,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', psec.id,
              'key', psec.key,
              'value', psec.value
            )
          ) FILTER (WHERE psec.id IS NOT NULL) as specifications
        FROM products p
        LEFT JOIN product_sizes ps ON p.id = ps."productId"
        LEFT JOIN product_colors pc ON p.id = pc."productId"
        LEFT JOIN product_specs psec ON p.id = psec."productId"
        WHERE p.id = $1
        GROUP BY p.id
      `, [productId]);

      const product = completeResult.rows[0];
      const formattedProduct = {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        category: product.category,
        description: product.description,
        featured: product.featured,
        inStock: product.instock,
        rating: parseFloat(product.rating),
        reviews: product.reviews,
        images: JSON.parse(product.images || '[]'),
        material: product.material,
        care: product.care,
        status: product.status,
        badges: JSON.parse(product.badges || '[]'),
        sellerId: product.sellerId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        sizes: product.sizes.filter((s: any) => s.id) || [],
        colors: product.colors.filter((c: any) => c.id) || [],
        specifications: product.specifications.reduce((acc: any, spec: any) => {
          if (spec.id) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {}) || {}
      };

      return NextResponse.json({
        success: true,
        product: formattedProduct
      });

    } catch (error) {
      await pgClient.query('ROLLBACK');
      throw error;
    } finally {
      await pgClient.end();
    }

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
