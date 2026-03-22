"use client";

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Package, Star, ChevronRight, Sparkles, Target, Zap } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { AdvancedRecommendationEngine, AdvancedRecommendation } from '@/lib/advancedRecommendationEngine';
import { products } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/contexts/CartContext';

interface AdvancedRecommendationsProps {
  className?: string;
}

export default function AdvancedRecommendations({ className = "" }: AdvancedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AdvancedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { state, trackProductView, addToWishlist, removeFromWishlist } = useUserPreferences();
  const { addItem } = useCart();

  useEffect(() => {
    if (state.isLoading) return;

    const generateRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const advancedRecs = AdvancedRecommendationEngine.generateAdvancedRecommendations(
        products,
        state.preferences,
        12
      );
      
      setRecommendations(advancedRecs);
      setIsLoading(false);
    };

    generateRecommendations();
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

  const getRecommendationIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return <Users className="h-4 w-4" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      case 'similar':
        return <Brain className="h-4 w-4" />;
      case 'complementary':
        return <Package className="h-4 w-4" />;
      case 'upsell':
        return <Zap className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal':
        return 'bg-blue-100 text-blue-700';
      case 'trending':
        return 'bg-orange-100 text-orange-700';
      case 'similar':
        return 'bg-purple-100 text-purple-700';
      case 'complementary':
        return 'bg-green-100 text-green-700';
      case 'upsell':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'personal':
        return 'Personal';
      case 'trending':
        return 'Trending';
      case 'similar':
        return 'Mirip';
      case 'complementary':
        return 'Lengkap';
      case 'upsell':
        return 'Upgrade';
      default:
        return 'Umum';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Sangat Cocok';
    if (confidence >= 0.6) return 'Cocok';
    return 'Mungkin Cocok';
  };

  // Filter recommendations by category
  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  // Group recommendations by category
  const groupedRecommendations = recommendations.reduce((groups, rec) => {
    if (!groups[rec.category]) {
      groups[rec.category] = [];
    }
    groups[rec.category].push(rec);
    return groups;
  }, {} as Record<string, AdvancedRecommendation[]>);

  if (isLoading) {
    return (
      <section className={`py-16 bg-gradient-to-br from-indigo-50 to-purple-50 ${className}`}>
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
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-indigo-50 to-purple-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h2 className="text-4xl font-bold text-gray-900">AI Recommendations</h2>
            <Sparkles className="h-8 w-8 text-indigo-600" />
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Rekomendasi produk cerdas berdasarkan AI yang dipersonalisasi untuk kamu
          </p>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Semua ({recommendations.length})
            </button>
            
            {Object.entries(groupedRecommendations).map(([category, recs]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? getCategoryColor(category)
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {getRecommendationIcon(category)}
                {getCategoryLabel(category)} ({recs.length})
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.product.id} className="relative">
              {/* Recommendation Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getCategoryColor(recommendation.category)}`}>
                  {getRecommendationIcon(recommendation.category)}
                  {getCategoryLabel(recommendation.category)}
                </div>
              </div>

              {/* Confidence Score */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="bg-white px-2 py-1 rounded-full text-xs font-medium border border-gray-200 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span className={getConfidenceColor(recommendation.confidence)}>
                    {getConfidenceLabel(recommendation.confidence)}
                  </span>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={recommendation.product.images[0]}
                    alt={recommendation.product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* AI Overlay */}
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    AI Score: {Math.round(recommendation.score * 100)}%
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {recommendation.product.title}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      Rp {recommendation.product.price.toLocaleString('id-ID')}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>

                  {/* Recommendation Reasons */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Alasan Rekomendasi:</div>
                    <div className="space-y-1">
                      {recommendation.reasons.slice(0, 2).map((reason, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleAddToCart(recommendation.product)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            Lihat Semua Rekomendasi AI
          </button>
        </div>

        {/* AI Insights */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Insights</h3>
            <p className="text-gray-600">
              Temukan bagaimana AI memahami preferensi shopping kamu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <Brain className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Personal Analysis</h4>
              <p className="text-sm text-gray-600">
                AI menganalisis {state.preferences.viewedProducts.length} produk yang kamu lihat
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Accuracy Rate</h4>
              <p className="text-sm text-gray-600">
                {Math.round(recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length * 100)}% akurasi rekomendasi
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Trend Detection</h4>
              <p className="text-sm text-gray-600">
                {recommendations.filter(r => r.category === 'trending').length} produk trending ditemukan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
