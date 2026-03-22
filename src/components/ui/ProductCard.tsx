"use client";

import { useState } from 'react';
import { Product } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  onClick?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { trackProductView, addToCart, removeFromCart } = useUserPreferences();

  const handleCardClick = () => {
    trackProductView(product.id);
    onClick?.(product);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddToCart?.(product);
    addToCart(product.id);
    setIsLoading(false);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleQuickView}
            className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200 transform hover:scale-110"
            title="Quick View"
          >
            <Eye className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-3 rounded-full transition-colors duration-200 transform hover:scale-110 ${
              isWishlisted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white hover:bg-gray-100'
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'text-white' : 'text-gray-800'}`} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5 text-white" />
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

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-6">
        {/* Category */}
        <div className="text-sm text-gray-500 mb-2 capitalize">
          {product.category}
        </div>
        
        {/* Product Name */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.title}
        </h3>
        
        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg sm:text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Menambah...' : 'Tambah ke Keranjang'}
          </button>
          <button
            onClick={handleQuickView}
            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
