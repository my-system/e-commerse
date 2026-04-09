"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Eye, 
  AlertCircle,
  Package,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  rejectedReason?: string;
}

export default function PendingProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/pending-products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.error || 'Failed to fetch pending products');
      }
    } catch (err) {
      console.error('Error fetching pending products:', err);
      setError('Failed to fetch pending products');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    if (!confirm('Are you sure you want to approve this product?')) {
      return;
    }

    try {
      setActionLoading(productId);
      
      const response = await fetch('/api/admin/approve-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          approvedBy: 'admin-user'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        setSelectedProduct(null);
        alert('Product approved successfully!');
      } else {
        alert('Failed to approve product: ' + result.error);
      }
    } catch (err) {
      console.error('Error approving product:', err);
      alert('Failed to approve product');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (productId: string, reason: string) => {
    if (!confirm('Are you sure you want to reject this product?')) {
      return;
    }

    try {
      setActionLoading(productId);
      
      const response = await fetch('/api/admin/reject-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          reason,
          rejectedBy: 'admin-user'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, status: 'rejected' as const, rejectedReason: reason }
            : p
        ));
        setSelectedProduct(null);
        alert('Product rejected successfully!');
      } else {
        alert('Failed to reject product: ' + result.error);
      }
    } catch (err) {
      console.error('Error rejecting product:', err);
      alert('Failed to reject product');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchPendingProducts}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Link>
              <div className="ml-8">
                <h1 className="text-xl font-semibold text-gray-900">Pending Products</h1>
                <p className="text-sm text-gray-500">Review and manage product submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Products</h3>
            <p className="text-gray-600">All products have been reviewed. Check back later for new submissions.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Product Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {product.sellerId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(product.status)}`}>
                        {getStatusIcon(product.status)}
                        {product.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Product Images</h4>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const images = JSON.parse(product.images || '[]');
                            return images.slice(0, 3).map((img: string, index: number) => (
                              <img
                                key={index}
                                src={img}
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                              />
                            ));
                          } catch {
                            return (
                              <div className="w-20 h-20 bg-gray-200 rounded border border-gray-200 flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Product Information</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Category:</dt>
                            <dd className="font-medium text-gray-900">{product.category}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Stock:</dt>
                            <dd className="font-medium">
                              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Featured:</dt>
                            <dd className="font-medium">
                              {product.featured ? 'Yes' : 'No'}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Rating:</dt>
                            <dd className="font-medium">{product.rating} ({product.reviews} reviews)</dd>
                          </div>
                        </dl>
                      </div>

                      {product.description && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                        </div>
                      )}

                      {product.rejectedReason && (
                        <div>
                          <h4 className="text-sm font-medium text-red-900 mb-2">Rejection Reason</h4>
                          <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{product.rejectedReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {product.status === 'pending' && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprove(product.id)}
                        disabled={actionLoading === product.id}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {actionLoading === product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {actionLoading === product.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please enter rejection reason:');
                          if (reason && reason.trim()) {
                            handleReject(product.id, reason.trim());
                          }
                        }}
                        disabled={actionLoading === product.id}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {actionLoading === product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        {actionLoading === product.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Images */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        try {
                          const images = JSON.parse(selectedProduct.images || '[]');
                          return images.map((img: string, index: number) => (
                            <img
                              key={index}
                              src={img}
                              alt={selectedProduct.title}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200"
                            />
                          ));
                        } catch {
                          return (
                            <div className="w-full h-48 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                              <Package className="w-12 h-12 text-gray-400" />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Title:</dt>
                          <dd className="text-gray-900">{selectedProduct.title}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Price:</dt>
                          <dd className="text-2xl font-bold text-gray-900">Rp {selectedProduct.price.toLocaleString('id-ID')}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Category:</dt>
                          <dd className="text-gray-900">{selectedProduct.category}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Seller ID:</dt>
                          <dd className="text-gray-900">{selectedProduct.sellerId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Created:</dt>
                          <dd className="text-gray-900">{new Date(selectedProduct.createdAt).toLocaleString()}</dd>
                        </div>
                      </dl>
                    </div>

                    {selectedProduct.description && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                        <p className="text-gray-600">{selectedProduct.description}</p>
                      </div>
                    )}

                    {selectedProduct.material && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Material</h3>
                        <p className="text-gray-600">{selectedProduct.material}</p>
                      </div>
                    )}

                    {selectedProduct.care && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Care Instructions</h3>
                        <p className="text-gray-600">{selectedProduct.care}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {selectedProduct.status === 'pending' && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleApprove(selectedProduct.id)}
                            disabled={actionLoading === selectedProduct.id}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                          >
                            {actionLoading === selectedProduct.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <Check className="w-5 h-5" />
                            )}
                            {actionLoading === selectedProduct.id ? 'Approving...' : 'Approve Product'}
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Please enter rejection reason:');
                              if (reason && reason.trim()) {
                                handleReject(selectedProduct.id, reason.trim());
                              }
                            }}
                            disabled={actionLoading === selectedProduct.id}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                          >
                            {actionLoading === selectedProduct.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                            {actionLoading === selectedProduct.id ? 'Rejecting...' : 'Reject Product'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
