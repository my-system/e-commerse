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

// Mock product data - in real app, this would come from API
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 1299000,
    originalPrice: 1599000,
    description: "High-quality wireless headphones with active noise cancellation and premium sound quality.",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032de6687aa?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1487215048574-e8cc5961016e?w=600&h=800&fit=crop"
    ],
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium sound quality",
      "Comfortable fit",
      "Bluetooth 5.0"
    ],
    specifications: {
      "Brand": "Premium Audio",
      "Model": "WH-1000XM4",
      "Weight": "254g",
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.0, 3.5mm jack"
    }
  },
  {
    id: 2,
    name: "Classic Leather Jacket",
    price: 899000,
    originalPrice: 1299000,
    description: "Genuine leather jacket with modern design and premium craftsmanship.",
    category: "Fashion",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1551488831-008cb79ce9cb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-e426be2e471f?w=600&h=800&fit=crop"
    ],
    features: [
      "100% genuine leather",
      "Modern slim fit",
      "Premium craftsmanship",
      "Multiple colors available",
      "1 year warranty"
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Fit": "Slim Fit",
      "Care": "Professional dry clean only",
      "Origin": "Imported"
    }
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 2499000,
    originalPrice: 2999000,
    description: "Advanced smartwatch with health monitoring and premium features.",
    category: "Electronics",
    rating: 4.6,
    reviews: 234,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1574316723925-0b1d1b8b7b2b?w=600&h=800&fit=crop"
    ],
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Water resistant",
      "7-day battery life",
      "Sleep tracking"
    ],
    specifications: {
      "Display": "1.4\" AMOLED",
      "Battery": "7 days typical use",
      "Water Resistance": "5ATM",
      "Compatibility": "iOS & Android"
    }
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { user, isLoggedIn } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const productId = parseInt(params.id as string);
    console.log('Product ID from params:', productId);
    console.log('Available products:', mockProducts);
    
    const foundProduct = mockProducts.find(p => p.id === productId);
    console.log('Found product:', foundProduct);
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Product not found, redirect to marketplace
      console.log('Product not found, redirecting to marketplace');
      router.push('/marketplace');
    }
  }, [params.id, router]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/account/login');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      await addToCart({
        id: product.id,
        productId: product.id.toString(),
        title: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
      
      // Show success message or redirect to cart
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (error) {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      router.push('/account/login');
      return;
    }

    if (isInWishlist(product.id.toString())) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({
        id: product.id.toString(),
        productId: product.id.toString(),
        title: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
  };

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
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-blue-600 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
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

            {/* Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Black', 'White', 'Navy', 'Gray'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-4 border rounded-lg font-medium transition-all ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

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
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                <span>{isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over Rp 500K</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Buyer Protection</p>
                    <p className="text-sm text-gray-600">Secure transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12 bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
