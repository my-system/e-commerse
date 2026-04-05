"use client";

import { useState } from 'react';
import { Package, Gift, Plus, Check, X, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useIntersectionObserverMultiple } from '@/hooks/useIntersectionObserver';

interface BundleDeal {
  id: string;
  title: string;
  description: string;
  type: 'buy2get1' | 'bundle' | 'combo';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  products: string[];
  minQuantity: number;
  maxQuantity?: number;
  endTime?: Date;
  badge?: string;
}

interface BundleDealsProps {
  className?: string;
}

export default function BundleDeals({ className = "" }: BundleDealsProps) {
  const [selectedBundles, setSelectedBundles] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const { addItem } = useCart();
  const { trackProductView } = useUserPreferences();
  const { setRef } = useIntersectionObserverMultiple({ threshold: 0.1 });

  // Bundle deals data
  const bundleDeals: BundleDeal[] = [
    {
      id: "bundle-1",
      title: "Beli 2 Gratis 1",
      description: "Dapatkan 1 produk gratis untuk pembelian 2 produk dalam kategori yang sama",
      type: "buy2get1",
      discountType: "percentage",
      discountValue: 33.33,
      products: products.filter(p => p.category === 'fashion').slice(0, 6).map(p => p.id),
      minQuantity: 2,
      maxQuantity: 3,
      badge: "BEST DEAL",
    },
    {
      id: "bundle-2",
      title: "Fashion Starter Pack",
      description: "Paket lengkap fashion untuk pemula dengan harga spesial",
      type: "bundle",
      discountType: "fixed",
      discountValue: 200000,
      products: products.filter(p => p.category === 'fashion').slice(2, 5).map(p => p.id),
      minQuantity: 3,
      badge: "POPULAR",
    },
    {
      id: "bundle-3",
      title: "Weekend Combo",
      description: "Combo sempurna untuk weekend kamu",
      type: "combo",
      discountType: "percentage",
      discountValue: 25,
      products: products.filter(p => p.featured).slice(3, 6).map(p => p.id),
      minQuantity: 2,
      badge: "LIMITED",
    },
  ];

  const getBundleProducts = (bundle: BundleDeal) => {
    return products.filter(product => bundle.products.includes(product.id));
  };

  const calculateBundlePrice = (bundle: BundleDeal) => {
    const bundleProducts = getBundleProducts(bundle);
    const originalPrice = bundleProducts.reduce((sum, product) => sum + product.price, 0);
    
    if (bundle.type === 'buy2get1') {
      // Buy 2 get 1 free - calculate cheapest product as free
      const sortedProducts = [...bundleProducts].sort((a, b) => a.price - b.price);
      const paidProducts = sortedProducts.slice(0, bundle.minQuantity);
      const freeProduct = sortedProducts[bundle.minQuantity];
      const totalPrice = paidProducts.reduce((sum, product) => sum + product.price, 0);
      return { originalPrice, bundlePrice: totalPrice, savings: freeProduct?.price || 0 };
    } else if (bundle.discountType === 'percentage') {
      const discount = originalPrice * (bundle.discountValue / 100);
      return { 
        originalPrice, 
        bundlePrice: originalPrice - discount, 
        savings: discount 
      };
    } else {
      return { 
        originalPrice, 
        bundlePrice: originalPrice - bundle.discountValue, 
        savings: bundle.discountValue 
      };
    }
  };

  const handleBundleSelection = (bundleId: string, productIds: string[]) => {
    const newSelection = new Set(selectedBundles);
    
    if (selectedBundles.has(bundleId)) {
      // Remove bundle selection
      newSelection.delete(bundleId);
      productIds.forEach(id => newSelection.delete(id));
    } else {
      // Add bundle selection
      newSelection.add(bundleId);
      productIds.forEach(id => newSelection.add(id));
    }
    
    setSelectedBundles(newSelection);
  };

  const handleAddBundleToCart = (bundle: BundleDeal) => {
    const bundleProducts = getBundleProducts(bundle);
    const { bundlePrice } = calculateBundlePrice(bundle);
    
    // Add all products in bundle to cart
    bundleProducts.forEach((product, index) => {
      let productPrice = product.price;
      
      if (bundle.type === 'buy2get1' && index === bundle.minQuantity) {
        // Free product
        productPrice = 0;
      } else if (bundle.type === 'buy2get1') {
        // Paid products
        productPrice = product.price;
      } else if (bundle.discountType === 'percentage') {
        productPrice = product.price * (1 - bundle.discountValue / 100);
      } else {
        productPrice = Math.max(0, product.price - (bundle.discountValue / bundleProducts.length));
      }
      
      addItem({
        id: `${bundle.id}-${product.id}`,
        productId: product.id,
        title: `${bundle.title} - ${product.title}`,
        price: productPrice,
        image: product.images[0],
        quantity: 1,
        variant: {
          size: { id: "bundle", name: "Bundle", value: "Bundle", inStock: true }
        }
      });
    });
    
    setAddedToCart(new Set([...addedToCart, bundle.id]));
    
    // Remove from selection after adding to cart
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(bundle.id);
        return newSet;
      });
    }, 2000);
  };

  const getBundleIcon = (type: string) => {
    switch (type) {
      case 'buy2get1':
        return <Gift className="h-5 w-5" />;
      case 'bundle':
        return <Package className="h-5 w-5" />;
      case 'combo':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-purple-50 to-pink-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div 
          ref={setRef('bundle-header')}
          className="text-center mb-12 scroll-animate scroll-animate-fade-up"
          data-scroll-id="bundle-header"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-8 w-8 text-purple-600" />
            <h2 className="text-4xl font-bold text-gray-900">Bundle Deals</h2>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dapatkan harga spesial dengan pembelian paket. Lebih hemat, lebih lengkap!
          </p>
        </div>

        {/* Bundle Deals Grid */}
        <div className="space-y-8">
          {bundleDeals.map((bundle, index) => {
            const bundleProducts = getBundleProducts(bundle);
            const { originalPrice, bundlePrice, savings } = calculateBundlePrice(bundle);
            const isSelected = selectedBundles.has(bundle.id);
            const isAdded = addedToCart.has(bundle.id);
            
            return (
              <div
                key={bundle.id}
                ref={setRef(`bundle-${index}`)}
                data-scroll-id={`bundle-${index}`}
                className={`scroll-animate scroll-animate-fade-up scroll-animate-scale ${
                  isSelected ? 'ring-4 ring-purple-500 shadow-2xl transform scale-105' : 'hover:shadow-xl'
                } bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                {/* Bundle Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getBundleIcon(bundle.type)}
                      <div>
                        <h3 className="text-2xl font-bold">{bundle.title}</h3>
                        <p className="text-purple-100">{bundle.description}</p>
                      </div>
                    </div>
                    
                    {bundle.badge && (
                      <div className="bg-white text-purple-600 px-3 py-1 rounded-full font-bold text-sm">
                        {bundle.badge}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bundle Products */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {bundleProducts.map((product, index) => (
                      <div key={product.id} className="relative">
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                {product.title}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2 capitalize">
                                {product.category}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                {bundle.type === 'buy2get1' && index === bundle.minQuantity ? (
                                  <>
                                    <span className="text-lg font-bold text-green-600">GRATIS!</span>
                                    <span className="text-xs text-gray-400 line-through">
                                      {formatPrice(product.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {bundle.type === 'buy2get1' && index === bundle.minQuantity && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              FREE
                            </div>
                          )}
                        </div>
                        
                        {index < bundleProducts.length - 1 && (
                          <div className="hidden md:flex items-center justify-center absolute top-1/2 -right-3 transform -translate-y-1/2">
                            <Plus className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bundle Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-500">Total harga:</span>
                          <span className="text-lg line-through text-gray-400">
                            {formatPrice(originalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Harga bundle:</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {formatPrice(bundlePrice)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          Hemat {formatPrice(savings)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {bundle.type === 'buy2get1' 
                            ? `Buy ${bundle.minQuantity} Get 1 Free`
                            : `Diskon ${bundle.discountType === 'percentage' ? bundle.discountValue + '%' : formatPrice(bundle.discountValue)}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBundleSelection(bundle.id, bundle.products)}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <X className="inline h-4 w-4 mr-2" />
                          Batal Pilih
                        </>
                      ) : (
                        <>
                          <Plus className="inline h-4 w-4 mr-2" />
                          Pilih Bundle
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleAddBundleToCart(bundle)}
                      disabled={!isSelected || isAdded}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isAdded
                          ? 'bg-green-600 text-white'
                          : isSelected
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="inline h-4 w-4 mr-2" />
                          Ditambahkan!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="inline h-4 w-4 mr-2" />
                          Tambah ke Keranjang
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div 
          ref={setRef('bundle-view-all')}
          className="text-center mt-12 scroll-animate scroll-animate-fade-up"
          data-scroll-id="bundle-view-all"
        >
          <button className="inline-block px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-300">
            Lihat Semua Bundle Deals
          </button>
        </div>
      </div>
    </section>
  );
}
