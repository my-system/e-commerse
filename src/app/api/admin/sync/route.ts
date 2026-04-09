import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { products } from '@/data/products';

// Initialize Prisma Client
const prisma = new PrismaClient();

// GET - Sync products from dummy data to Neon database
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Starting product sync to Neon database...');
    
    // Check database connection
    await prisma.$connect();
    console.log('✅ Connected to Neon database');
    
    // Get current products count
    const existingCount = await prisma.product.count();
    console.log(`📊 Existing products in database: ${existingCount}`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    // Sync each product from dummy data
    for (const product of products) {
      try {
        // Convert images array to JSON string
        const imagesJson = JSON.stringify(product.images || []);
        
        // Upsert product (insert or update if exists)
        await prisma.product.upsert({
          where: { id: product.id },
          update: {
            title: product.title,
            price: product.price,
            category: product.category,
            description: product.description || null,
            featured: product.featured || false,
            inStock: product.inStock !== undefined ? product.inStock : true,
            rating: product.rating || 4.5,
            reviewCount: product.reviews || 0,
            images: imagesJson,
            material: product.material || null,
            care: product.care || null,
            // status: 'APPROVED', // Set to approved for marketplace visibility (temporarily removed)
            // sellerId: 'system-sync', // Temporarily removed
            updatedAt: new Date()
          },
          create: {
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            description: product.description || null,
            featured: product.featured || false,
            inStock: product.inStock !== undefined ? product.inStock : true,
            rating: product.rating || 4.5,
            reviewCount: product.reviews || 0,
            images: imagesJson,
            material: product.material || null,
            care: product.care || null,
            // status: 'APPROVED', // Set to approved for marketplace visibility (temporarily removed)
            // sellerId: 'system-sync', // Temporarily removed
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        syncedCount++;
        console.log(`✅ ${syncedCount}. ${product.title} - Rp ${product.price.toLocaleString('id-ID')}`);
        
      } catch (error) {
        console.error(`❌ Failed to sync ${product.title}:`, error);
        skippedCount++;
      }
    }
    
    // Verify sync results
    const finalCount = await prisma.product.count();
    const approvedCount = await prisma.product.count(); // Count all products (status field temporarily removed)
    
    console.log(`\n🎉 Sync completed!`);
    console.log(`📊 Sync Results:`);
    console.log(`   - Total dummy products: ${products.length}`);
    console.log(`   - Successfully synced: ${syncedCount}`);
    console.log(`   - Skipped/Failed: ${skippedCount}`);
    console.log(`   - Total products in database: ${finalCount}`);
    console.log(`   - Approved products: ${approvedCount}`);
    
    // Get sample of synced products
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        // status: true, // Temporarily removed
        featured: true,
        inStock: true,
        createdAt: true
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Product sync completed successfully',
      results: {
        totalDummyProducts: products.length,
        synced: syncedCount,
        skipped: skippedCount,
        totalInDatabase: finalCount,
        approvedProducts: approvedCount
      },
      sampleProducts: sampleProducts,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sync error:', error);
    
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('❌ Disconnect error:', disconnectError);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST - Force reset and resync all products
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Force resync requested...');
    
    await prisma.$connect();
    
    // Delete all existing products (optional - dangerous operation)
    const { force } = await request.json();
    
    if (force) {
      console.log('⚠️ Force reset - deleting all existing products...');
      await prisma.product.deleteMany({});
      console.log('🗑️ All products deleted');
    }
    
    // Sync products (same logic as GET)
    const syncResponse = await GET(request);
    const syncData = await syncResponse.json();
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: force ? 'Force resync completed' : 'Incremental sync completed',
      ...syncData
    });
    
  } catch (error) {
    console.error('❌ Force sync error:', error);
    
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('❌ Disconnect error:', disconnectError);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
