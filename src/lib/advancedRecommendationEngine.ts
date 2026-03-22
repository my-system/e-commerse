import { Product } from '@/data/products';
import { UserPreferences } from '@/contexts/UserPreferencesContext';

export interface AdvancedRecommendation {
  product: Product;
  score: number;
  reasons: string[];
  confidence: number;
  category: 'trending' | 'personal' | 'similar' | 'complementary' | 'upsell';
  metadata?: {
    popularityRank?: number;
    userAffinity?: number;
    seasonalTrend?: number;
    priceSensitivity?: number;
  };
}

export class AdvancedRecommendationEngine {
  private static readonly WEIGHTS = {
    PERSONAL_HISTORY: 0.35,
    COLLABORATIVE_FILTERING: 0.25,
    CONTENT_BASED: 0.20,
    TRENDING: 0.15,
    SEASONAL: 0.05,
  };

  private static readonly SEASONAL_PRODUCTS: Record<string, string[]> = {
    winter: ['jacket', 'sweater', 'coat', 'boots'],
    summer: ['t-shirt', 'shorts', 'sandals', 'sunglasses'],
    spring: ['dress', 'light jacket', 'sneakers'],
    fall: ['hoodie', 'jeans', 'boots', 'scarf'],
  };

  static generateAdvancedRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number = 12
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];

    // 1. Personal History Recommendations
    const personalRecs = this.getPersonalHistoryRecommendations(products, userPreferences, 4);
    recommendations.push(...personalRecs);

    // 2. Collaborative Filtering Recommendations
    const collaborativeRecs = this.getCollaborativeFilteringRecommendations(products, userPreferences, 3);
    recommendations.push(...collaborativeRecs);

    // 3. Content-Based Recommendations
    const contentRecs = this.getContentBasedRecommendations(products, userPreferences, 3);
    recommendations.push(...contentRecs);

    // 4. Trending Recommendations
    const trendingRecs = this.getTrendingRecommendations(products, userPreferences, 2);
    recommendations.push(...trendingRecs);

    // 5. Seasonal Recommendations
    const seasonalRecs = this.getSeasonalRecommendations(products, userPreferences, 2);
    recommendations.push(...seasonalRecs);

    // Remove duplicates and sort by score
    const uniqueRecommendations = this.removeDuplicates(recommendations);
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private static getPersonalHistoryRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];
    const viewedProducts = userPreferences.viewedProducts;
    const wishlistItems = userPreferences.wishlistItems;
    const cartItems = userPreferences.cartItems;

    // Analyze user's favorite categories
    const categoryFrequency = this.analyzeCategoryFrequency(userPreferences);
    const priceRange = this.analyzePriceRange(userPreferences);

    products.forEach(product => {
      if (viewedProducts.includes(product.id) || 
          wishlistItems.includes(product.id) || 
          cartItems.includes(product.id)) {
        return; // Skip already interacted products
      }

      let score = 0;
      const reasons: string[] = [];

      // Category affinity
      if (categoryFrequency[product.category]) {
        score += categoryFrequency[product.category] * 0.4;
        reasons.push(`Kategori ${product.category} yang sering kamu lihat`);
      }

      // Price range affinity
      if (this.isInPriceRange(product.price, priceRange)) {
        score += 0.3;
        reasons.push('Sesuai dengan budget kamu');
      }

      // Similarity to viewed products
      const similarityScore = this.calculateSimilarityToViewed(product, viewedProducts, products);
      if (similarityScore > 0.5) {
        score += similarityScore * 0.3;
        reasons.push('Mirip dengan produk yang kamu lihat');
      }

      if (score > 0.3) {
        recommendations.push({
          product,
          score,
          reasons,
          confidence: Math.min(score, 0.9),
          category: 'personal',
          metadata: {
            userAffinity: score,
            priceSensitivity: this.calculatePriceSensitivity(product.price, priceRange),
          },
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private static getCollaborativeFilteringRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];
    
    // Simulate finding similar users and their preferences
    const similarUsersPreferences = this.simulateSimilarUsers(userPreferences);
    
    products.forEach(product => {
      if (userPreferences.viewedProducts.includes(product.id)) return;

      let score = 0;
      const reasons: string[] = [];

      // Products liked by similar users
      const similarUserScore = similarUsersPreferences
        .filter(pref => pref.likedProducts.includes(product.id))
        .reduce((sum, pref) => sum + pref.similarity, 0);

      if (similarUserScore > 0.5) {
        score += similarUserScore * 0.7;
        reasons.push('Pengguna dengan selera serupa menyukai ini');
      }

      // Products frequently bought together
      const frequentlyBoughtTogether = this.getFrequentlyBoughtTogether(
        product.id,
        userPreferences.viewedProducts
      );
      if (frequentlyBoughtTogether > 0.3) {
        score += frequentlyBoughtTogether * 0.3;
        reasons.push('Sering dibeli bersama produk yang kamu lihat');
      }

      if (score > 0.4) {
        recommendations.push({
          product,
          score,
          reasons,
          confidence: Math.min(score * 0.8, 0.8),
          category: 'similar',
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private static getContentBasedRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];
    const userProfile = this.buildUserProfile(userPreferences, products);

    products.forEach(product => {
      if (userPreferences.viewedProducts.includes(product.id)) return;

      let score = 0;
      const reasons: string[] = [];

      // Content similarity based on product attributes
      const contentScore = this.calculateContentSimilarity(product, userProfile);
      score += contentScore * 0.6;

      if (contentScore > 0.4) {
        reasons.push('Karakteristik produk sesuai preferensi kamu');
      }

      // Complementary products
      const complementaryScore = this.getComplementaryScore(product, userPreferences);
      score += complementaryScore * 0.4;

      if (complementaryScore > 0.3) {
        reasons.push('Melengkapi produk yang kamu punya');
      }

      if (score > 0.3) {
        recommendations.push({
          product,
          score,
          reasons,
          confidence: Math.min(score * 0.7, 0.7),
          category: 'complementary',
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private static getTrendingRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];
    
    // Simulate trending data
    const trendingData = this.simulateTrendingData(products);

    trendingData.forEach(({ product, trendScore, popularityRank }) => {
      if (userPreferences.viewedProducts.includes(product.id)) return;

      let score = trendScore * 0.5;
      const reasons: string[] = [];

      // Boost if trending in user's preferred categories
      if (userPreferences.clickedCategories.includes(product.category)) {
        score += 0.3;
        reasons.push(`Trending di kategori ${product.category} yang kamu suka`);
      }

      if (trendScore > 0.6) {
        reasons.push('Sedang populer saat ini');
      }

      if (score > 0.4) {
        recommendations.push({
          product,
          score,
          reasons,
          confidence: Math.min(score * 0.6, 0.6),
          category: 'trending',
          metadata: {
            popularityRank,
            seasonalTrend: this.calculateSeasonalTrend(product),
          },
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private static getSeasonalRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];
    const currentSeason = this.getCurrentSeason();
    const seasonalKeywords = this.SEASONAL_PRODUCTS[currentSeason] || [];

    products.forEach(product => {
      if (userPreferences.viewedProducts.includes(product.id)) return;

      let score = 0;
      const reasons: string[] = [];

      // Check if product matches seasonal keywords
      const productKeywords = [
        product.title.toLowerCase(),
        product.category.toLowerCase(),
        ...(product.description?.toLowerCase().split(' ') || []),
      ];

      const seasonalMatch = seasonalKeywords.some((keyword: any) =>
        productKeywords.some((pk: any) => pk.includes(keyword))
      );

      if (seasonalMatch) {
        score += 0.7;
        reasons.push(`Cocok untuk musim ${currentSeason}`);
      }

      // Boost if user has shown interest in seasonal products
      if (userPreferences.clickedCategories.includes(product.category)) {
        score += 0.3;
        reasons.push('Kategori musiman yang kamu suka');
      }

      if (score > 0.5) {
        recommendations.push({
          product,
          score,
          reasons,
          confidence: Math.min(score * 0.5, 0.5),
          category: 'seasonal' as any,
          metadata: {
            seasonalTrend: score,
          },
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Helper methods
  private static analyzeCategoryFrequency(userPreferences: UserPreferences): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    // Count category interactions
    userPreferences.clickedCategories.forEach(category => {
      frequency[category] = (frequency[category] || 0) + 1;
    });

    // Normalize to 0-1 range
    const maxCount = Math.max(...Object.values(frequency), 1);
    Object.keys(frequency).forEach(category => {
      frequency[category] = frequency[category] / maxCount;
    });

    return frequency;
  }

  private static analyzePriceRange(userPreferences: UserPreferences): { min: number; max: number } {
    // This would normally analyze actual purchase data
    // For demo, return a reasonable range
    return {
      min: 100000,
      max: 1000000,
    };
  }

  private static isInPriceRange(price: number, range: { min: number; max: number }): boolean {
    return price >= range.min && price <= range.max;
  }

  private static calculateSimilarityToViewed(
    product: Product,
    viewedProducts: string[],
    allProducts: Product[]
  ): number {
    if (viewedProducts.length === 0) return 0;

    const viewedProductObjs = allProducts.filter(p => viewedProducts.includes(p.id));
    let totalSimilarity = 0;

    viewedProductObjs.forEach(viewedProduct => {
      let similarity = 0;

      // Category similarity
      if (product.category === viewedProduct.category) similarity += 0.4;

      // Price similarity
      const priceDiff = Math.abs(product.price - viewedProduct.price) / viewedProduct.price;
      if (priceDiff < 0.3) similarity += 0.3;

      // Feature similarity (simplified)
      if (product.featured === viewedProduct.featured) similarity += 0.3;

      totalSimilarity += similarity;
    });

    return totalSimilarity / viewedProducts.length;
  }

  private static calculatePriceSensitivity(price: number, range: { min: number; max: number }): number {
    const rangeMid = (range.min + range.max) / 2;
    const deviation = Math.abs(price - rangeMid) / rangeMid;
    return Math.max(0, 1 - deviation);
  }

  private static simulateSimilarUsers(userPreferences: UserPreferences): Array<{
    similarity: number;
    likedProducts: string[];
  }> {
    // Simulate finding similar users
    return [
      { similarity: 0.8, likedProducts: ['2', '5', '8'] },
      { similarity: 0.6, likedProducts: ['1', '3', '7'] },
      { similarity: 0.4, likedProducts: ['4', '6', '9'] },
    ];
  }

  private static getFrequentlyBoughtTogether(productId: string, viewedProducts: string[]): number {
    // Simulate frequently bought together calculation
    return Math.random() * 0.8;
  }

  private static buildUserProfile(userPreferences: UserPreferences, products: Product[]): any {
    // Build user profile based on interactions
    return {
      preferredCategories: userPreferences.clickedCategories,
      avgPrice: 500000,
      preferredFeatures: ['featured'],
    };
  }

  private static calculateContentSimilarity(product: Product, userProfile: any): number {
    let similarity = 0;

    if (userProfile.preferredCategories.includes(product.category)) {
      similarity += 0.5;
    }

    if (Math.abs(product.price - userProfile.avgPrice) / userProfile.avgPrice < 0.3) {
      similarity += 0.3;
    }

    if (product.featured && userProfile.preferredFeatures.includes('featured')) {
      similarity += 0.2;
    }

    return similarity;
  }

  private static getComplementaryScore(product: Product, userPreferences: UserPreferences): number {
    // Simulate complementary product scoring
    return Math.random() * 0.7;
  }

  private static simulateTrendingData(products: Product[]): Array<{
    product: Product;
    trendScore: number;
    popularityRank: number;
  }> {
    return products
      .filter(p => p.featured)
      .map((product, index) => ({
        product,
        trendScore: Math.random() * 0.5 + 0.5,
        popularityRank: index + 1,
      }))
      .sort((a, b) => b.trendScore - a.trendScore);
  }

  private static getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  private static calculateSeasonalTrend(product: Product): number {
    const season = this.getCurrentSeason();
    const seasonalKeywords = this.SEASONAL_PRODUCTS[season] || [];
    
    const productKeywords = [
      product.title.toLowerCase(),
      product.category.toLowerCase(),
    ];

    const matchCount = seasonalKeywords.filter((keyword: any) =>
      productKeywords.some((pk: any) => pk.includes(keyword))
    ).length;

    return matchCount > 0 ? 0.8 : 0.2;
  }

  private static removeDuplicates(recommendations: AdvancedRecommendation[]): AdvancedRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.product.id)) return false;
      seen.add(rec.product.id);
      return true;
    });
  }

  // Upsell recommendations
  static getUpsellRecommendations(
    currentProduct: Product,
    allProducts: Product[],
    userPreferences: UserPreferences
  ): AdvancedRecommendation[] {
    const recommendations: AdvancedRecommendation[] = [];

    allProducts.forEach(product => {
      if (product.id === currentProduct.id) return;

      let score = 0;
      const reasons: string[] = [];

      // Higher price products in same category
      if (product.category === currentProduct.category && product.price > currentProduct.price) {
        const priceRatio = product.price / currentProduct.price;
        if (priceRatio <= 3) { // Not too expensive
          score += 0.6;
          reasons.push('Upgrade ke versi premium');
        }
      }

      // Better features
      if (product.featured && !currentProduct.featured) {
        score += 0.4;
        reasons.push('Fitur lebih lengkap');
      }

      if (score > 0.5) {
        recommendations.push({
          product,
          score,
          reasons,
          confidence: Math.min(score * 0.7, 0.7),
          category: 'upsell',
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }
}
