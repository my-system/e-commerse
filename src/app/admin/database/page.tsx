"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { categories } from '@/data/categories';

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
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  badges: string[];
  sizes?: Array<{ name: string; value: string; inStock: boolean }>;
  colors?: Array<{ name: string; value: string; inStock: boolean }>;
  specifications?: Record<string, string>;
}

export default function AdminDatabase() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const { userRole } = useSidebar();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // Remove auth check for development - allow direct access
      loadProducts();
    }
  }, [isLoading]);

  useEffect(() => {
    let filtered = products;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && getCategoryName(product.category).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredProducts(filtered);
  }, [products, searchTerm, statusFilter]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/pending-products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        
        // Also update localStorage to keep in sync
        if (typeof window !== 'undefined') {
          localStorage.setItem('seller_products', JSON.stringify(data.products || []));
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products from database');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    setProcessingId(productId);
    try {
      // Update local state immediately (optimistic update)
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              status: 'approved' as const,
              badges: Array.isArray(product.badges) 
                ? product.badges.filter((badge: any) => badge !== 'Pending')
                : JSON.parse(product.badges || '[]').filter((badge: any) => badge !== 'Pending'),
              updatedAt: new Date().toISOString()
            }
          : product
      );
      
      setProducts(updatedProducts);
      
      // Update localStorage to keep in sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('seller_products', JSON.stringify(updatedProducts));
      }
      
      // Try to call approval API
      try {
        const response = await fetch('/api/admin/approve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
        
        if (!response.ok) {
          console.warn('API approve failed, but local state was updated');
        } else {
          const result = await response.json();
          console.log('Approval result:', result);
        }
      } catch (apiError) {
        console.warn('API approve failed, but local state was updated:', apiError);
      }
      
      console.log('Product approved:', productId);
      
    } catch (error) {
      console.error('Error approving product:', error);
      setError('Failed to approve product');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (productId: string) => {
    if (!confirm('Are you sure you want to reject this product?')) return;
    
    setProcessingId(productId);
    try {
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              status: 'rejected' as const,
              badges: ['Rejected'],
              updatedAt: new Date().toISOString()
            }
          : product
      );
      
      setProducts(updatedProducts);
      
      // Update local state for demo
      console.log('Product rejected:', productId);
      
    } catch (error) {
      console.error('Error rejecting product:', error);
      setError('Failed to reject product');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getCategoryName = (categoryId: string) => {
    // Direct mapping from category ID to name
    const categoryMap: Record<string, string> = {
      'fashion': 'Fashion',
      'shoes': 'Shoes', 
      'accessories': 'Accessories',
      'bags': 'Bags',
      'jewelry': 'Jewelry',
      'electronics': 'Electronics'
    };
    
    // If it's an ID, map it. If it's already a name, return it with proper casing
    if (categoryMap[categoryId]) {
      return categoryMap[categoryId];
    }
    
    // Return proper casing for category names (handle legacy data)
    const categoryLower = categoryId.toLowerCase();
    const categoryNames = ['fashion', 'shoes', 'accessories', 'bags', 'jewelry', 'electronics'];
    if (categoryNames.includes(categoryLower)) {
      return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    }
    
    // Return as-is for unknown categories
    return categoryId;
  };

  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Database</h1>
              <p className="text-gray-600 mt-1">Kelola dan review produk dari seller</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>{stats.total} Total Products</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name or category..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'approved' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'rejected' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Products List</h2>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'No products have been uploaded yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.images?.split(',')[0] || '/api/placeholder/100/100'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.title}</p>
                              <p className="text-sm text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                            {getCategoryName(product.category || '')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">Rp {(product.price || 0).toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            <span className="capitalize">{product.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/product/${product.id}`}
                              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-block"
                              title="View Product"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            {product.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(product.id)}
                                  disabled={processingId === product.id}
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                  title="Approve Product"
                                >
                                  {processingId === product.id ? (
                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReject(product.id)}
                                  disabled={processingId === product.id}
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                  title="Reject Product"
                                >
                                  {processingId === product.id ? (
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                </button>
                              </>
                            )}
                            
                            {product.status === 'approved' && (
                              <div className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                Published
                              </div>
                            )}
                            
                            {product.status === 'rejected' && (
                              <div className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                                Rejected
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
