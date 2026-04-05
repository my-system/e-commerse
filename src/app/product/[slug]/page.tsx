"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/ui/ProductGallery';
import ProductInfo from '@/components/ui/ProductInfo';
import ProductCard from '@/components/ui/ProductCard';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ArrowLeft } from 'lucide-react';

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<{
    size?: string;
    color?: string;
    quantity: number;
  }>({ quantity: 1 });

  // Fetch product by slug
  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch product by slug from API
        const response = await fetch(`/api/products/slug/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.product) {
            console.log('✅ Product found by slug:', data.product);
            setProduct(data.product);
            
            // Fetch related products
            await fetchRelatedProducts(data.product.category, data.product.id);
            setIsLoading(false);
            return;
          }
        }
        
        console.log('❌ Product not found by slug, trying ID fallback...');
        
        // Fallback: try to find by ID if slug matches ID pattern
        const idResponse = await fetch(`/api/products/${slug}`);
        if (idResponse.ok) {
          const data = await idResponse.json();
          if (data.success && data.product) {
            console.log('✅ Product found by ID fallback:', data.product);
            setProduct(data.product);
            await fetchRelatedProducts(data.product.category, data.product.id);
            setIsLoading(false);
            return;
          }
        }
        
        console.log('❌ Product not found anywhere');
        setProduct(null);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchProductBySlug();
    }
  }, [slug]);

  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      const response = await fetch(`/api/products?category=${category}&limit=6`);
      if (response.ok) {
        const data = await response.json();
        const related = data.data?.filter((p: Product) => p.id !== currentProductId).slice(0, 4) || [];
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const cartItem = {
      id: `${product.id}-${selectedVariant.size || 'default'}-${selectedVariant.color || 'default'}`,
      productId: product.id,
      title: product.title,
      price: product.discount_price || product.price,
      image: product.images[0],
      quantity: selectedVariant.quantity,
      variant: {
        size: selectedVariant.size,
        color: selectedVariant.color,
      },
      slug: product.slug
    };
    
    addItem(cartItem);
    
    // Show success message
    alert(`${product.title} x${selectedVariant.quantity} ditambahkan ke keranjang!`);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    setWishlist(prev => 
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleQuickView = (relatedProduct: Product) => {
    router.push(`/product/${relatedProduct.slug}`);
  };

  const handleRelatedAddToCart = (relatedProduct: Product) => {
    const cartItem = {
      id: relatedProduct.id,
      productId: relatedProduct.id,
      title: relatedProduct.title,
      price: relatedProduct.price,
      image: relatedProduct.images[0],
      quantity: 1,
      slug: relatedProduct.slug
    };
    
    addItem(cartItem);
    console.log('Added to cart:', relatedProduct.title);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 rounded-lg aspect-square" />
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
              <p className="text-gray-600 mb-8">Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/marketplace')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Kembali ke Shop
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button
              onClick={() => router.push('/')}
              className="hover:text-gray-700 transition-colors duration-200"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => router.push('/marketplace')}
              className="hover:text-gray-700 transition-colors duration-200"
            >
              Shop
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/category/${product.category}`)}
              className="hover:text-gray-700 transition-colors duration-200"
            >
              {product.category}
            </button>
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

            {/* Variant Selectors */}
            <div className="space-y-4">
              {/* Size Selector */}
              {product.variants?.sizes && product.variants.sizes.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">Ukuran</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedVariant(prev => ({ ...prev, size: size.name }))}
                        disabled={!size.inStock}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors duration-200 ${
                          selectedVariant.size === size.name
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : size.inStock
                            ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color Selector */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">Warna</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedVariant(prev => ({ ...prev, color: color.name }))}
                        disabled={!color.inStock}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          selectedVariant.color === color.name
                            ? 'border-blue-600 ring-2 ring-blue-200'
                            : color.inStock
                            ? 'border-gray-300 hover:border-gray-400'
                            : 'border-gray-200 cursor-not-allowed opacity-50'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {!color.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-500 transform rotate-45" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">Jumlah</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedVariant(prev => ({ 
                    ...prev, 
                    quantity: Math.max(1, prev.quantity - 1) 
                  }))}
                  disabled={!product.inStock || selectedVariant.quantity <= 1}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">
                  {selectedVariant.quantity}
                </span>
                <button
                  onClick={() => setSelectedVariant(prev => ({ 
                    ...prev, 
                    quantity: prev.quantity + 1 
                  }))}
                  disabled={!product.inStock}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Beli Sekarang
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.includes(product.id) ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
            </button>

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
                  product={relatedProduct}
                  onQuickView={handleQuickView}
                  onAddToCart={handleRelatedAddToCart}
                  onToggleWishlist={() => {}}
                  isWishlisted={false}
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
