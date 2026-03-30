"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ProductCard from '@/components/ui/ProductCard';
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
  const [allProducts, setAllProducts] = useState(products);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Generate more products for demo and add real products
  useEffect(() => {
    const moreProducts = generateMoreProducts(products, 40);
    
    // Fetch real products from marketplace API
    const fetchRealProducts = async () => {
      try {
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
          
          // Combine dummy and real products
          setAllProducts([...products, ...moreProducts, ...realProducts]);
        } else {
          setAllProducts([...products, ...moreProducts]);
        }
      } catch (error) {
        console.error('Error fetching real products:', error);
        setAllProducts([...products, ...moreProducts]);
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
        {/* Page Header - Compact */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1 font-sans">
              <a href="/" className="hover:text-gray-700 transition-colors duration-200">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Marketplace</span>
            </nav>
            
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-['Inter']">Marketplace</h1>
                <p className="text-gray-600 mt-0 font-['Inter']">
                  Temukan produk berkualitas dari berbagai penjual terpercaya
                </p>
              </div>
              
              {/* Results Count */}
              <div className="text-sm text-gray-500 font-['Inter']">
                Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Strict 12 Column Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-start px-4">
          {/* Sidebar Filter - 3 columns (separate house) */}
          <div className="col-span-3 sticky top-24 h-fit">
            <MarketplaceFilter
              filters={filters}
              onFiltersChange={handleFilterChange}
              onReset={() => handleFilterChange(initialFilters)}
            />
          </div>

          {/* Products Grid - 9 columns (separate house) */}
          <div className="col-span-9">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="bg-white border rounded-lg p-4 mb-6">
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Page Header - Mobile Compact */}
        <div className="bg-white border-b px-4 py-2">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-1">
                Temukan produk berkualitas dari berbagai penjual
              </p>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-500">
              Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
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
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isWishlisted={isInWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filter</h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <MarketplaceFilter
                filters={filters}
                onFiltersChange={handleFilterChange}
                onReset={() => handleFilterChange(initialFilters)}
              />
              
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Terapkan Filter
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
