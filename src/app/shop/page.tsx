"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/MobileNavigation';
import ProductCard from '@/components/ui/ProductCard';
import FilterSidebar, { FilterState } from '@/components/ui/FilterSidebar';
import SortingControls from '@/components/ui/SortingControls';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { filterProducts, sortProducts, paginateProducts, getTotalPages, generateMoreProducts } from '@/lib/product-utils';
import { formatPrice } from '@/lib/utils';
import { Filter, X, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const PRODUCTS_PER_PAGE = 12;

const initialFilters: FilterState = {
  categories: [],
  priceRange: {
    min: 0,
    max: Infinity,
  },
  rating: 0,
  sortBy: 'featured',
};

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState(products);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Generate more products for demo
  useEffect(() => {
    const moreProducts = generateMoreProducts(products, 40);
    setAllProducts([...products, ...moreProducts]);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = filterProducts(allProducts, filters);
    let sorted = sortProducts(filtered, filters.sortBy);
    return sorted;
  }, [allProducts, filters]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredAndSortedProducts, currentPage, PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Calculate pagination
  const totalPages = useMemo(() => {
    return getTotalPages(filteredAndSortedProducts.length, PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters(initialFilters);
    setShowMobileFilter(false);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleProductClick = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const cartItem = {
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      };
      addItem(cartItem);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleWishlist = (product: any) => {
    setWishlist(prev => 
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.priceRange.min > 0 || 
                          filters.priceRange.max < Infinity || 
                          filters.rating > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <Navbar />
        
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-gray-700 transition-colors duration-200">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Shop</span>
            </nav>
            
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Semua Produk</h1>
                <p className="text-gray-600 mt-1">
                  Temukan produk berkualitas dengan harga terbaik
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter aktif:</span>
                    
                    {filters.categories.map((categoryId) => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <span key={categoryId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {category.name}
                          <button
                            onClick={() => handleFilterChange({
                              ...filters,
                              categories: filters.categories.filter(id => id !== categoryId)
                            })}
                            className="hover:text-blue-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                    
                    {(filters.priceRange.min > 0 || filters.priceRange.max < Infinity) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        Rp {filters.priceRange.min.toLocaleString('id-ID')} - {filters.priceRange.max === Infinity ? '∞' : `Rp ${filters.priceRange.max.toLocaleString('id-ID')}`}
                        <button
                          onClick={() => handleFilterChange({
                            ...filters,
                            priceRange: { min: 0, max: Infinity }
                          })}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    
                    {filters.rating > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {filters.rating}★ ke atas
                        <button
                          onClick={() => handleFilterChange({
                            ...filters,
                            rating: 0
                          })}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    
                    <button
                      onClick={handleFilterReset}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      Reset semua
                    </button>
                  </div>
                </div>
              )}

              {/* Sorting Controls */}
              <SortingControls
                currentSort={filters.sortBy}
                onSortChange={handleSortChange}
                totalProducts={filteredAndSortedProducts.length}
                currentPage={currentPage}
                productsPerPage={PRODUCTS_PER_PAGE}
              />

              {/* Products Grid */}
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={handleQuickView}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.includes(product.id)}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <EmptyState
                  type={hasActiveFilters ? 'filter-no-results' : 'no-products'}
                  onReset={handleFilterReset}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileNavigation>
          {/* Page Header */}
          <div className="bg-white border-b">
            <div className="px-4 py-6">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <a href="/" className="hover:text-gray-700 transition-colors duration-200">
                  Home
                </a>
                <span>/</span>
                <span className="text-gray-900 font-medium">Shop</span>
              </nav>
              
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Semua Produk</h1>
                  <p className="text-gray-600 mt-1">
                    Temukan produk berkualitas dengan harga terbaik
                  </p>
                </div>
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 sm:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Mobile */}
          <div className="px-4 py-8">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 p-4 bg-white rounded-lg border">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Filter aktif:</span>
                  
                  {filters.categories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <span key={categoryId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {category.name}
                        <button
                          onClick={() => handleFilterChange({
                            ...filters,
                            categories: filters.categories.filter(id => id !== categoryId)
                          })}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  
                  {(filters.priceRange.min > 0 || filters.priceRange.max < Infinity) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Rp {filters.priceRange.min.toLocaleString('id-ID')} - {filters.priceRange.max === Infinity ? '∞' : `Rp ${filters.priceRange.max.toLocaleString('id-ID')}`}
                      <button
                        onClick={() => handleFilterChange({
                          ...filters,
                          priceRange: { min: 0, max: Infinity }
                        })}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.rating > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {filters.rating}★ ke atas
                      <button
                        onClick={() => handleFilterChange({
                          ...filters,
                          rating: 0
                        })}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={handleFilterReset}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Reset semua
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.includes(product.id)}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState
                type={hasActiveFilters ? 'filter-no-results' : 'no-products'}
                onReset={handleFilterReset}
              />
            )}
          </div>
        </MobileNavigation>
      </div>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="/checkout"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 group"
        >
          <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span>Checkout</span>
        </a>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFilterChange}
          onReset={handleFilterReset}
          isMobile
          onClose={() => setShowMobileFilter(false)}
        />
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
                <button 
                  onClick={closeQuickView}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={quickViewProduct.images[0]}
                    alt={quickViewProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {quickViewProduct.title}
                  </h3>
                  
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {formatPrice(quickViewProduct.price)}
                  </div>

                  <p className="text-gray-600 mb-6">
                    {quickViewProduct.description}
                  </p>

                  {/* Product Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Material</h4>
                      <p className="text-gray-600">{quickViewProduct.material || 'Premium Quality'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
                      <p className="text-gray-600">{quickViewProduct.care || 'Machine wash cold'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAddToCart(quickViewProduct)}
                      disabled={addingToCart === quickViewProduct.id}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart === quickViewProduct.id ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </button>
                    <button 
                      onClick={() => handleToggleWishlist(quickViewProduct)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        wishlist.includes(quickViewProduct.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {wishlist.includes(quickViewProduct.id) ? '❤️ Di Wishlist' : '🤍 Tambah Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
