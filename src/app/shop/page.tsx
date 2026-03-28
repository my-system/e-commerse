"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import FilterButton from '@/components/mobile/FilterButton';
import { FilterState, pricePresets } from '@/lib/product-utils';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { filterProducts, sortProducts, paginateProducts, getTotalPages, generateMoreProducts } from '@/lib/product-utils';
import { formatPrice } from '@/lib/utils';
import { Filter, X, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const PRODUCTS_PER_PAGE = 12;

const initialFilters = {
  category: '',
  priceMin: 0,
  priceMax: 999999999,
  rating: null,
};

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist } = useWishlist();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [allProducts, setAllProducts] = useState(products);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Generate more products for demo
  useEffect(() => {
    const moreProducts = generateMoreProducts(products, 40);
    setAllProducts([...products, ...moreProducts]);
  }, []);

  // Memoize handlers to prevent re-renders
  const handleQuickView = useCallback((product: any) => {
    setQuickViewProduct(product);
  }, []);

  const handleAddToCart = useCallback(async (product: any) => {
    setAddingToCart(product.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const cartItem = {
        id: Date.now().toString(),
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
  }, [addItem]);

  const handleProductClick = useCallback((product: any) => {
    // Only navigate, don't track to prevent side effects
    router.push(`/products/${product.id}`);
  }, [router]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = filterProducts(allProducts, filters);
    let sorted = sortProducts(filtered, 'featured'); // Fixed sortBy
    
    // Debug: Log product IDs to see if order changes
    console.log('Filtered products count:', filtered.length);
    console.log('Active filters:', filters);
    
    return sorted;
  }, [allProducts, filters]); // Include all filter dependencies

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const hasActiveFilters = filters.category !== '' || 
                          filters.priceMin > 0 || 
                          filters.priceMax < 999999999 || 
                          filters.rating !== null;

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
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Filter Produk</h3>
                <div className="space-y-4">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-2">Kategori</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.category === category.id}
                            onChange={() => handleFilterChange({ ...filters, category: category.id })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2">Rentang Harga</h4>
                    <div className="space-y-2">
                      {pricePresets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => handleFilterChange({ 
                            ...filters, 
                            priceMin: preset.priceMin, 
                            priceMax: preset.priceMax 
                          })}
                          className={`w-full text-left px-3 py-2 rounded ${
                            filters.priceMin === preset.priceMin && filters.priceMax === preset.priceMax
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-medium mb-2">Urutkan</h4>
                    <select
                      value={filters.rating || 'featured'}
                      onChange={(e) => handleFilterChange({ 
                        ...filters, 
                        rating: e.target.value === 'featured' ? null : parseFloat(e.target.value) 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                    >
                      <option value="featured">Featured</option>
                      <option value="1">Rating 1+</option>
                      <option value="2">Rating 2+</option>
                      <option value="3">Rating 3+</option>
                      <option value="4">Rating 4+</option>
                      <option value="5">Rating 5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter aktif:</span>
                    
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {categories.find(c => c.slug === filters.category)?.name || filters.category}
                        <button
                          onClick={() => handleFilterChange({ ...filters, category: '' })}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    
                    {(filters.priceMin > 0 || filters.priceMax < 999999999) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {(() => {
                          const preset = pricePresets.find(p => p.priceMin === filters.priceMin && p.priceMax === filters.priceMax);
                          if (preset) return preset.label;
                          return `Rp ${filters.priceMin.toLocaleString('id-ID')} - ${filters.priceMax === 999999999 ? '∞' : `Rp ${filters.priceMax.toLocaleString('id-ID')}`}`;
                        })()}
                        <button
                          onClick={() => handleFilterChange({ ...filters, priceMin: 0, priceMax: 999999999 })}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    
                    {filters.rating !== null && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {filters.rating === 5 && '5★'}
                        {filters.rating === 4 && '4★'}
                        {filters.rating === 3 && '3★'}
                        {filters.rating === 2 && '2★'}
                        {filters.rating === 1 && '1★'}
                        <button
                          onClick={() => handleFilterChange({ ...filters, rating: null })}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={`${product.id}-${index}`} // More stable key
                      product={product}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                      isWishlisted={isInWishlist(product.id)}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                </div>
              )}

              {/* Simple Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
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
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <Navbar />
        
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
              <FilterButton
                filters={filters}
                onFiltersChange={handleFilterChange}
                onReset={() => handleFilterChange({ category: '', priceMin: 0, priceMax: 10000000, rating: null })}
              />
            </div>
          </div>
        </div>

        {/* Active Filters - Mobile */}
        {hasActiveFilters && (
          <div className="bg-white border-b px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter aktif:</span>
              
              {filters.category && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>{categories.find(c => c.id === filters.category)?.name}</span>
                  <button
                    onClick={() => handleFilterChange({ ...filters, category: '' })}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {(filters.priceMin > 0 || filters.priceMax < 10000000) && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>
                    {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
                  </span>
                  <button
                    onClick={() => handleFilterChange({ ...filters, priceMin: 0, priceMax: 10000000 })}
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
              
              <button
                onClick={() => handleFilterChange({ category: '', priceMin: 0, priceMax: 10000000, rating: null })}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Hapus semua
              </button>
            </div>
          </div>
        )}

        {/* Products Grid - Mobile */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            ))}
          </div>

          {/* Pagination - Mobile */}
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
                      onClick={() => {}}
                      disabled={addingToCart === quickViewProduct.id}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isInWishlist(quickViewProduct?.id || '')
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isInWishlist(quickViewProduct?.id || '') ? '❤️ Di Wishlist' : '🤍 Tambah ke Wishlist'}
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
