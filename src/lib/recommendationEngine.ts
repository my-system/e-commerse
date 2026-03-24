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

    // Score based on viewed products
    score += this.getViewedProductsScore(product, userPreferences.viewedProducts, allProducts);

    // Score based on search history
    score += this.getSearchHistoryScore(product, userPreferences.searchHistory);

    // Score based on clicked categories
    score += this.getCategoryScore(product, userPreferences.clickedCategories);

    // Score based on wishlist items
    score += this.getWishlistScore(product, userPreferences.wishlistItems, allProducts);

    // Score based on cart items
    score += this.getCartScore(product, userPreferences.cartItems, allProducts);

    // Add small deterministic factor for diversity (based on product ID hash)
    const idHash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const diversityFactor = (idHash % 100) / 1000; // 0 to 0.099
    score += diversityFactor;

    return Math.min(score, 1); // Cap at 1.0
  }

  private static getViewedProductsScore(product: Product, viewedProducts: string[], allProducts: Product[]): number {
    if (viewedProducts.length === 0) return 0;

    // Find similar products to viewed ones
    const similarProducts = viewedProducts.filter(viewedId => {
      // Use deterministic category matching based on product ID
      const viewedProduct = allProducts.find((p: Product) => p.id === viewedId);
      if (!viewedProduct) return false;
      
      // Deterministic similarity based on product characteristics
      const categoryMatch = product.category === viewedProduct.category;
      const priceSimilarity = Math.abs(product.price - viewedProduct.price) < 100000;
      
      return categoryMatch && priceSimilarity;
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
    // Use deterministic sorting instead of random
    return products
      .filter(p => p.featured)
      .sort((a, b) => {
        // Sort by price (descending) then by ID for stability
        if (a.price !== b.price) {
          return b.price - a.price;
        }
        return a.id.localeCompare(b.id);
      })
      .slice(0, limit);
  }

  // Get frequently bought together products
  static getFrequentlyBoughtTogether(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 4
  ): Product[] {
    // Use deterministic sorting for frequently bought together
    return allProducts
      .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
      .sort((a, b) => {
        // Sort by price similarity then by ID for stability
        const aPriceDiff = Math.abs(a.price - currentProduct.price);
        const bPriceDiff = Math.abs(b.price - currentProduct.price);
        
        if (aPriceDiff !== bPriceDiff) {
          return aPriceDiff - bPriceDiff;
        }
        return a.id.localeCompare(b.id);
      })
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
