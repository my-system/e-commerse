"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import SortingControls from '@/components/ui/SortingControls';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { sortProducts, paginateProducts, getTotalPages } from '@/lib/product-utils';
import { useCart } from '@/contexts/CartContext';
import { ArrowRight, Filter } from 'lucide-react';

const PRODUCTS_PER_PAGE = 12;

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const slug = params.slug as string;
  
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(categories[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Find category by slug
  useEffect(() => {
    const foundCategory = categories.find(cat => cat.slug === slug);
    
    if (!foundCategory) {
      router.push('/marketplace');
      return;
    }
    
    setCategory(foundCategory);
    setIsLoading(false);
  }, [slug, router]);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    return products.filter(product => product.category === slug);
  }, [slug]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProducts(categoryProducts, sortBy);
  }, [categoryProducts, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    return paginateProducts(sortedProducts, currentPage, PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // Calculate pagination
  const totalPages = useMemo(() => {
    return getTotalPages(sortedProducts.length, PRODUCTS_PER_PAGE);
  }, [sortedProducts]);

  // Reset page when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    };
    
    addItem(cartItem);
    console.log('Added to cart:', product.title);
  };

  const handleToggleWishlist = (product: any) => {
    console.log('Toggle wishlist:', product.title);
  };

  const handleQuickView = (product: any) => {
    console.log('Quick view:', product.title);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-square" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700 transition-colors duration-200">
              Home
            </a>
            <span>/</span>
            <a href="/marketplace" className="hover:text-gray-700 transition-colors duration-200">
              Shop
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">{slug}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {categoryProducts.length} produk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sorting Controls */}
        <div className="mb-6">
          <SortingControls
            currentSort={sortBy}
            onSortChange={handleSortChange}
            totalProducts={sortedProducts.length}
            currentPage={currentPage}
            productsPerPage={PRODUCTS_PER_PAGE}
          />
        </div>

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
                  onClick={handleProductClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            type="no-products"
            onReset={() => router.push('/marketplace')}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
