"use client";

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Trash2, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';


interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  // Simulate fetching wishlist data
  useEffect(() => {
    setTimeout(() => {
      setWishlist([
        {
          id: '1',
          name: 'Kemeja Pria Slim Fit - Navy',
          price: 250000,
          image: 'https://images.unsplash.com/photo-1596755094418-8d5be48a5176?w=200',
          category: 'fashion',
          inStock: true
        },
        {
          id: '2',
          name: 'Sepatu Sneakers White',
          price: 350000,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
          category: 'sepatu',
          inStock: true
        },
        {
          id: '3',
          name: 'Tas Backpack Premium',
          price: 400000,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
          category: 'tas',
          inStock: false
        },
        {
          id: '4',
          name: 'Jam Tangan Digital',
          price: 200000,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
          category: 'aksesoris',
          inStock: true
        },
        {
          id: '5',
          name: 'Topi Baseball Cap',
          price: 75000,
          image: 'https://images.unsplash.com/photo-1576871337622-6d0a9b23b5a2?w=200',
          category: 'aksesoris',
          inStock: true
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWishlist(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Simulate adding to cart
    console.log('Added to cart:', item.name);
    // In real app, this would call cart context
  };

  const totalPrice = wishlist.reduce((total, item) => total + item.price, 0);
  const inStockItems = wishlist.filter(item => item.inStock);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Wishlist Saya</h1>
                  <p className="text-gray-600 mt-2">
                    Produk yang Anda simpan untuk dibeli nanti
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {wishlist.length} produk • {inStockItems.length} tersedia
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    Total: Rp {totalPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Wishlist Kosong</h3>
              <p className="text-gray-600 mb-6">
                Mulai tambahkan produk ke wishlist untuk melihatnya di sini
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingItem === item.id}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 group"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                    </button>
                    
                    {/* Stock Status */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-lg font-bold text-gray-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/products/${item.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                      </Link>
                      
                      {item.inStock ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          + Keranjang
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm"
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Habis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        
          <div className="px-4 py-6">
            {/* Mobile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Wishlist Saya</h1>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Produk yang Anda simpan untuk dibeli nanti</p>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {wishlist.length} • {inStockItems.length} tersedia
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Wishlist */}
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Wishlist Kosong</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Mulai tambahkan produk ke wishlist untuk melihatnya di sini
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex gap-4 p-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItem === item.id}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        
                        {/* Stock Status */}
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Habis
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                        </div>
                        
                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base font-bold text-gray-900">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${item.id}`}
                            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Lihat
                          </Link>
                          
                          {item.inStock ? (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs"
                            >
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              + Keranjang
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-xs"
                            >
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              Habis
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        
      </div>

      <Footer />
    </div>
  );
}
