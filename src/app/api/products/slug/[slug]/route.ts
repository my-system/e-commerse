// API untuk mendapatkan detail produk berdasarkan slug
import { NextRequest, NextResponse } from 'next/server';
import { PendingDatabaseService, MarketplaceDatabaseService, BackupDatabaseService } from '@/lib/tri-database-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    console.log(`🔍 Fetching product by slug: ${slug}`);
    
    // Fungsi untuk generate slug dari title
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };
    
    // Cari produk di ketiga database berdasarkan prioritas
    let product = null;
    let source = '';
    
    // Priority 1: Database B (Marketplace) - produk yang disetujui
    try {
      const marketplaceProducts = await MarketplaceDatabaseService.getMarketplaceProducts();
      product = marketplaceProducts.find(p => {
        const productSlug = generateSlug(p.title);
        return productSlug === slug || ('slug' in p && p.slug === slug);
      });
      if (product) {
        source = 'marketplace';
        console.log(`✅ Product found in Database B (Marketplace): ${product.title}`);
      }
    } catch (error) {
      console.error('Error checking marketplace database:', error);
    }
    
    // Priority 2: Database A (Pending) - produk menunggu approval
    if (!product) {
      try {
        const pendingProducts = await PendingDatabaseService.getPendingProducts();
        product = pendingProducts.find(p => {
          const productSlug = generateSlug(p.title);
          return productSlug === slug || ('slug' in p && p.slug === slug);
        });
        if (product) {
          source = 'pending';
          console.log(`✅ Product found in Database A (Pending): ${product.title}`);
        }
      } catch (error) {
        console.error('Error checking pending database:', error);
      }
    }
    
    // Priority 3: Database C (Backup) - fallback
    if (!product) {
      try {
        const backupProducts = await BackupDatabaseService.getAllBackupProducts();
        product = backupProducts.find(p => {
          const productSlug = generateSlug(p.title);
          return productSlug === slug || p.slug === slug;
        });
        if (product) {
          source = 'backup';
          console.log(`✅ Product found in Database C (Backup): ${product.title}`);
        }
      } catch (error) {
        console.error('Error checking backup database:', error);
      }
    }
    
    if (!product) {
      console.log(`❌ Product not found in any database for slug: ${slug}`);
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        message: 'Produk tidak ditemukan di database manapun'
      }, { status: 404 });
    }
    
    // Format produk untuk frontend
    const formattedProduct = {
      id: product.id,
      title: product.title,
      name: product.title,
      slug: generateSlug(product.title), // Generate slug untuk konsistensi
      price: Number(product.price) || 0,
      originalPrice: Number(product.price) * 1.2, // dummy original price
      discount_price: ('discount_price' in product) ? Number(product.discount_price) : null,
      description: product.description || 'Tidak ada deskripsi tersedia',
      category: product.category || 'General',
      rating: Number(product.rating) || 0,
      reviews: Number(product.reviews) || 0,
      inStock: product.inStock !== false,
      stock: ('stock' in product) ? Number(product.stock) : null,
      status: product.status,
      sellerId: product.sellerId,
      images: Array.isArray(product.images) ? product.images : 
               typeof product.images === 'string' ? JSON.parse(product.images || '[]') : [],
      featured: product.featured || false,
      material: product.material || '',
      care: product.care || '',
      badges: Array.isArray(product.badges) ? product.badges : 
              typeof product.badges === 'string' ? JSON.parse(product.badges || '[]') : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      source,
      
      // Variants handling
      variants: {
        sizes: ('sizes' in product) ? product.sizes : [],
        colors: ('colors' in product) ? product.colors : []
      },
      
      // Additional features untuk compatibility
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
        'Updated': new Date(product.updatedAt).toLocaleDateString('id-ID'),
        ...(product && 'specifications' in product ? (product as any).specifications : {})
      }
    };
    
    // Log info
    console.log(`📦 Product retrieved by slug successfully:`);
    console.log(`   - Slug: ${slug}`);
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
    console.error('❌ Error fetching product by slug:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Gagal mengambil detail produk berdasarkan slug'
    }, { status: 500 });
  }
}
