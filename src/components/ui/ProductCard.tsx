"use client";

import { useState, memo } from 'react';
import { Product } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, Heart, X, Check } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import QuickViewModal from './QuickViewModal';
import OptimizedImage from './OptimizedImage';

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
  const [notification, setNotification] = useState<{ type: 'cart' | 'wishlist'; message: string } | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { trackProductView, addToCart, removeFromCart } = useUserPreferences();
  const { addItem } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlistState } = useWishlist();

  const productInWishlist = isInWishlist(product.id);

  const showNotification = (type: 'cart' | 'wishlist', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple clicks during loading
    if (isLoading) return;
    
    // Temporarily disable tracking to test if it causes reordering
    // try {
    //   trackProductView(product.id);
    // } catch (error) {
    //   console.warn('Failed to track product view:', error);
    // }
    
    // Let parent handle navigation if needed
    onClick?.(product);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    // Optimistic UI update
    showNotification('cart', 'Added to Cart');
    
    // Add to cart state
    addItem({
      id: Date.now().toString(), // Generate unique ID
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddToCart?.(product);
    addToCart(product.id);
    setIsLoading(false);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
    onQuickView?.(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (productInWishlist) {
      removeFromWishlistState(product.id);
      showNotification('wishlist', 'Removed from Wishlist');
    } else {
      addToWishlist({
        id: Date.now().toString(),
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0]
      });
      showNotification('wishlist', 'Added to Wishlist');
    }
    
    onToggleWishlist?.(product);
  };

  return (
    <div
      className={`group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
        isLoading ? 'pointer-events-none opacity-75' : ''
      }`}
      onMouseEnter={() => !isLoading && setIsHovered(true)}
      onMouseLeave={() => !isLoading && setIsHovered(false)}
      onClick={handleCardClick}
      style={{ transform: 'none' }}
    >
      {/* Product Image */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-100">
        <OptimizedImage
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full"
          priority={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
        />
        
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

      {/* Notification Toast */}
      {notification && (
        <div className={`absolute top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
          notification.type === 'cart' 
            ? 'bg-blue-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'cart' ? (
            <ShoppingCart className="h-4 w-4" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

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
            onClick={handleQuickView}
            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Menambah...' : 'Tambah ke Keranjang'}
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 ${
              productInWishlist 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${productInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
};

const ProductCardMemo = memo(ProductCard);
ProductCardMemo.displayName = 'ProductCard';

export { ProductCardMemo as ProductCard };
