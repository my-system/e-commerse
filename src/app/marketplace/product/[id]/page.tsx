"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  ChevronLeft,
  Shield,
  Truck,
  RefreshCw,
  Package
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem: addToCart } = useCart();
  const { user } = useAuth();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productId = params.id as string;
        
        const response = await fetch(`/api/marketplace-products/${productId}`);
        const data = await response.json();
        
        if (data.success && data.product) {
          setProduct(data.product);
          setError(null);
        } else {
          setError('Produk tidak ditemukan');
          // Redirect to marketplace after 2 seconds
          setTimeout(() => {
            router.push('/marketplace');
          }, 2000);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    
    try {
      // Parse images from database
      let productImages = [];
      try {
        productImages = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images || [];
      } catch {
        productImages = [product.images || '/placeholder.jpg'];
      }

      await addToCart({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: Array.isArray(productImages) && productImages.length > 0 ? productImages[0] : '/placeholder.jpg',
        quantity: quantity
      });
      
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '/placeholder.jpg'
      });
    }
  };

  // Parse images from database
  let productImages: string[] = [];
  if (product?.images) {
    try {
      productImages = typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images || [];
    } catch {
      productImages = [product.images || '/placeholder.jpg'];
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Produk tidak ditemukan'}</h2>
          <Link 
            href="/marketplace" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Kembali ke Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-gray-700 transition-colors">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage] || '/placeholder.jpg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600 capitalize">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating || 0} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                Rp {(product.price || 0).toLocaleString('id-ID')}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Tidak ada deskripsi tersedia.'}
              </p>
            </div>

            {/* Material & Care */}
            {(product.material || product.care) && (
              <div className="space-y-4">
                {product.material && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Material</h3>
                    <p className="text-gray-600">{product.material}</p>
                  </div>
                )}
                {product.care && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Perawatan</h3>
                    <p className="text-gray-600">{product.care}</p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Jumlah</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Menambahkan...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
                <span>{isInWishlist(product.id) ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">100% Original</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Pengiriman Cepat</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">7 Hari Pengembalian</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
