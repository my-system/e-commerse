"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount_price?: number;
  images: string[];
}

interface WishlistClientProps {
  product: Product;
}

export default function WishlistClient({ product }: WishlistClientProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isWishlisted) {
        removeItem(product.id);
      } else {
        addItem({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          title: product.title,
          price: product.discount_price || product.price,
          image: product.images[0]
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`p-3 rounded-lg border transition-colors duration-200 ${
        isWishlisted
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} 
      />
      {isLoading && (
        <span className="sr-only">Loading...</span>
      )}
    </button>
  );
}
