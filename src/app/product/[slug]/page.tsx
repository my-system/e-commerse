import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/ui/ProductGallery';
import ProductInfo from '@/components/ui/ProductInfo';
import ProductCard from '@/components/ui/ProductCard';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductActionsWrapper from '@/components/client/ProductActionsWrapper';
import BuyNowClient from '@/components/client/BuyNowClient';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount_price?: number;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock?: number;
  images: string[];
  featured: boolean;
  material?: string;
  care?: string;
  specifications?: Record<string, string>;
  variants?: {
    sizes?: Array<{ id: string; name: string; price: number; inStock: boolean }>;
    colors?: Array<{ id: string; name: string; value: string; inStock: boolean }>;
  };
  sellerId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.'
    };
  }

  return {
    title: product.title,
    description: product.description?.substring(0, 160) || `Buy ${product.title} at ${formatPrice(product.price)}`,
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 160) || `Buy ${product.title} at ${formatPrice(product.price)}`,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

// Fetch product by slug from database
async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    let product = null;
    
    // First try to find by slug field
    product = await prisma.product.findUnique({
      where: { slug },
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
    
    // If not found by slug, try to find by exact title match
    if (!product) {
      // Generate common title variations from slug
      // "test-product-admin" -> ["Test Product Admin", "test product admin"]
      const titleVariations = [
        slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Title Case
        slug.replace(/-/g, ' '), // Lowercase with spaces
        slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toLowerCase()) // Sentence case
      ];
      
      // Try each variation with direct findFirst (more efficient than findMany)
      for (const titleVariation of titleVariations) {
        product = await prisma.product.findFirst({
          where: {
            title: titleVariation
          },
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
        
        if (product) break; // Found it, stop searching
      }
      
      // If still not found, try a more flexible search as last resort
      if (!product) {
        product = await prisma.product.findFirst({
          where: {
            title: {
              contains: slug.replace(/-/g, ' '),
              mode: 'insensitive'
            }
          },
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
      }
    }

    if (!product) {
      return null;
    }

    // Transform database product to expected format
    return {
      id: product.id,
      title: product.title,
      name: product.title,
      slug: product.slug || '',
      price: product.price,
      discount_price: undefined, // Not available in current schema
      description: product.description || '',
      category: product.category,
      rating: product.rating,
      reviews: product.reviewCount,
      inStock: product.inStock,
      images: JSON.parse(product.images || '[]'),
      featured: product.featured,
      material: product.material || undefined,
      care: product.care || undefined,
      variants: {
        sizes: product.sizes.map(size => ({
          id: size.id,
          name: size.name,
          price: product.price,
          inStock: size.inStock
        })),
        colors: product.colors.map(color => ({
          id: color.id,
          name: color.name,
          value: color.value,
          inStock: color.inStock
        }))
      },
      sellerId: product.sellerId || undefined,
      status: product.status || 'PENDING',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Fetch related products
async function getRelatedProducts(category: string, currentProductId: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        status: 'APPROVED',
        id: { not: currentProductId }
      },
      take: 4,
      include: {
        sizes: true,
        colors: true
      }
    });

    return products.map(product => ({
      id: product.id,
      title: product.title,
      name: product.title,
      slug: product.slug || '',
      price: product.price,
      discount_price: undefined, // Not available in current schema
      description: product.description || '',
      category: product.category,
      rating: product.rating,
      reviews: product.reviewCount,
      inStock: product.inStock,
      images: JSON.parse(product.images || '[]'),
      featured: product.featured,
      material: product.material || undefined,
      care: product.care || undefined,
      variants: {
        sizes: product.sizes.map(size => ({
          id: size.id,
          name: size.name,
          price: product.price,
          inStock: size.inStock
        })),
        colors: product.colors.map(color => ({
          id: color.id,
          name: color.name,
          value: color.value,
          inStock: color.inStock
        }))
      },
      sellerId: product.sellerId || undefined,
      status: product.status || 'PENDING',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Main page component
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const relatedProducts = await getRelatedProducts(product?.category || '', product?.id || '');

  // Product not found
  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-gray-700 transition-colors duration-200"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/marketplace"
              className="hover:text-gray-700 transition-colors duration-200"
            >
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-gray-700 transition-colors duration-200"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery - Left Side */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.title}
            />
          </div>

          {/* Product Info - Right Side */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    HOT
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} ulasan)
                  </span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.discount_price || product.price)}
              </span>
              {product.discount_price && product.discount_price < product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                product.inStock ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                product.inStock ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.inStock ? 'Tersedia' : 'Habis'}
              </span>
              {product.stock && (
                <span className="text-sm text-gray-500">
                  ({product.stock} unit tersedia)
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">
                {product.description.length > 200 
                  ? `${product.description.substring(0, 200)}...`
                  : product.description
                }
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <ProductActionsWrapper 
                product={product}
              />
              
              <BuyNowClient 
                product={product}
                disabled={!product.inStock}
              />
            </div>

{/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Pengiriman Gratis</div>
                    <div className="text-xs text-gray-500">Minimal pembelian Rp 500.000</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Garansi 30 Hari</div>
                    <div className="text-xs text-gray-500">Pengembalian mudah</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Otentik 100%</div>
                    <div className="text-xs text-gray-500">Produk asli</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deskripsi Produk</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          {/* Product Specifications */}
          {(product.material || product.specifications) && (
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spesifikasi Produk</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.material && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Material:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.material}</span>
                  </div>
                )}
                
                {product.care && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Perawatan:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.care}</span>
                  </div>
                )}
                
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                    <span className="text-sm text-gray-600 ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct as any}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
