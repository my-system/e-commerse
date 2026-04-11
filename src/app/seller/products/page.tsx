"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, Edit, Trash2, Plus, Clock, Check, X, AlertTriangle, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/data/categories';
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
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  badges: string[];
  sellerId: string;
  slug?: string;
}

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function SellerProductsPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Helper function for safe image parsing
  const parseImages = (imagesData: string | null | any): string[] => {
    if (!imagesData) return [];
    
    // If it's already an array, return as is
    if (Array.isArray(imagesData)) {
      return imagesData;
    }
    
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

  useEffect(() => {
    if (!isLoading) {
      // Remove auth check for development - allow direct access
      fetchProducts();
    }
  }, [isLoading]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch ALL products from database (all statuses) using the all-products API
      // This allows seller to see all their products regardless of status
      const response = await fetch('/api/all-products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      if (data.success && data.products) {
        console.log('Loaded products from database:', data.products.length);
        setProducts(data.products);
        setError(null);
        
        // Log status distribution for debugging
        const statusCount = data.products.reduce((acc: Record<string, number>, product: any) => {
          acc[product.status] = (acc[product.status] || 0) + 1;
          return acc;
        }, {});
        console.log('Product status distribution:', statusCount);
      } else {
        console.error('API returned error:', data.error);
        setProducts([]);
        setError(data.error || 'Gagal memuat produk');
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Gagal memuat produk');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && getCategoryName(product.category).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      setDeletingId(productId);
      console.log('Attempting to delete product:', productId);
      
      // Try with different URL format
      const deleteUrl = `/api/pending-products?id=${encodeURIComponent(productId)}`;
      console.log('Delete URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);
      
      // Get response text first
      const responseText = await response.text();
      console.log('Delete response text:', responseText);
      
      if (!response.ok) {
        console.error('Delete error response:', responseText);
        throw new Error(`Failed to delete product: ${response.status} - ${responseText}`);
      }

      // Parse JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Delete response data:', responseData);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to delete product');
      }

      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      console.log('Product removed from local state');
      
      // Show success message
      alert('Produk berhasil dihapus');
      
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk: ' + (error as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
      case 'APPROVED':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
      case 'REJECTED':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
      case 'PENDING':
        return 'Menunggu Persetujuan';
      case 'approved':
      case 'APPROVED':
        return 'Disetujui';
      case 'rejected':
      case 'REJECTED':
        return 'Ditolak';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryName = (categoryId: string) => {
    // Since we're now saving category names directly, return as-is
    // But keep mapping for backward compatibility with old data
    const categoryMap: Record<string, string> = {
      '1': 'Fashion',
      '2': 'Shoes',
      '3': 'Accessories', 
      '4': 'Bags',
      '5': 'Jewelry',
      '6': 'Electronics'
    };
    
    // If it's an ID, map it. If it's already a name, return it with proper casing
    if (categoryMap[categoryId]) {
      return categoryMap[categoryId];
    }
    
    // Return proper casing for category names
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Tanggal tidak valid';
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Produk Saya</h1>
            </div>
            <Link
              href="/seller/addproduct"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Persetujuan</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Persetujuan</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.status === 'rejected').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </motion.div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800">{error}</p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
          >
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Mulai dengan menambahkan produk pertama Anda'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Link
                href="/seller/addproduct"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Produk Pertama
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + (index * 0.05) }}
                      whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={
                                product.images 
                                  ? (() => {
                                      const parsedImages = parseImages(product.images);
                                      return parsedImages.length > 0 
                                        ? parsedImages[0] 
                                        : '/api/placeholder/40/40/product';
                                    })()
                                  : '/api/placeholder/40/40/product'
                              }
                              alt={product.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.reviews} ulasan • ⭐ {product.rating}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{getCategoryName(product.category || '')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1">{getStatusText(product.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Link
                              href={`/product/${product.slug || generateSlug(product.title)}`}
                              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                              title="Lihat"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Link
                              href={`/seller/products/${product.id}/edit`}
                              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deletingId === product.id}
                              className="text-gray-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                              title="Hapus"
                            >
                              {deletingId === product.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
