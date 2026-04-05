// API untuk mendapatkan detail produk dari 3-Database System
import { NextRequest, NextResponse } from 'next/server';
import { PendingDatabaseService, MarketplaceDatabaseService, BackupDatabaseService } from '@/lib/tri-database-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    console.log(`🔍 Fetching product detail for ID: ${productId}`);
    
    // Cari produk di ketiga database berdasarkan prioritas
    let product = null;
    let source = '';
    
    // Priority 1: Database B (Marketplace) - produk yang disetujui
    try {
      const marketplaceProducts = await MarketplaceDatabaseService.getMarketplaceProducts();
      product = marketplaceProducts.find(p => p.id === productId);
      if (product) {
        source = 'marketplace';
        console.log(`✅ Product found in Database B (Marketplace): ${productId}`);
      }
    } catch (error) {
      console.error('Error checking marketplace database:', error);
    }
    
    // Priority 2: Database A (Pending) - produk menunggu approval
    if (!product) {
      try {
        const pendingProducts = await PendingDatabaseService.getPendingProducts();
        product = pendingProducts.find(p => p.id === productId);
        if (product) {
          source = 'pending';
          console.log(`✅ Product found in Database A (Pending): ${productId}`);
        }
      } catch (error) {
        console.error('Error checking pending database:', error);
      }
    }
    
    // Priority 3: Database C (Backup) - fallback
    if (!product) {
      try {
        const backupProducts = await BackupDatabaseService.getAllBackupProducts();
        product = backupProducts.find(p => p.id === productId);
        if (product) {
          source = 'backup';
          console.log(`✅ Product found in Database C (Backup): ${productId}`);
        }
      } catch (error) {
        console.error('Error checking backup database:', error);
      }
    }
    
    if (!product) {
      console.log(`❌ Product not found in any database: ${productId}`);
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        message: 'Product tidak ditemukan di database manapun'
      }, { status: 404 });
    }
    
    // Format produk untuk frontend
    const formattedProduct = {
      id: product.id,
      title: product.title,
      name: product.title, // untuk compatibility dengan existing frontend
      price: product.price,
      originalPrice: product.price * 1.2, // dummy original price
      description: product.description || 'Tidak ada deskripsi tersedia',
      category: product.category,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      inStock: product.inStock !== false,
      status: product.status,
      sellerId: product.sellerId,
      images: JSON.parse(product.images || '[]'),
      featured: product.featured || false,
      material: product.material || '',
      care: product.care || '',
      badges: JSON.parse(product.badges || '[]'),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      source, // tambahkan info source database
      // Add dummy features dan specifications untuk compatibility
      features: [
        'High quality product',
        'Fast shipping available',
        'Secure payment',
        'Customer support'
      ],
      specifications: {
        'Category': product.category || 'General',
        'Material': product.material || 'Standard',
        'Seller ID': product.sellerId || 'Unknown',
        'Status': product.status || 'pending',
        'Created': new Date(product.createdAt).toLocaleDateString('id-ID'),
        'Updated': new Date(product.updatedAt).toLocaleDateString('id-ID')
      }
    };
    
    // Log info
    console.log(`📦 Product detail retrieved successfully:`);
    console.log(`   - ID: ${formattedProduct.id}`);
    console.log(`   - Title: ${formattedProduct.title}`);
    console.log(`   - Source: ${source}`);
    console.log(`   - Status: ${formattedProduct.status}`);
    console.log(`   - Images: ${formattedProduct.images.length}`);
    
    return NextResponse.json({
      success: true,
      product: formattedProduct,
      source,
      message: `Product retrieved from ${source} database`
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching product detail:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Gagal mengambil detail produk'
    }, { status: 500 });
  }
}
