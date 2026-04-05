"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronLeft, AlertCircle } from 'lucide-react';

export default function SimpleProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success && data.product) {
          console.log('✅ Product loaded:', data.product);
          setProduct(data.product);
        } else {
          setError(data.error || 'Produk tidak ditemukan');
        }
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        setError('Gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">{error || 'Produk yang Anda cari tidak tersedia.'}</p>
            <Link 
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          text: 'Approved',
          className: 'bg-green-100 text-green-800'
        };
      case 'pending':
        return {
          text: 'Pending Approval',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          text: status,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const statusBadge = getStatusBadge(product.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/marketplace" className="text-gray-500 hover:text-gray-700">
              Marketplace
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Badge */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}>
            {statusBadge.text}
          </div>
          {product.source && (
            <span className="ml-2 text-xs text-gray-500">
              Source: {product.source === 'marketplace' ? 'Marketplace' : product.source === 'pending' ? 'Pending' : 'Backup'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <span className="text-sm text-green-600 font-medium">
                  Save Rp {(product.originalPrice - product.price).toLocaleString('id-ID')}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Additional Info */}
            {product.material && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Material</h3>
                <p className="text-gray-600">{product.material}</p>
              </div>
            )}

            {product.care && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Care Instructions</h3>
                <p className="text-gray-600">{product.care}</p>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                disabled={!product.inStock || product.status !== 'approved'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {product.status !== 'approved' ? (
                  <>
                    <div className="w-5 h-5">⏳</div>
                    <span>Product Pending Approval</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
