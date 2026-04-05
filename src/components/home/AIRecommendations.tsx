"use client";

import { useState, useEffect } from 'react';
import { Brain, Sparkles, Heart, ShoppingCart, Star, TrendingUp, Users, Package, Zap, Target } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  rating?: number;
  reviews?: number;
  featured?: boolean;
}

interface AIRecommendationsProps {
  className?: string;
}

export default function AIRecommendations({ className = "" }: AIRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      
      // Mock data untuk development
      const mockProducts: Product[] = [
        {
          id: "ai-1",
          title: "Premium Leather Jacket",
          price: 1299000,
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
          category: "Jackets",
          rating: 4.8,
          reviews: 234,
          featured: true
        },
        {
          id: "ai-2", 
          title: "Designer Sneakers",
          price: 899000,
          images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"],
          category: "Shoes",
          rating: 4.6,
          reviews: 189,
          featured: true
        },
        {
          id: "ai-3",
          title: "Luxury Watch",
          price: 2599000,
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
          category: "Accessories",
          rating: 4.9,
          reviews: 156,
          featured: true
        },
        {
          id: "ai-4",
          title: "Classic Denim",
          price: 599000,
          images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop"],
          category: "Pants",
          rating: 4.5,
          reviews: 298,
          featured: false
        },
        {
          id: "ai-5",
          title: "Silk Blouse",
          price: 799000,
          images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop"],
          category: "Tops",
          rating: 4.7,
          reviews: 167,
          featured: true
        },
        {
          id: "ai-6",
          title: "Canvas Backpack",
          price: 459000,
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
          category: "Bags",
          rating: 4.4,
          reviews: 89,
          featured: false
        },
        {
          id: "ai-7",
          title: "Gold Necklace",
          price: 1899000,
          images: ["https://images.unsplash.com/photo-1596944923704-3a6004b6d931?w=600&h=600&fit=crop"],
          category: "Jewelry",
          rating: 4.9,
          reviews: 201,
          featured: true
        },
        {
          id: "ai-8",
          title: "Sport Shoes",
          price: 699000,
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"],
          category: "Shoes",
          rating: 4.6,
          reviews: 312,
          featured: false
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(mockProducts);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0]
      });
    }
  };

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-900">AI Recommendations</h2>
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-full rounded-full">
              AI Choice
            </span>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Produk pilihan cerdas yang dipersonalisasi berdasarkan preferensi kamu
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="group">
                {/* Product Card */}
                <div className="relative">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg';
                      }}
                    />
                    
                    {/* HOT Badge */}
                    {product.featured && (
                      <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                        HOT
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleToggleWishlist(product)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${
                          isInWishlist(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    {/* Category */}
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category}
                    </p>
                    
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.rating || 4.5}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 opacity-0 group-hover:opacity-100"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Lihat Semua Rekomendasi
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
