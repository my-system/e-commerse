import { Product } from '@/data/products';
import { UserPreferences } from '@/contexts/UserPreferencesContext';

export interface RecommendationScore {
  productId: string;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  private static readonly WEIGHTS = {
    VIEWED_PRODUCTS: 0.3,
    SEARCH_HISTORY: 0.25,
    CLICKED_CATEGORIES: 0.2,
    WISHLIST_ITEMS: 0.15,
    CART_ITEMS: 0.1,
  };

  static generateRecommendations(
    products: Product[],
    userPreferences: UserPreferences,
    limit: number = 8
  ): Product[] {
    const scores = this.calculateRecommendationScores(products, userPreferences);
    const sortedProducts = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(score => products.find(p => p.id === score.productId))
      .filter(Boolean) as Product[];

    return sortedProducts;
  }

  private static calculateRecommendationScores(
    products: Product[],
    userPreferences: UserPreferences
  ): RecommendationScore[] {
    return products.map(product => {
      const score = this.calculateProductScore(product, userPreferences, products);
      const reasons = this.getRecommendationReasons(product, userPreferences);
      
      return {
        productId: product.id,
        score,
        reasons,
      };
    });
  }

  private static calculateProductScore(
    product: Product,
    userPreferences: UserPreferences,
    allProducts: Product[]
  ): number {
    let score = 0;

    // Base score for featured products
    if (product.featured) {
      score += 0.2;
    }

    // Score based on viewed products (collaborative filtering)
    score += this.getViewedProductsScore(product, userPreferences.viewedProducts);

    // Score based on search history
    score += this.getSearchHistoryScore(product, userPreferences.searchHistory);

    // Score based on clicked categories
    score += this.getCategoryScore(product, userPreferences.clickedCategories);

    // Score based on wishlist items
    score += this.getWishlistScore(product, userPreferences.wishlistItems, allProducts);

    // Score based on cart items
    score += this.getCartScore(product, userPreferences.cartItems, allProducts);

    // Add some randomness for diversity
    score += Math.random() * 0.1;

    return Math.min(score, 1); // Cap at 1.0
  }

  private static getViewedProductsScore(product: Product, viewedProducts: string[]): number {
    if (viewedProducts.length === 0) return 0;

    // Find similar products to viewed ones
    const similarProducts = viewedProducts.filter(viewedId => {
      // This would normally use a similarity algorithm
      // For demo purposes, we'll use simple category matching
      return Math.random() > 0.5; // Simulate similarity
    });

    return similarProducts.length > 0 ? this.WEIGHTS.VIEWED_PRODUCTS : 0;
  }

  private static getSearchHistoryScore(product: Product, searchHistory: string[]): number {
    if (searchHistory.length === 0) return 0;

    let score = 0;
    const productTitle = product.title.toLowerCase();
    const productDescription = (product.description || '').toLowerCase();

    searchHistory.forEach(searchTerm => {
      const term = searchTerm.toLowerCase();
      
      // Check if search term matches title or description
      if (productTitle.includes(term) || productDescription.includes(term)) {
        score += this.WEIGHTS.SEARCH_HISTORY / searchHistory.length;
      }
    });

    return score;
  }

  private static getCategoryScore(product: Product, clickedCategories: string[]): number {
    if (clickedCategories.length === 0) return 0;

    const categoryScore = clickedCategories.includes(product.category) 
      ? this.WEIGHTS.CLICKED_CATEGORIES 
      : 0;

    return categoryScore;
  }

  private static getWishlistScore(product: Product, wishlistItems: string[], allProducts: Product[]): number {
    if (wishlistItems.length === 0) return 0;

    // Find similar products to wishlist items
    const wishlistProducts = allProducts.filter(p => wishlistItems.includes(p.id));
    const similarCount = wishlistProducts.filter(wishlistProduct => 
      wishlistProduct.category === product.category ||
      this.priceRangeOverlap(wishlistProduct.price, product.price)
    ).length;

    return similarCount > 0 ? this.WEIGHTS.WISHLIST_ITEMS * (similarCount / wishlistItems.length) : 0;
  }

  private static getCartScore(product: Product, cartItems: string[], allProducts: Product[]): number {
    if (cartItems.length === 0) return 0;

    // Find similar products to cart items
    const cartProducts = allProducts.filter(p => cartItems.includes(p.id));
    const similarCount = cartProducts.filter(cartProduct => 
      cartProduct.category === product.category ||
      this.priceRangeOverlap(cartProduct.price, product.price)
    ).length;

    return similarCount > 0 ? this.WEIGHTS.CART_ITEMS * (similarCount / cartItems.length) : 0;
  }

  private static priceRangeOverlap(price1: number, price2: number, threshold: number = 0.3): boolean {
    const overlap = Math.abs(price1 - price2) / Math.max(price1, price2);
    return overlap <= threshold;
  }

  private static getRecommendationReasons(product: Product, userPreferences: UserPreferences): string[] {
    const reasons: string[] = [];

    if (product.featured) {
      reasons.push('Produk populer');
    }

    if (userPreferences.clickedCategories.includes(product.category)) {
      reasons.push(`Kategori ${product.category} yang kamu suka`);
    }

    if (userPreferences.searchHistory.some(term => 
      product.title.toLowerCase().includes(term.toLowerCase())
    )) {
      reasons.push('Sesuai pencarian kamu');
    }

    if (userPreferences.wishlistItems.length > 0) {
      reasons.push('Mirip dengan wishlist kamu');
    }

    if (userPreferences.cartItems.length > 0) {
      reasons.push('Sesuai dengan belanjaan kamu');
    }

    return reasons.length > 0 ? reasons : ['Rekomendasi untuk kamu'];
  }

  // Get trending products based on all user data (in real app, this would be from database)
  static getTrendingProducts(products: Product[], limit: number = 8): Product[] {
    // Simulate trending by returning featured products with some randomness
    return products
      .filter(p => p.featured)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Get frequently bought together products
  static getFrequentlyBoughtTogether(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 4
  ): Product[] {
    // Simulate "frequently bought together" by finding products in same category
    return allProducts
      .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Get personalized search results
  static getPersonalizedSearchResults(
    query: string,
    products: Product[],
    userPreferences: UserPreferences,
    limit: number = 12
  ): Product[] {
    const queryLower = query.toLowerCase();
    
    // Basic search
    let results = products.filter(product => 
      product.title.toLowerCase().includes(queryLower) ||
      (product.description?.toLowerCase().includes(queryLower) || false) ||
      product.category.toLowerCase().includes(queryLower)
    );

    // Boost scores for personalized results
    const scoredResults = results.map(product => ({
      product,
      score: this.calculateProductScore(product, userPreferences, products),
    }));

    // Sort by personalized score and return top results
    return scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  }
}
