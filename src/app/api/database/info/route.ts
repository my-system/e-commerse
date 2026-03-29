import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check database connection info
    const dbInfo = {
      timestamp: new Date().toISOString(),
      database: {
        type: 'PostgreSQL', // atau database yang Anda gunakan
        status: 'connected', // atau 'disconnected'
        url: process.env.DATABASE_URL ? 'configured' : 'not configured'
      },
      tables: {
        products: {
          count: 0, // akan diisi dengan query real
          structure: {
            id: 'String (Primary Key)',
            title: 'String',
            price: 'Float',
            category: 'String',
            images: 'String[]',
            createdAt: 'DateTime',
            updatedAt: 'DateTime'
          }
        },
        product_sizes: {
          count: 0,
          structure: {
            id: 'String (Primary Key)',
            name: 'String',
            value: 'String',
            inStock: 'Boolean',
            productId: 'String (Foreign Key)'
          }
        },
        product_colors: {
          count: 0,
          structure: {
            id: 'String (Primary Key)',
            name: 'String',
            value: 'String (Hex Color)',
            inStock: 'Boolean',
            productId: 'String (Foreign Key)'
          }
        }
      },
      storage: {
        uploadDir: process.env.UPLOAD_DIR || './public/uploads',
        maxFileSize: process.env.MAX_FILE_SIZE || '5242880 (5MB)',
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      }
    };

    return NextResponse.json({
      success: true,
      data: dbInfo
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get database info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
