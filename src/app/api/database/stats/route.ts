import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Database statistics
    const stats = {
      timestamp: new Date().toISOString(),
      database: {
        environment: process.env.NODE_ENV || 'development',
        url: process.env.DATABASE_URL ? 'configured' : 'not configured',
        provider: 'postgresql'
      },
      products: {
        total: 0, // akan diisi dengan query real
        featured: 0,
        byCategory: {
          fashion: 0,
          electronics: 0,
          home: 0,
          sports: 0,
          books: 0,
          other: 0
        },
        priceRanges: {
          under_100k: 0,
          between_100k_500k: 0,
          between_500k_1m: 0,
          over_1m: 0
        }
      },
      storage: {
        uploadedFiles: 0,
        totalSize: '0 MB',
        averageSize: '0 MB',
        fileTypes: {
          jpeg: 0,
          png: 0,
          webp: 0,
          gif: 0
        }
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get database statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
