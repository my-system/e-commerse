"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Plus, Search, Filter, Edit, Trash2, Eye, Check, X, Clock, AlertCircle, RefreshCw } from 'lucide-react';

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
  // Additional fields for admin functionality
  slug?: string;
  originalPrice?: number;
  stock?: number;
  isHot?: boolean;
  isNew?: boolean;
  fullDescription?: string;
  sizes?: Array<{ name: string; available: boolean }>;
  colors?: string[];
  fit?: string;
  neckline?: string;
  sleeve?: string;
}

interface ApiResponse {
  success: boolean;
  products?: Product[];
  message?: string;
  error?: string;
}

export default function AdminProducts() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'pending' | 'marketplace'>('pending');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Get tab from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'marketplace') {
      setActiveTab('marketplace');
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTab === 'marketplace') {
      url.searchParams.set('tab', 'marketplace');
    } else {
      url.searchParams.delete('tab');
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  // Parse images safely
  const parseImages = (imagesData: string | string[]): string[] => {
    if (!imagesData) return [];
    
    // Convert to string if not already
    const imagesString = String(imagesData);
    
    // Check if it's a single base64 data URL
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
      
      let apiUrl = '';
      if (activeTab === 'marketplace') {
        apiUrl = '/api/marketplace-products';
        console.log('🔄 Fetching marketplace products...');
      } else {
        apiUrl = '/api/admin/pending-products';
        console.log('🔄 Fetching pending products...');
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success && result.products) {
        console.log(`✅ Fetched ${result.products.length} ${activeTab} products`);
        setProducts(result.products);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || `Failed to fetch ${activeTab} products`);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} products:`, error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch data when tab changes
  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const handleApprove = async (productId: string) => {
    try {
      setActionLoading(productId);
      
      console.log(`✅ Approving product: ${productId}`);
      const response = await fetch('/api/admin/pending-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action: 'approve'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Refresh products list
        await fetchProducts();
        
        // Show success message
        const product = products.find(p => p.id === productId);
        alert(`✅ Produk "${product?.title}" berhasil disetujui dan dipublish ke marketplace!`);
      } else {
        throw new Error(result.error || 'Gagal menyetujui produk');
      }
    } catch (error) {
      console.error('Error approving product:', error);
      alert(`❌ Gagal menyetujui produk: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (productId: string, reason: string = 'Produk tidak memenuhi kriteria') => {
    try {
      setActionLoading(productId);
      
      console.log(`❌ Rejecting product: ${productId}`);
      const response = await fetch('/api/admin/pending-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action: 'reject',
          reason
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Refresh products list
        await fetchProducts();
        
        // Show success message
        const product = products.find(p => p.id === productId);
        alert(`❌ Produk "${product?.title}" berhasil ditolak: ${reason}`);
      } else {
        throw new Error(result.error || 'Gagal menolak produk');
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert(`❌ Gagal menolak produk: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const confirmMessage = activeTab === 'marketplace' 
      ? `Apakah Anda yakin ingin menghapus produk "${product.title}" dari marketplace?`
      : `Apakah Anda yakin ingin menghapus produk "${product.title}"?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    try {
      setActionLoading(productId);
      
      let apiUrl = '';
      if (activeTab === 'marketplace') {
        apiUrl = `/api/marketplace-products?id=${productId}`;
        console.log(`🗑️ Deleting marketplace product: ${productId}`);
      } else {
        apiUrl = `/api/admin/pending-products?id=${productId}`;
        console.log(`🗑️ Deleting pending product: ${productId}`);
      }
      
      const response = await fetch(apiUrl, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Refresh products list
        await fetchProducts();
        
        const successMessage = activeTab === 'marketplace'
          ? `🗑️ Produk "${product.title}" berhasil dihapus dari marketplace`
          : `🗑️ Produk "${product.title}" berhasil dihapus`;
        alert(successMessage);
      } else {
        throw new Error(result.error || 'Gagal menghapus produk');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`❌ Gagal menghapus produk: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const handleRefresh = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Persetujuan';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Header with Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Products
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'marketplace'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Marketplace Products
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'pending' ? 'Produk Menunggu Persetujuan' : 'Marketplace Products'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === 'pending' 
                    ? 'Kelola produk yang diunggah oleh seller'
                    : 'Kelola produk yang sudah disetujui di marketplace'
                  }
                  {lastUpdated && (
                    <span className="ml-2">
                      • Terakhir update: {formatDate(lastUpdated.toISOString())}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                {activeTab === 'pending' && (
                  <Link
                    href="/admin/products/create"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">Error:</span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Persetujuan</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Elektronik</option>
                    <option value="home">Home</option>
                    <option value="beauty">Beauty</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                  </select>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Total: <span className="font-medium text-gray-900">{products.length}</span> produk
                    </span>
                    <span className="text-gray-600">
                      Ditampilkan: <span className="font-medium text-gray-900">{filteredProducts.length}</span> produk
                    </span>
                  </div>
                  {products.length > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full"></div>
                        Pending: {products.filter(p => p.status === 'pending').length}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
                        Approved: {products.filter(p => p.status === 'approved').length}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></div>
                        Rejected: {products.filter(p => p.status === 'rejected').length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Memuat produk...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
                      ? 'Tidak ada produk yang cocok dengan filter' 
                      : 'Tidak ada produk menunggu persetujuan'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
                      ? 'Coba ubah filter atau kata kunci pencarian' 
                      : 'Semua produk telah diproses atau belum ada produk baru'}
                  </p>
                  {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
                    <Link
                      href="/admin/products/create"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Produk
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const images = parseImages(product.images);
                    const isLoading = actionLoading === product.id;
                    
                    return (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100">
                          {images.length > 0 ? (
                            <img
                              src={images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Eye className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(product.status)}`}>
                              {getStatusIcon(product.status)}
                              {getStatusText(product.status)}
                            </span>
                          </div>
                          
                          {/* Featured Badge */}
                          {product.featured && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 truncate mb-1">{product.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                          
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-lg font-bold text-blue-600">
                                Rp {product.price.toLocaleString('id-ID')}
                              </p>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <p className="text-sm text-gray-400 line-through">
                                  Rp {product.originalPrice.toLocaleString('id-ID')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400 text-sm">★</span>
                                <span className="text-sm text-gray-600">{product.rating ?? 0}</span>
                              </div>
                              <p className="text-xs text-gray-500">{product.reviews ?? 0} ulasan</p>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="text-xs text-gray-500 mb-3">
                            <p>Seller: {product.sellerId}</p>
                            <p>Ditambah: {formatDate(product.createdAt)}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewProduct(product.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                            >
                              <Eye className="w-3 h-3" />
                              Lihat
                            </button>
                            
                            {activeTab === 'pending' && product.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApprove(product.id)}
                                  disabled={isLoading}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleReject(product.id)}
                                  disabled={isLoading}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <X className="w-3 h-3" />
                                  )}
                                  Reject
                                </button>
                              </>
                            )}
                            
                            <button 
                              onClick={() => handleDelete(product.id)}
                              disabled={isLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={activeTab === 'marketplace' ? 'Hapus dari marketplace' : 'Hapus produk'}
                            >
                              {isLoading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
