"use client";

import { getValidProducts, Product } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, Heart, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Toast } from '@/components/ui/Toast';

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { addItem, openCart } = useCart();

  const validProducts = getValidProducts();
  const featuredProducts = validProducts.filter((product: Product) => product.featured).slice(0, 8);

  const handleAddToCart = async (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAddingToCart(product.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      addItem({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      });
      
      // Show success feedback
      setToast({ message: `${product.title} ditambahkan ke keranjang!`, type: 'success' });
      
      // Optionally open cart after adding
      setTimeout(() => {
        openCart();
      }, 300);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      const product = featuredProducts.find(p => p.id === productId);
      
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        setToast({ message: 'Dihapus dari wishlist', type: 'info' });
      } else {
        newWishlist.add(productId);
        setToast({ message: 'Ditambahkan ke wishlist!', type: 'success' });
      }
      return newWishlist;
    });
  };

  const handleQuickView = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleProductClick = (product: Product) => {
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Produk Unggulan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi terbaik kami yang dipilih dengan hati-hati untuk Anda
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={`featured-${product.id}`} // Pastikan key unik dan stabil
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                <OptimizedImage
                  src={product.images?.[0] || '/placeholder.jpg'}
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
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    HOT
                  </span>
                </div>
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
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 font-['Inter']">4.8</span>
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
                    src={quickViewProduct.images?.[0] || '/placeholder.jpg'}
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
                      {wishlist.has(quickViewProduct.id) ? '❤️ Di Wishlist' : '🤍 Tambah Wishlist'}
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
