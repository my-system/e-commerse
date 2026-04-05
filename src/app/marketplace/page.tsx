"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardModern } from '@/components/mobile/ProductCardModern';
import MarketplaceFilter from '@/components/filters/ModernSidebarFilter';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { filterProducts, sortProducts, paginateProducts, getTotalPages, generateMoreProducts } from '@/lib/product-utils';
import { formatPrice } from '@/lib/utils';
import { Filter, X, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const PRODUCTS_PER_PAGE = 12;

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
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Fetch real products from marketplace API
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/marketplace-products');
        const result = await response.json();
        
        if (result.success && result.products) {
          // Convert real products to match dummy product structure
          const realProducts = result.products.map((product: any) => {
            let imageUrl = '/placeholder.jpg';
            if (product.images) {
              try {
                const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                imageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : '/placeholder.jpg';
              } catch (error) {
                console.warn('Failed to parse product images:', error);
                imageUrl = '/placeholder.jpg';
              }
            }
            
            return {
              id: product.id,
              name: product.title,
              price: product.price,
              image: imageUrl,
              category: product.category,
              description: product.description || '',
              rating: product.rating,
              reviews: product.reviews,
              inStock: product.inStock,
              featured: product.featured,
              sellerId: product.sellerId,
              isRealProduct: true // Flag to identify real products
            };
          });
          
          // ONLY use real products from database (no dummy products)
          setAllProducts(realProducts);
          console.log(`✅ Loaded ${realProducts.length} approved products from marketplace database`);
        } else {
          console.warn('❌ Failed to load marketplace products, using fallback');
          setAllProducts([]); // Empty array if API fails
        }
      } catch (error) {
        console.error('❌ Error fetching marketplace products:', error);
        setAllProducts([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchRealProducts();
  }, []);

  // Memoize handlers to prevent re-renders
  const handleAddToCart = useCallback(async (product: any) => {
    setAddingToCart(product.id);
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
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  }, [addItem]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    );
    
    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= filters.rating!
      );
    }
    
    // Filter by stock
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
    return paginateProducts(sortedProducts, currentPage, PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const totalPages = useMemo(() => {
    return getTotalPages(sortedProducts.length, PRODUCTS_PER_PAGE);
  }, [sortedProducts.length]);

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
        {/* Marketplace Header Wrapper */}
        <div className="marketplace-header-wrapper bg-gray-50 border-b border-gray-200" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1 font-sans">
              <a href="/" className="hover:text-gray-700 transition-colors duration-200">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Marketplace</span>
            </nav>
            
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-['Inter']">Marketplace</h1>
                <p className="text-gray-600 mt-0 font-['Inter']">
                  Temukan produk berkualitas dari berbagai penjual terpercaya
                </p>
              </div>
              
              {/* Results Count & Filter Button */}
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 font-['Inter']">
                  Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
                </div>
                
                {/* Filter Toggle Button */}
                <button
                  onClick={toggleSidebar}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isSidebarOpen 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011 0v2a1 1 0 011 0v3a1 1 0 011 0v1M4 10a1 1 0 011 0v2a1 1 0 011 0v1" />
                  </svg>
                  <span className="font-medium">Filter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flex Layout */}
        <div className="w-full px-6 lg:px-8 pt-8">
          <div className="flex gap-0 transition-all duration-400 ease-out" style={{ 
            width: '100%', 
            minHeight: '100vh',
            alignItems: 'flex-start'
          }}>
            {/* Products Grid - Main Content */}
            <div className="flex-1 min-w-0 transition-all duration-400 ease-out overflow-hidden">
              {/* Products Grid */}
              <div className="grid gap-4 transition-all duration-400 ease-out px-2 pb-8" style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                transition: 'all 0.4s ease-in-out'
              }}>
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      isWishlisted={isInWishlist(product.id)}
                    />
                  </div>
                ))}
              </div>

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

            {/* Sidebar Filter - Right Side Only */}
            <div className={`transition-all duration-400 ease-out flex-shrink-0 border-l border-gray-200 ${
              isSidebarOpen 
                ? 'w-80 opacity-100 translate-x-0' 
                : 'w-0 opacity-0 translate-x-full overflow-hidden'
            }`}>
              <div className="h-screen overflow-y-auto">
                <div className="p-6">
                  <MarketplaceFilter
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    onReset={() => handleFilterChange(initialFilters)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Page Header - Mobile Compact */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-['Inter']">Marketplace</h1>
              <p className="text-gray-600 mt-1 font-['Inter'] text-sm">
                Temukan produk berkualitas dari berbagai penjual
              </p>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-500 font-['Inter']">
              Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Inter'] text-sm"
              >
                <Filter className="w-4 h-4" />
                Filter
                {hasActiveFilters && (
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                    {Object.keys(filters).filter(key => {
                      if (key === 'categories') return filters.categories.length > 0
                      if (key === 'priceRange') return filters.priceRange.min > 0 || filters.priceRange.max < 999999999
                      if (key === 'rating') return filters.rating !== null
                      if (key === 'inStockOnly') return filters.inStockOnly
                      if (key === 'sortBy') return filters.sortBy !== 'featured'
                      return false
                    }).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters - Mobile */}
        {hasActiveFilters && (
          <div className="bg-white border-b px-4 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter aktif:</span>
              
              {filters.categories.map((category) => (
                <div key={category} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>{categories.find(c => c.id === category)?.name}</span>
                  <button
                    onClick={() => handleFilterChange({
                      ...filters,
                      categories: filters.categories.filter(c => c !== category)
                    })}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {(filters.priceRange.min > 0 || filters.priceRange.max < 999999999) && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>
                    {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
                  </span>
                  <button
                    onClick={() => handleFilterChange({
                      ...filters,
                      priceRange: { min: 0, max: 999999999 }
                    })}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {filters.rating && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>Rating {filters.rating}+</span>
                  <button
                    onClick={() => handleFilterChange({ ...filters, rating: null })}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {filters.inStockOnly && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>In Stock Only</span>
                  <button
                    onClick={() => handleFilterChange({ ...filters, inStockOnly: false })}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button
                onClick={() => handleFilterChange(initialFilters)}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Hapus semua
              </button>
            </div>
          </div>
        )}

        {/* Products Grid - Mobile */}
        <div className="px-4 py-4 pb-20">
          <div className="grid grid-cols-2 gap-3">
            {paginatedProducts.map((product) => (
              <ProductCardModern
                key={`product-${product.id}`} // Pastikan key unik dan stabil
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
                  image: product.image || (product as any).images?.[0],
                  images: (product as any).images,
                  isNew: (product as any).isNew,
                  category: product.category
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal - Bottom Sheet */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
            {/* Handle Bar */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold font-['Inter']">Filter Produk</h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Filter Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <MarketplaceFilter
                filters={filters}
                onFiltersChange={handleFilterChange}
                onReset={() => handleFilterChange(initialFilters)}
              />
            </div>
            
            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t px-4 py-3 space-y-2">
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Terapkan Filter
              </button>
              <button
                onClick={() => {
                  handleFilterChange(initialFilters)
                  setShowMobileFilter(false)
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Quick View Modal - Disabled since we use navigation */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{quickViewProduct.name}</h2>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(quickViewProduct.price)}
                    </p>
                    <p className="text-gray-600">{quickViewProduct.description}</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleAddToCart(quickViewProduct)}
                      disabled={addingToCart === quickViewProduct.id}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {addingToCart === quickViewProduct.id ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(null)}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
