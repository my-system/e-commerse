"use client";

import { useState, memo } from 'react';
import Link from 'next/link';
// Product interface for real database data
interface Product {
  id: string;
  title: string;
  name?: string;
  price: number;
  images: string | string[];
  image?: string;
  category: string;
  description?: string;
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  slug?: string;
  sellerId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, Heart, X, Check } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import QuickViewModal from './QuickViewModal';
import OptimizedImage from './OptimizedImage';

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

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
  
  // Parse images from database (string) or use array
  const parsedImages = typeof product.images === 'string' 
    ? JSON.parse(product.images || '[]') 
    : (product.images || []);
  const firstImage = parsedImages[0] || product.image || '/placeholder.jpg';

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
      title: product.name || product.title,
      price: product.price,
      image: firstImage,
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
        image: firstImage
      });
      showNotification('wishlist', 'Added to Wishlist');
    }
    
    onToggleWishlist?.(product);
  };

  return (
    <div
      className={`group relative bg-white rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 ease-out ${
        isLoading ? 'pointer-events-none opacity-75' : ''
      }`}
      onMouseEnter={() => !isLoading && setIsHovered(true)}
      onMouseLeave={() => !isLoading && setIsHovered(false)}
      style={{ transform: 'none' }}
    >
      {/* Product Image - Clickable */}
      <Link href={`/product/${(product as any).slug || generateSlug(product.name || product.title || '')}`}>
        <div className="relative overflow-hidden bg-gray-50 cursor-pointer transition-opacity duration-300" style={{ aspectRatio: '1 / 1' }}>
          <OptimizedImage
            src={firstImage}
            alt={product.name || product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={true}
            disableIntersectionObserver={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
          />
          
          {/* Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-black text-white text-[9px] font-medium tracking-wider uppercase rounded-[6px] shadow-md">
                Hot
              </span>
            </div>
          )}

          {/* Wishlist Icon - Top Right */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-300 z-10"
          >
            <Heart className={`h-4 w-4 ${productInWishlist ? 'fill-current text-red-500' : 'text-gray-600'}`} />
          </button>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </Link>

      {/* Notification Toast */}
      {notification && (
        <div className={`absolute top-6 right-6 z-50 px-4 py-3 rounded-[12px] shadow-lg flex items-center gap-3 transition-all duration-300 ${
          notification.type === 'cart' 
            ? 'bg-black text-white' 
            : 'bg-black text-white'
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
      <div className="p-4 flex flex-col h-full bg-white relative">
        {/* Category */}
        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-[0.5px] font-light">
          {product.category}
        </div>
        
        {/* Product Name - Clickable */}
        <Link href={`/product/${(product as any).slug || generateSlug(product.name || product.title || '')}`}>
          <h3 className="text-sm font-medium text-[#2d3436] mb-2 line-clamp-2 cursor-pointer hover:text-black transition-colors duration-300 leading-tight">
            {product.name || product.title}
          </h3>
        </Link>
        
        {/* Price & Cart Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] text-gray-500 font-light">Rp</span>
            <span className="text-base font-semibold text-[#2d3436]">
              {formatPrice(product.price).replace('Rp', '')}
            </span>
          </div>
          
          {/* Cart Icon - Bottom Right */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Rating - Compact */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-xs text-gray-600 font-light">{product.rating || '4.8'}</span>
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
