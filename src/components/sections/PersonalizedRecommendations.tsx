"use client";

import { useState, useEffect, useMemo } from 'react';
import { Sparkles, TrendingUp, Clock, Heart } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { RecommendationEngine } from '@/lib/recommendationEngine';
import { products } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useIntersectionObserverMultiple } from '@/hooks/useIntersectionObserver';

export default function PersonalizedRecommendations() {
  try {
    const { state, trackProductView, addToWishlist, removeFromWishlist } = useUserPreferences();
    const { addItem } = useCart();
    const [isLoading, setIsLoading] = useState(true);
    const { setRef } = useIntersectionObserverMultiple({ threshold: 0.1 });

    // Force show data for testing - remove conditional hiding
    const recommendations = useMemo(() => {
      try {
        if (state.isLoading) return [];
        
        // Generate personalized recommendations
        const recs = RecommendationEngine.generateRecommendations(
          products,
          state.preferences,
          8
        );
        
        // Fallback: if no recommendations, use featured products
        if (recs.length === 0) {
          return products.filter(p => p.featured).slice(0, 4);
        }
        
        return recs;
      } catch (error) {
        console.error('Error generating recommendations:', error);
        return products.slice(0, 4);
      }
    }, [state.preferences, state.isLoading]);

    // Force trending products for testing
    const trendingProducts = useMemo(() => {
      try {
        const trending = RecommendationEngine.getTrendingProducts(products, 8);
        // Fallback: if no trending, use sample products
        return trending.length > 0 ? trending : products.slice(0, 4);
      } catch (error) {
        console.error('Error getting trending products:', error);
        return products.slice(0, 4);
      }
    }, []);

    // Force recently viewed for testing  
    const recentlyViewed = useMemo(() => {
      try {
        const recentlyViewedIds = state.preferences.viewedProducts.slice(0, 8);
        const viewed = recentlyViewedIds
          .map(id => products.find(p => p.id === id))
          .filter((product): product is NonNullable<typeof product> => product !== undefined);
        
        // Fallback: if no recently viewed, use sample products
        return viewed.length > 0 ? viewed : products.slice(4, 8);
      } catch (error) {
        console.error('Error getting recently viewed:', error);
        return products.slice(4, 8);
      }
    }, [state.preferences.viewedProducts]);

    useEffect(() => {
      setIsLoading(false);
    }, [state.isLoading]);

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

    // Always show section - remove conditional hiding for debugging
    if (false && isLoading) {
      return (
        <div className="py-16 bg-gray-50 border-4 border-red-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(12)].map((_, i) => (
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
          <section className="mb-16">
            <div 
              ref={setRef('personalized-header')}
              className="flex items-center gap-3 mb-8 scroll-animate scroll-animate-fade-left"
              data-scroll-id="personalized-header"
            >
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Untuk Kamu</h2>
              <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                Dipersonalisasi
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((product, index) => (
                <div
                  key={product.id}
                  ref={setRef(`personalized-product-${index}`)}
                  className="scroll-animate scroll-animate-fade-up scroll-animate-scale"
                  data-scroll-id={`personalized-product-${index}`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={isWishlisted(product.id)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Trending Products */}
          <section className="mb-16">
            <div 
              ref={setRef('trending-header')}
              className="flex items-center gap-3 mb-8 scroll-animate scroll-animate-fade-right"
              data-scroll-id="trending-header"
            >
              <TrendingUp className="h-6 w-6 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900">Sedang Trending</h2>
              <span className="text-sm text-gray-500 bg-orange-100 px-3 py-1 rounded-full">
                Populer
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <div
                  key={product.id}
                  ref={setRef(`trending-product-${index}`)}
                  className="scroll-animate scroll-animate-fade-up scroll-animate-scale"
                  data-scroll-id={`trending-product-${index}`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={isWishlisted(product.id)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Recently Viewed */}
          <section>
            <div 
              ref={setRef('recently-header')}
              className="flex items-center gap-3 mb-8 scroll-animate scroll-animate-fade-left"
              data-scroll-id="recently-header"
            >
              <Clock className="h-6 w-6 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Baru Saja Dilihat</h2>
              <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                Riwayat
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((product, index) => (
                <div
                  key={product.id}
                  ref={setRef(`recently-product-${index}`)}
                  className="scroll-animate scroll-animate-fade-up scroll-animate-scale"
                  data-scroll-id={`recently-product-${index}`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={isWishlisted(product.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in PersonalizedRecommendations component:', error);
    
    // Fallback component
    return (
      <div className="py-16 bg-gray-50 border-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded">
            <p className="text-sm">ERROR: PersonalizedRecommendations failed to load</p>
            <p className="text-sm">Showing fallback content</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-gray-600">Rp {product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
