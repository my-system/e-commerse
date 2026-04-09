"use client";

import { useState } from 'react';
// Product interface matching database schema
interface Product {
  id: string;
  title: string;
  name?: string;
  price: number;
  images: string | string[];
  image?: string;
  category: string;
  description?: string;
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  slug?: string;
  sellerId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
import { formatPrice } from '@/lib/utils';
import { X, ShoppingCart, Heart, Star, Minus, Plus, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem, isInWishlist } = useWishlist();

  if (!product || !isOpen) return null;

  // Parse images from database (string) or use array
  const parsedImages = typeof product.images === 'string' 
    ? JSON.parse(product.images || '[]') 
    : (product.images || []);
  const currentImage = parsedImages[selectedImageIndex];

  const handleAddToCart = () => {
    const parsedImages = typeof product.images === 'string' 
      ? JSON.parse(product.images || '[]') 
      : (product.images || []);
    const currentImage = parsedImages[selectedImageIndex];
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      title: product.title,
      price: product.price,
      image: currentImage,
      quantity,
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addToWishlist({
        id: Date.now().toString(),
        productId: product.id,
        title: product.title,
        price: product.price,
        image: currentImage,
      });
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-8">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {parsedImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {parsedImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
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
            </div>

            {/* Product Details */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-600">
                    {product.category}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">4.8 (234 reviews)</span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3 rounded-lg border transition-colors ${
                      isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Features */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Free shipping on orders over $100
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      30-day return policy
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      100% authentic products
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
