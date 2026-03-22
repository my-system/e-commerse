"use client";

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Clock, Heart } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { RecommendationEngine } from '@/lib/recommendationEngine';
import { products } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/contexts/CartContext';

export default function PersonalizedRecommendations() {
  const { state, trackProductView, addToWishlist, removeFromWishlist } = useUserPreferences();
  const { addItem } = useCart();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.isLoading) return;

    // Generate personalized recommendations
    const personalized = RecommendationEngine.generateRecommendations(
      products,
      state.preferences,
      8
    );
    setRecommendations(personalized);

    // Get trending products
    const trending = RecommendationEngine.getTrendingProducts(products, 8);
    setTrendingProducts(trending);

    // Get recently viewed products
    const recentlyViewedIds = state.preferences.viewedProducts.slice(0, 8);
    const recentProducts = recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
    setRecentlyViewed(recentProducts);

    setIsLoading(false);
  }, [state.preferences, state.isLoading]);

  const handleProductClick = (product: any) => {
    trackProductView(product.id);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };

  const handleToggleWishlist = (product: any) => {
    if (state.preferences.wishlistItems.includes(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const isWishlisted = (productId: string) => {
    return state.preferences.wishlistItems.includes(productId);
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-80 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Untuk Kamu</h2>
              <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                Dipersonalisasi
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted(product.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-6 w-6 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900">Sedang Trending</h2>
              <span className="text-sm text-gray-500 bg-orange-100 px-3 py-1 rounded-full">
                Populer
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted(product.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Clock className="h-6 w-6 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Baru Saja Dilihat</h2>
              <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                Riwayat
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentlyViewed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isWishlisted(product.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State - No personalization data yet */}
        {recommendations.length === 0 && trendingProducts.length === 0 && recentlyViewed.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mulai Personalisasi Kamu
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Jelajahi produk-produk kami dan kami akan memberikan rekomendasi yang dipersonalisasi untuk kamu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
