"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye, Check, X, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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

// Animated Counter Component for Stats
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.5 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
}

// Animated Product Card Component
function AnimatedProductCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {children}
    </motion.div>
  );
}

// Tab Animation Component
function AnimatedTab({ isActive, children, onClick }: { 
  isActive: boolean; 
  children: React.ReactNode; 
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

export default function AdminProducts() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
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
    if (!imagesData) return ['/placeholder.jpg'];
    
    // Convert to string if not already
    const imagesString = String(imagesData);
    
    // Check if it's a single base64 data URL
    if (imagesString.startsWith('data:image')) {
      return [imagesString];
    }
    
    // Check if it's a single URL (http/https or relative)
    if (imagesString.startsWith('http') || imagesString.startsWith('/') || imagesString.startsWith('images/')) {
      return [imagesString];
    }
    
    try {
      const parsed = JSON.parse(imagesString);
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? parsed : ['/placeholder.jpg'];
      }
      return [imagesString];
    } catch (error) {
      console.error('Error parsing images:', error);
      // Return as single image if it's not empty, otherwise placeholder
      return imagesString.trim() ? [imagesString] : ['/placeholder.jpg'];
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let apiUrl = '';
      if (activeTab === 'marketplace') {
        apiUrl = '/api/marketplace-products';
        console.log('Fetching marketplace products...');
      } else {
        apiUrl = '/api/admin/pending-products';
        console.log('Fetching pending products...');
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success && result.products) {
        console.log(`Successfully fetched ${result.products.length} ${activeTab} products`);
        setProducts(result.products);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || `Failed to fetch ${activeTab} products`);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} products:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('Failed to fetch')) {
        setError('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.');
      } else if (errorMessage.includes('HTTP 404')) {
        setError('Endpoint tidak ditemukan. Silakan hubungi administrator.');
      } else if (errorMessage.includes('HTTP 500')) {
        setError('Terjadi kesalahan pada server. Silakan coba lagi beberapa saat.');
      } else {
        setError(errorMessage);
      }
      
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
      <div>
        <div className="flex-1">
          {/* Header with Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10"
          >
            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-4 relative">
              <AnimatedTab 
                isActive={activeTab === 'pending'} 
                onClick={() => setActiveTab('pending')}
              >
                Pending Products
              </AnimatedTab>
              <AnimatedTab 
                isActive={activeTab === 'marketplace'} 
                onClick={() => setActiveTab('marketplace')}
              >
                Marketplace Products
              </AnimatedTab>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div>
                <motion.h1 
                  key={activeTab}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {activeTab === 'pending' ? 'Produk Menunggu Persetujuan' : 'Marketplace Products'}
                </motion.h1>
                <motion.p 
                  key={`desc-${activeTab}`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-sm text-gray-500 mt-1"
                >
                  {activeTab === 'pending' 
                    ? 'Kelola produk yang diunggah oleh seller'
                    : 'Kelola produk yang sudah disetujui di marketplace'
                  }
                  {lastUpdated && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="ml-2"
                    >
                      • Terakhir update: {formatDate(lastUpdated.toISOString())}
                    </motion.span>
                  )}
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <motion.button
                  onClick={handleRefresh}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <motion.div
                    animate={loading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </motion.div>
                  <span>Refresh</span>
                </motion.button>
                {activeTab === 'pending' && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/admin/products/create"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.div>
                      <span>Tambah Produk</span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </motion.div>
                  <span className="text-red-800 font-medium">Error:</span>
                  <span className="text-red-700">{error}</span>
                </div>
                <motion.button
                  onClick={handleRefresh}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="p-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="flex flex-col lg:flex-row gap-4"
              >
                <div className="flex-1">
                  <div className="relative">
                    <motion.div
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </motion.div>
                    <motion.input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 180, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Filter className="w-4 h-4 text-gray-400" />
                  </motion.div>
                  <motion.select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Persetujuan</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </motion.select>
                  <motion.select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Elektronik</option>
                    <option value="home">Home</option>
                    <option value="beauty">Beauty</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                  </motion.select>
                </motion.div>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.4 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex items-center justify-between text-sm">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.5 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-gray-600">
                      Total: <span className="font-medium text-gray-900"><AnimatedCounter value={products.length} /></span> produk
                    </span>
                    <span className="text-gray-600">
                      Ditampilkan: <span className="font-medium text-gray-900"><AnimatedCounter value={filteredProducts.length} /></span> produk
                    </span>
                  </motion.div>
                  {products.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.6 }}
                      className="flex items-center gap-4 text-sm"
                    >
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full"
                        />
                        Pending: <AnimatedCounter value={products.filter(p => p.status === 'pending').length} />
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                          className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"
                        />
                        Approved: <AnimatedCounter value={products.filter(p => p.status === 'approved').length} />
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                          className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"
                        />
                        Rejected: <AnimatedCounter value={products.filter(p => p.status === 'rejected').length} />
                      </motion.span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Products Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="ml-3 text-gray-600"
                  >
                    Memuat produk...
                  </motion.span>
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Eye className="w-8 h-8 text-gray-400" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-lg font-medium text-gray-900 mb-2"
                  >
                    {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
                      ? 'Tidak ada produk yang cocok dengan filter' 
                      : 'Tidak ada produk menunggu persetujuan'}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-gray-500 mb-4"
                  >
                    {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
                      ? 'Coba ubah filter atau kata kunci pencarian' 
                      : 'Semua produk telah diproses atau belum ada produk baru'}
                  </motion.p>
                  {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                        Tambah Produk
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => {
                    const images = parseImages(product.images);
                    const isLoading = actionLoading === product.id;
                    
                    return (
                      <AnimatedProductCard key={product.id} index={index}>
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100">
                          {images.length > 0 ? (
                            <motion.img
                              src={images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-1.jpg';
                              }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <Eye className="w-12 h-12 text-gray-400" />
                              </motion.div>
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                            className="absolute top-2 left-2"
                          >
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(product.status)}`}>
                              <motion.div
                                animate={{ rotate: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                {getStatusIcon(product.status)}
                              </motion.div>
                              {getStatusText(product.status)}
                            </span>
                          </motion.div>
                          
                          {/* Featured Badge */}
                          {product.featured && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                              className="absolute top-2 right-2"
                            >
                              <motion.span 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                              >
                                Featured
                              </motion.span>
                            </motion.div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                            className="font-medium text-gray-900 truncate mb-1"
                          >
                            {product.title}
                          </motion.h3>
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className="text-sm text-gray-500 mb-2"
                          >
                            {product.category}
                          </motion.p>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                            className="flex items-center justify-between mb-2"
                          >
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
                                <motion.span
                                  animate={{ rotate: [0, 360] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                  className="text-yellow-400 text-sm"
                                >
                                  ★
                                </motion.span>
                                <span className="text-sm text-gray-600">{product.rating ?? 0}</span>
                              </div>
                              <p className="text-xs text-gray-500">{product.reviews ?? 0} ulasan</p>
                            </div>
                          </motion.div>

                          {/* Additional Info */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                            className="text-xs text-gray-500 mb-3"
                          >
                            <p>Seller: {product.sellerId}</p>
                            <p>Ditambah: {formatDate(product.createdAt)}</p>
                          </motion.div>

                          {/* Actions */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                            className="flex flex-wrap gap-2"
                          >
                            <motion.button
                              onClick={() => handleViewProduct(product.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Eye className="w-3 h-3" />
                              </motion.div>
                              Lihat
                            </motion.button>
                            
                            {activeTab === 'pending' && product.status === 'pending' && (
                              <>
                                <motion.button 
                                  onClick={() => handleApprove(product.id)}
                                  disabled={isLoading}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: 15 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Check className="w-3 h-3" />
                                    </motion.div>
                                  )}
                                  Approve
                                </motion.button>
                                <motion.button 
                                  onClick={() => handleReject(product.id)}
                                  disabled={isLoading}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: -15 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <X className="w-3 h-3" />
                                    </motion.div>
                                  )}
                                  Reject
                                </motion.button>
                              </>
                            )}
                            
                            <motion.button 
                              onClick={() => handleDelete(product.id)}
                              disabled={isLoading}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={activeTab === 'marketplace' ? 'Hapus dari marketplace' : 'Hapus produk'}
                            >
                              {isLoading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.div>
                              )}
                            </motion.button>
                          </motion.div>
                        </div>
                      </AnimatedProductCard>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
