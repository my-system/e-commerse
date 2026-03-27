"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';
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
      await addItem({
        id: product.id,
        productId: product.id,
        title: product.name,
        price: product.price,
        image: product.image,
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
    return filterProducts(allProducts, filters);
  }, [allProducts, filters]);

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, 'featured');
  }, [filteredProducts]);

  const paginatedProducts = useMemo(() => {
    return paginateProducts(sortedProducts, currentPage, PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const totalPages = useMemo(() => {
    return getTotalPages(sortedProducts.length, PRODUCTS_PER_PAGE);
  }, [sortedProducts.length]);

  const hasActiveFilters = useMemo(() => {
    return filters.category !== '' || filters.priceMin > 0 || filters.priceMax < 999999999 || filters.rating !== null;
  }, [filters]);

  return (
    <LayoutWithSidebar>
      {/* Desktop Version */}
      <div className="hidden md:block">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-gray-700 transition-colors duration-200">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Marketplace</span>
            </nav>
            
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-600 mt-1">
                  Temukan produk berkualitas dari berbagai penjual terpercaya
                </p>
              </div>
              
              {/* Results Count */}
              <div className="text-sm text-gray-500">
                Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                
                {(filters.priceMin > 0 || filters.priceMax < 999999999) && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    <span>
                      {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
                    </span>
                    <button
                      onClick={() => handleFilterChange({ ...filters, priceMin: 0, priceMax: 999999999 })}
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
                  onClick={() => handleFilterChange(initialFilters)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Hapus semua
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
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
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    isWishlisted={isInWishlist(product.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
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
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="px-4 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-gray-700 transition-colors duration-200">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Marketplace</span>
            </nav>
            
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-600 mt-1">
                  Temukan produk berkualitas dari berbagai penjual
                </p>
              </div>
              
              {/* Mobile Filter Button */}
              <FilterButton
                filters={filters}
                onFiltersChange={handleFilterChange}
                onReset={() => handleFilterChange(initialFilters)}
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
              
              {(filters.priceMin > 0 || filters.priceMax < 999999999) && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <span>
                    {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
                  </span>
                  <button
                    onClick={() => handleFilterChange({ ...filters, priceMin: 0, priceMax: 999999999 })}
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
                onClick={() => handleFilterChange(initialFilters)}
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
                isWishlisted={isInWishlist(product.id)}
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
    </LayoutWithSidebar>
  );
}
