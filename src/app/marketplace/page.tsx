"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardModern } from '@/components/mobile/ProductCardModern';

// Cache configuration
const CACHE_KEY = 'marketplace-products';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
// Product interface matching database schema
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

// Categories interface
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
// Local utility functions to handle database schema
const filterProducts = (products: Product[], filters: FilterState): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // Price filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }
    
    // Rating filter
    if (filters.rating !== null && (product.rating || 0) < filters.rating) {
      return false;
    }
    
    // Stock filter
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }
    
    return true;
  });
};

const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }
};

const paginateProducts = (products: Product[], page: number, perPage: number): Product[] => {
  const startIndex = (page - 1) * perPage;
  return products.slice(startIndex, startIndex + perPage);
};

const getTotalPages = (totalItems: number, perPage: number): number => {
  return Math.ceil(totalItems / perPage);
};
import { formatPrice } from '@/lib/utils';
import { X, ShoppingCart, ChevronDown, Search, Grid3x3, Tag, Star, Sliders } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const PRODUCTS_PER_PAGE = 50;

// Interface untuk filter baru
interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number | null;
  inStockOnly: boolean;
  sortBy: string;
}

const initialFilters: FilterState = {
  categories: [],
  priceRange: {
    min: 0,
    max: 999999999,
  },
  rating: null,
  inStockOnly: false,
  sortBy: 'featured',
};

export default function MarketplacePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist } = useWishlist();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms debounce

  // Hardcoded categories
  const categories: Category[] = [
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    { id: 'bags', name: 'Bags', slug: 'bags' },
    { id: 'beauty', name: 'Beauty', slug: 'beauty' },
    { id: 'books', name: 'Books', slug: 'books' },
    { id: 'electronics', name: 'Electronics', slug: 'electronics' },
    { id: 'fashion', name: 'Fashion', slug: 'fashion' },
    { id: 'food-beverage', name: 'Food & Beverage', slug: 'food-beverage' },
    { id: 'home-living', name: 'Home & Living', slug: 'home-living' },
    { id: 'jackets', name: 'Jackets', slug: 'jackets' },
    { id: 'shoes', name: 'Shoes', slug: 'shoes' },
    { id: 'sports', name: 'Sports', slug: 'sports' },
    { id: 'toys', name: 'Toys', slug: 'toys' }
  ];

  // Memoized image placeholder function
  const getPlaceholderImage = useCallback((category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
      'accessories': 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400&h=400&fit=crop',
      'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      'sports': 'https://images.unsplash.com/photo-1551698618-1dcef662d9f0?w=400&h=400&fit=crop',
      'books': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'toys': 'https://images.unsplash.com/photo-1517428774926-6830c755c4d2?w=400&h=400&fit=crop'
    };
    return categoryMap[category.toLowerCase()] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
  }, []);

  // Memoized product conversion function - optimized to avoid double parsing
  const convertProduct = useCallback((product: any): Product => {
    let imagesArray: string[] = [];
    
    // API already parses images, so check if it's already an array
    if (Array.isArray(product.images)) {
      imagesArray = product.images;
    } else if (product.images) {
      try {
        const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(parsedImages)) {
          imagesArray = parsedImages;
        }
      } catch (error) {
        // Silently handle parse errors
      }
    }
    
    // Only use placeholder if no images found
    if (imagesArray.length === 0) {
      imagesArray = [getPlaceholderImage(product.category || 'fashion')];
    }

    let normalizedPrice = product.price || 0;
    if (normalizedPrice < 1000) {
      normalizedPrice = normalizedPrice * 15000;
    }
    
    return {
      id: product.id,
      title: product.title,
      price: normalizedPrice,
      images: imagesArray,
      category: product.category,
      description: product.description || '',
      rating: product.rating,
      reviews: product.reviewCount || product.reviews || 0,
      inStock: product.inStock,
      featured: product.featured,
      sellerId: product.sellerId || 'unknown',
      slug: product.slug || product.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    };
  }, [getPlaceholderImage]);

  // Fetch real products from marketplace API with server-side pagination and filtering
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: PRODUCTS_PER_PAGE.toString()
        });

        // Add filter params if they exist
        if (debouncedSearchQuery.trim()) {
          params.append('search', debouncedSearchQuery);
        }
        if (filters.categories.length > 0) {
          params.append('category', filters.categories[0]); // Send first category for now
        }
        // Featured sorting is done client-side, not server-side filter

        // Fetch from API with pagination and filter params
        const response = await fetch(`/api/marketplace-products?${params.toString()}`);
        const result = await response.json();

        if (result.success && result.products) {
          const realProducts = result.products.map(convertProduct);
          setAllProducts(realProducts);
          setTotalProducts(result.total);
          setTotalPages(result.totalPages);
        } else {
          setAllProducts([]);
          setTotalProducts(0);
          setTotalPages(1);
        }
      } catch (error) {
        setAllProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchRealProducts();
  }, [currentPage, debouncedSearchQuery, filters.categories, filters.sortBy, convertProduct]);

  // Memoize handlers to prevent re-renders
  const handleAddToCart = useCallback(async (product: any) => {
    try {
      await addItem({
        id: Date.now().toString(),
        productId: product.id,
        title: product.name || product.title,
        price: product.price,
        image: product.image || product.images[0],
        quantity: 1,
      });
    } catch (error) {
      // Silently handle cart errors
    }
  }, [addItem]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  // Memoized filtered and sorted products (client-side only for remaining filters not in server)
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by price range (client-side only for now)
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    );

    // Filter by rating (client-side only for now)
    if (filters.rating) {
      filtered = filtered.filter(product =>
        (product.rating || 0) >= filters.rating!
      );
    }

    // Filter by stock (client-side only for now)
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock !== false);
    }

    return filtered;
  }, [allProducts, filters]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    
    switch (filters.sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'featured':
      default:
        // Keep original order with featured first
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    return sorted;
  }, [filteredProducts, filters.sortBy]);

  const paginatedProducts = useMemo(() => {
    return sortedProducts; // No client-side pagination needed anymore
  }, [sortedProducts]);

  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 || 
           filters.priceRange.min > 0 || 
           filters.priceRange.max < 999999999 || 
           filters.rating !== null || 
           filters.inStockOnly;
  }, [filters]);

  return (
    <AppLayout showSidebar={true} showFooter={true}>
      {/* Desktop Version */}
      <div className="hidden md:block">
        {/* Sub-Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Left Side - Filter Chips */}
              <div className="flex items-center gap-3 overflow-x-auto flex-1">
                {/* Categories Chip */}
                <button
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'categories' ? null : 'categories')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap"
                >
                  <Grid3x3 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Categories</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'categories' ? 'rotate-180' : ''}`} />
                </button>

                {/* Price Range Chip */}
                <button
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'price' ? null : 'price')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap"
                >
                  <Tag className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Price Range</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'price' ? 'rotate-180' : ''}`} />
                </button>

                {/* Rating Chip */}
                <button
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'rating' ? null : 'rating')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap"
                >
                  <Star className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Rating</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'rating' ? 'rotate-180' : ''}`} />
                </button>

                {/* Sort By Chip */}
                <button
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'sort' ? null : 'sort')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap"
                >
                  <Sliders className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Sort By</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'sort' ? 'rotate-180' : ''}`} />
                </button>

                {/* Reset Filter Button */}
                {hasActiveFilters && (
                  <button
                    onClick={() => handleFilterChange(initialFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200 whitespace-nowrap"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>

              {/* Right Side - Search Bar */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="text-sm text-gray-500 font-['Inter'] whitespace-nowrap">
                  {sortedProducts.length} produk
                </div>
              </div>
            </div>

            {/* Filter Dropdowns */}
            {activeFilterDropdown === 'categories' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange({ ...filters, categories: [] })}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      filters.categories.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        const newCategories = filters.categories.includes(category.id)
                          ? filters.categories.filter(c => c !== category.id)
                          : [...filters.categories, category.id];
                        handleFilterChange({ ...filters, categories: newCategories });
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        filters.categories.includes(category.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterDropdown === 'price' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '< Rp 50.000', min: 0, max: 50000 },
                    { label: 'Rp 50.000 – Rp 500.000', min: 50000, max: 500000 },
                    { label: 'Rp 500.000 – Rp 1.000.000', min: 500000, max: 1000000 },
                    { label: 'Rp 1.000.000 – Rp 2.000.000', min: 1000000, max: 2000000 },
                    { label: '> Rp 2.000.000', min: 2000000, max: 999999999 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleFilterChange({ ...filters, priceRange: { min: preset.min, max: preset.max } })}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        filters.priceRange.min === preset.min && filters.priceRange.max === preset.max
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterDropdown === 'rating' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange({ ...filters, rating: filters.rating === rating ? null : rating })}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors ${
                        filters.rating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      {rating}+ bintang
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterDropdown === 'sort' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'newest', label: 'Newest' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange({ ...filters, sortBy: option.value })}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Products Grid */}
        <div className="w-full px-6 lg:px-8 pt-8">
          {/* Loading State - Skeleton Screen */}
          {loading ? (
            <div className="grid gap-6 px-2 pb-8" style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gridAutoRows: '1fr'
            }}>
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                <div key={`skeleton-${index}`} className="flex flex-col h-full">
                  {/* Product Image Skeleton */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/5] mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%'
                    }}></div>
                  </div>

                  {/* Product Info Skeleton */}
                  <div className="space-y-3">
                    {/* Title Skeleton */}
                    <div className="h-4 bg-gray-100 rounded animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%',
                      width: '80%'
                    }}></div>

                    {/* Price Skeleton */}
                    <div className="h-6 bg-gray-100 rounded animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%',
                      width: '40%'
                    }}></div>

                    {/* Rating Skeleton */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={`star-${i}`} className="w-4 h-4 bg-gray-100 rounded animate-shimmer" style={{
                          animation: 'shimmer 1.5s infinite',
                          backgroundSize: '200% 100%'
                        }}></div>
                      ))}
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-10 bg-gray-100 rounded-lg animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter atau kembali lagi nanti</p>
                <button
                  onClick={() => handleFilterChange(initialFilters)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid gap-6 transition-all duration-400 ease-out px-2 pb-8" style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gridAutoRows: '1fr',
              transition: 'all 0.4s ease-in-out'
            }}>
              {paginatedProducts.map((product) => (
                <div key={product.id} className="flex flex-col h-full">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isWishlisted={isInWishlist(product.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Sub-Navigation Bar - Mobile */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3">
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filter Chips - Horizontal Scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {/* Categories Chip */}
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'categories' ? null : 'categories')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0"
              >
                <Grid3x3 className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'categories' ? 'rotate-180' : ''}`} />
              </button>

              {/* Price Range Chip */}
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'price' ? null : 'price')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0"
              >
                <Tag className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Price</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>

              {/* Rating Chip */}
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'rating' ? null : 'rating')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0"
              >
                <Star className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Rating</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'rating' ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort By Chip */}
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'sort' ? null : 'sort')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0"
              >
                <Sliders className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Sort</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${activeFilterDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>

              {/* Reset Filter Button - Mobile */}
              {hasActiveFilters && (
                <button
                  onClick={() => handleFilterChange(initialFilters)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                  Reset
                </button>
              )}

              {/* Results Count */}
              <div className="text-xs text-gray-500 font-['Inter'] whitespace-nowrap flex-shrink-0 ml-auto">
                {sortedProducts.length} produk
              </div>
            </div>

            {/* Filter Dropdowns - Mobile */}
            {activeFilterDropdown === 'categories' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange({ ...filters, categories: [] })}
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                      filters.categories.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        const newCategories = filters.categories.includes(category.id)
                          ? filters.categories.filter(c => c !== category.id)
                          : [...filters.categories, category.id];
                        handleFilterChange({ ...filters, categories: newCategories });
                      }}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filters.categories.includes(category.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterDropdown === 'price' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '< 50K', min: 0, max: 50000 },
                    { label: '50K-500K', min: 50000, max: 500000 },
                    { label: '500K-1M', min: 500000, max: 1000000 },
                    { label: '1M-2M', min: 1000000, max: 2000000 },
                    { label: '> 2M', min: 2000000, max: 999999999 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleFilterChange({ ...filters, priceRange: { min: preset.min, max: preset.max } })}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filters.priceRange.min === preset.min && filters.priceRange.max === preset.max
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterDropdown === 'rating' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange({ ...filters, rating: filters.rating === rating ? null : rating })}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filters.rating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterDropdown === 'sort' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Low to High' },
                    { value: 'price-high', label: 'High to Low' },
                    { value: 'rating', label: 'Top Rated' },
                    { value: 'newest', label: 'Newest' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange({ ...filters, sortBy: option.value })}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid - Mobile */}
        <div className="px-4 py-4 pb-20">
          {/* Loading State - Skeleton Screen */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                <div key={`skeleton-mobile-${index}`} className="flex flex-col">
                  {/* Product Image Skeleton */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/5] mb-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%'
                    }}></div>
                  </div>

                  {/* Product Info Skeleton */}
                  <div className="space-y-2">
                    {/* Title Skeleton */}
                    <div className="h-3 bg-gray-100 rounded animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%',
                      width: '90%'
                    }}></div>

                    {/* Price Skeleton */}
                    <div className="h-4 bg-gray-100 rounded animate-shimmer" style={{
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%',
                      width: '50%'
                    }}></div>

                    {/* Rating Skeleton */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={`star-mobile-${i}`} className="w-3 h-3 bg-gray-100 rounded animate-shimmer" style={{
                          animation: 'shimmer 1.5s infinite',
                          backgroundSize: '200% 100%'
                        }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter atau kembali lagi nanti</p>
                <button
                  onClick={() => handleFilterChange(initialFilters)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4" style={{ gridAutoRows: '1fr' }}>
              {paginatedProducts.map((product) => {
                // images is already an array from convertProduct
                const imagesArray = Array.isArray(product.images) ? product.images : [];
                const firstImage = imagesArray[0] || product.image || '/placeholder.jpg';

                return (
                  <div key={`product-${product.id}`} className="flex flex-col h-full">
                    <ProductCardModern
                      product={{
                        id: product.id,
                        name: product.name || product.title || 'Unknown Product',
                        title: product.title || product.name,
                        description: product.description || '',
                        price: product.price,
                        originalPrice: (product as any).originalPrice,
                        discount: (product as any).discount,
                        rating: product.rating,
                        reviews: product.reviews,
                        image: firstImage,
                        images: imagesArray,
                        isNew: (product as any).isNew,
                        category: product.category,
                        slug: product.slug
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 group"
        >
          <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span>Checkout</span>
        </button>
      </div>
    </AppLayout>
  );
}
