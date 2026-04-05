"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Plus, Search, Filter, Edit, Trash2, Eye, Check, X, Clock, AlertCircle, RefreshCw, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  images: string;
  material?: string;
  care?: string;
  status: 'pending' | 'approved' | 'rejected';
  badges: string | string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

interface ApiResponse {
  success: boolean;
  products?: Product[];
  message?: string;
  error?: string;
}

export default function AdminMarketplaceProducts() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Parse images safely
  const parseImages = (imagesData: string | string[]): string[] => {
    if (!imagesData) return [];
    
    const imagesString = String(imagesData);
    
    if (imagesString.startsWith('data:image')) {
      return [imagesString];
    }
    
    try {
      const parsed = JSON.parse(imagesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing images:', error);
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching marketplace products...');
      const response = await fetch('/api/marketplace-products');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success && result.products) {
        console.log(`✅ Fetched ${result.products.length} marketplace products`);
        setProducts(result.products);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch marketplace products');
      }
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.title}" dari marketplace?`)) {
      return;
    }
    
    try {
      setActionLoading(productId);
      
      console.log(`🗑️ Deleting marketplace product: ${productId}`);
      const response = await fetch(`/api/marketplace-products?id=${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Refresh products list
        await fetchProducts();
        
        alert(`🗑️ Produk "${product.title}" berhasil dihapus dari marketplace`);
      } else {
        throw new Error(result.error || 'Gagal menghapus produk dari marketplace');
      }
    } catch (error) {
      console.error('Error deleting marketplace product:', error);
      alert(`❌ Gagal menghapus produk dari marketplace: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProduct = (productId: string) => {
    // Find product and generate slug
    const product = products.find(p => p.id === productId);
    if (product) {
      const slug = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      window.open(`/product/${slug}`, '_blank');
    }
  };

  const isActionLoading = (productId: string) => actionLoading === productId;

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketplace Products</h1>
                <p className="text-gray-600 mt-1">Kelola produk yang sudah disetujui di marketplace</p>
              </div>
              
              <div className="flex items-center gap-4">
                {lastUpdated && (
                  <span className="text-sm text-gray-500">
                    Last updated: {formatDate(lastUpdated.toISOString())}
                  </span>
                )}
                
                <button
                  onClick={fetchProducts}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading marketplace products...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No marketplace products found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No products have been approved for the marketplace yet'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approved
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const images = parseImages(product.images);
                      const firstImage = images[0] || '/placeholder.jpg';
                      
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={firstImage}
                                  alt={product.title}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {product.id}
                                </div>
                                {product.featured && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm text-gray-900">{product.rating.toFixed(1)}</span>
                              <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.inStock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.approvedAt ? formatDate(product.approvedAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleViewProduct(product.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="View Product"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={isActionLoading(product.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Product"
                              >
                                {isActionLoading(product.id) ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Summary */}
              <div className="bg-gray-50 px-6 py-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {filteredProducts.length} of {products.length} marketplace products
                  </div>
                  <div className="text-sm text-gray-500">
                    {products.filter(p => p.featured).length} featured, {products.filter(p => p.inStock).length} in stock
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
