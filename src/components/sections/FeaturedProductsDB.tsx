"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, X, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice } from '@/lib/utils';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Toast } from '@/components/ui/Toast';

interface Product {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  category: string;
  description?: string;
  images: string | string[];
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  material?: string;
  care?: string;
  slug?: string;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function FeaturedProductsDB() {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Fetch featured products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/marketplace-products?featured=true&limit=8');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to empty array
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Parse images from string or array
  const parseImages = (images: string | string[]): string[] => {
    if (typeof images === 'string') {
      try {
        return JSON.parse(images);
      } catch {
        return [images];
      }
    }
    return images;
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (addingToCart === product.id) return;
    
    setAddingToCart(product.id);
    
    try {
      await addItem({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: product.discount_price || product.price,
        image: parseImages(product.images)?.[0] || '/placeholder.jpg',
        quantity: 1
      });
      
      setToast({
        message: `${product.title} ditambahkan ke keranjang`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Gagal menambahkan ke keranjang',
        type: 'error'
      });
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle toggle wishlist
  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (wishlist.has(productId)) {
      removeFromWishlist(productId);
      setWishlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } else {
      addToWishlist({
        id: `${productId}-${Date.now()}`,
        productId: productId,
        title: products.find(p => p.id === productId)?.title || '',
        price: products.find(p => p.id === productId)?.price || 0,
        image: parseImages(products.find(p => p.id === productId)?.images || '')?.[0] || '/placeholder.jpg'
      });
      setWishlist(prev => new Set(prev).add(productId));
    }
  };

  // Handle quick view
  const handleQuickView = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuickViewProduct(product);
  };

  // Close quick view
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    // Navigate to product detail page
    window.location.href = `/product/${product.slug || product.id}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Produk Unggulan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan koleksi terbaik kami yang telah dipilih secara khusus untuk Anda
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <OptimizedImage
                  src={parseImages(product.images)?.[0] || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                  priority={false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  fallback="/placeholder.jpg"
                />
                
                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button 
                    onClick={(e) => handleQuickView(product, e)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 transform hover:scale-110 shadow-lg"
                    title="Quick View"
                  >
                    <Eye className="h-5 w-5 text-gray-800" />
                  </button>
                  <button 
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 transform hover:scale-110 shadow-lg ${
                      wishlist.has(product.id) 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    title={wishlist.has(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`h-5 w-5 ${
                      wishlist.has(product.id) ? 'text-white' : 'text-gray-800'
                    }`} />
                  </button>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product.id}
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    title="Add to Cart"
                  >
                    {addingToCart === product.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <ShoppingCart className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Badge */}
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      HOT
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category */}
                <div className="text-sm text-gray-500 mb-2 capitalize font-['Inter']">
                  {product.category}
                </div>
               
                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 font-['Inter']">
                  {product.title}
                </h3>
               
                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900 font-['Inter']">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">Star</span>
                    <span className="text-sm text-gray-600 font-['Inter']">{product.rating || '4.8'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product.id}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter']"
                  >
                    {addingToCart === product.id ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                  </button>
                  <button 
                    onClick={(e) => handleQuickView(product, e)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-['Inter']"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            href="/marketplace"
            className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
                <button 
                  onClick={closeQuickView}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={parseImages(quickViewProduct.images)?.[0] || '/placeholder.jpg'}
                    alt={quickViewProduct.title}
                    className="w-full h-full"
                    priority={true}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    fallback="/placeholder.jpg"
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {quickViewProduct.title}
                  </h3>
                  
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {formatPrice(quickViewProduct.price)}
                  </div>

                  <p className="text-gray-600 mb-6">
                    {quickViewProduct.description}
                  </p>

                  {/* Product Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Material</h4>
                      <p className="text-gray-600">{quickViewProduct.material || 'Premium Quality'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
                      <p className="text-gray-600">{quickViewProduct.care || 'Machine wash cold'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => handleAddToCart(quickViewProduct, e)}
                      disabled={addingToCart === quickViewProduct.id}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart === quickViewProduct.id ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </button>
                    <button 
                      onClick={(e) => handleToggleWishlist(quickViewProduct.id, e)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        wishlist.has(quickViewProduct.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {wishlist.has(quickViewProduct.id) ? 'Heart Di Wishlist' : 'Heart Tambah Wishlist'}
                    </button>
                  </div>

                  {/* View Full Details Button */}
                  <button 
                    onClick={() => {
                      closeQuickView();
                      handleProductClick(quickViewProduct);
                    }}
                    className="w-full mt-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Lihat Detail Produk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
