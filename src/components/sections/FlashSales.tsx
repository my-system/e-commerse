"use client";

import { useState, useEffect, useMemo } from 'react';
import { Clock, Zap, Percent, TrendingUp, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { products } from '@/data/products';
import { useIntersectionObserverMultiple } from '@/hooks/useIntersectionObserver';

interface FlashSale {
  id: string;
  title: string;
  description: string;
  discount: number;
  endTime: Date;
  products: string[];
  maxQuantity?: number;
  soldCount?: number;
}

interface FlashSalesProps {
  className?: string;
}

export default function FlashSales({ className = "" }: FlashSalesProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(true);
  const { addItem } = useCart();
  const { trackProductView, addToWishlist, removeFromWishlist } = useUserPreferences();
  const { setRef } = useIntersectionObserverMultiple({ threshold: 0.1 });

  // Flash sale data
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);

  useEffect(() => {
    setFlashSale({
      id: "flash-1",
      title: "MEGA FLASH SALE",
      description: "Diskon hingga 70% untuk produk pilihan!",
      discount: 70,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      products: products.filter(p => p.featured).slice(0, 8).map(p => p.id),
      maxQuantity: 1000,
      soldCount: 743,
    });
  }, []);

  // Get flash sale products
  const flashSaleProducts = useMemo(() => products.filter(product => 
    flashSale?.products.includes(product.id)
  ), [flashSale]);

  // Calculate time left
  useEffect(() => {
    if (!flashSale) return;
    
    const calculateTimeLeft = () => {
      const difference = flashSale.endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsActive(true);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsActive(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSale?.endTime]);

  // Early return if flashSale is not ready
  if (!flashSale) {
    return <div className={className}></div>;
  }

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const handleProductClick = (product: any) => {
    trackProductView(product.id);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price * (1 - flashSale.discount / 100), // Apply flash sale discount
      image: product.images[0],
      quantity: 1
    });
  };

  const handleToggleWishlist = (product: any) => {
    // Toggle wishlist logic here
  };

  const getProgressPercentage = () => {
    if (!flashSale.maxQuantity || !flashSale.soldCount) return 0;
    return (flashSale.soldCount / flashSale.maxQuantity) * 100;
  };

  const isUrgent = timeLeft.hours < 6 || (timeLeft.hours === 0 && timeLeft.minutes < 30);

  // Always show the section - remove conditional hiding
  // if (!isActive) {
  //   return null; // Don't show if flash sale has ended
  // }

  return (
    <section className={`py-16 bg-gradient-to-r from-red-50 to-orange-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Flash Sale Header */}
        <div 
          ref={setRef('flash-sale-header')}
          className="text-center mb-12 scroll-animate scroll-animate-fade-up"
          data-scroll-id="flash-sale-header"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-red-600 animate-pulse" />
            <h2 className="text-4xl font-bold text-red-600">
              {flashSale.title}
            </h2>
            <Zap className="h-8 w-8 text-red-600 animate-pulse" />
          </div>
          
          <p className="text-xl text-gray-700 mb-6">
            {flashSale.description}
          </p>

          {/* Countdown Timer */}
          <div 
            ref={setRef('countdown-timer')}
            className="flex items-center justify-center gap-4 mb-6 scroll-animate scroll-animate-scale"
            data-scroll-id="countdown-timer"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-lg font-semibold text-gray-800">Berakhir dalam:</span>
            </div>
            
            <div className="flex gap-2">
              {[
                { value: timeLeft.days, label: 'Hari' },
                { value: timeLeft.hours, label: 'Jam' },
                { value: timeLeft.minutes, label: 'Menit' },
                { value: timeLeft.seconds, label: 'Detik' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-16 h-16 bg-red-600 text-white rounded-lg flex items-center justify-center text-2xl font-bold ${
                    isUrgent ? 'animate-pulse' : ''
                  }`}>
                    {formatNumber(item.value)}
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {flashSale.maxQuantity && flashSale.soldCount && (
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Terjual: {flashSale.soldCount.toLocaleString('id-ID')}</span>
                <span>Stok: {flashSale.maxQuantity.toLocaleString('id-ID')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    getProgressPercentage() > 80 ? 'bg-red-600' : 'bg-orange-500'
                  }`}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              {getProgressPercentage() > 80 && (
                <div className="flex items-center justify-center gap-2 mt-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Hampir habis!</span>
                </div>
              )}
            </div>
          )}

          {/* Urgency Message */}
          {isUrgent && (
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Waktu terbatas! Diskon {flashSale.discount}%</span>
            </div>
          )}
        </div>

        {/* Flash Sale Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashSaleProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="relative"
              ref={setRef(`flash-product-${index}`)}
              data-scroll-id={`flash-product-${index}`}
            >
              <div className="scroll-animate scroll-animate-fade-up scroll-animate-scale" style={{ transitionDelay: `${index * 0.1}s` }}>
                {/* Flash Sale Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    <span className="text-sm font-bold">-{flashSale.discount}%</span>
                  </div>
                </div>

                {/* Product Card with custom styling */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Flash Sale Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="text-sm text-gray-500 mb-2 capitalize">
                      {product.category}
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-red-600">
                        Rp {(product.price * (1 - flashSale.discount / 100)).toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div 
          ref={setRef('flash-view-all')}
          className="text-center mt-12 scroll-animate scroll-animate-fade-up"
          data-scroll-id="flash-view-all"
        >
          <button className="inline-block px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300">
            Lihat Semua Flash Sale
          </button>
        </div>
      </div>
    </section>
  );
}
