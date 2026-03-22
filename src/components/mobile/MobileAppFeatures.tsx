"use client";

import { useState, useEffect } from 'react';
import { 
  Smartphone, Bell, Download, Star, Heart, Share2, 
  Camera, MapPin, Clock, Zap, Shield, Wifi, 
  ChevronRight, Check, X, Menu, Home, Search, 
  ShoppingCart, User, ArrowLeft, Plus, Minus
} from 'lucide-react';

interface MobileFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  benefits: string[];
  available: boolean;
}

interface MobileAppFeaturesProps {
  className?: string;
}

export default function MobileAppFeatures({ className = "" }: MobileAppFeaturesProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const mobileFeatures: MobileFeature[] = [
    {
      id: 'push-notifications',
      title: 'Push Notifications',
      description: 'Dapatkan notifikasi real-time untuk flash sales, promo, dan order updates',
      icon: Bell,
      color: 'bg-blue-500',
      benefits: [
        'Flash sale alerts',
        'Order status updates',
        'Personalized offers',
        'Back in stock notifications'
      ],
      available: true,
    },
    {
      id: 'offline-mode',
      title: 'Offline Mode',
      description: 'Browse products dan lihat cart tanpa internet connection',
      icon: Wifi,
      color: 'bg-green-500',
      benefits: [
        'Browse catalog offline',
        'View saved items',
        'Access cart anytime',
        'Faster loading'
      ],
      available: true,
    },
    {
      id: 'camera-search',
      title: 'Camera Search',
      description: 'Scan barcode atau foto produk untuk mencari langsung',
      icon: Camera,
      color: 'bg-purple-500',
      benefits: [
        'Barcode scanning',
        'Visual search',
        'Quick product lookup',
        'Price comparison'
      ],
      available: true,
    },
    {
      id: 'location-services',
      title: 'Location Services',
      description: 'Find nearest stores dan tracking pengiriman real-time',
      icon: MapPin,
      color: 'bg-orange-500',
      benefits: [
        'Store locator',
        'Delivery tracking',
        'Local inventory',
        'Pickup points'
      ],
      available: true,
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      description: 'Akses cepat ke favorite actions dengan swipe gestures',
      icon: Zap,
      color: 'bg-yellow-500',
      benefits: [
        'Swipe to add to cart',
        'Quick checkout',
        'One-tap reorder',
        'Gesture navigation'
      ],
      available: true,
    },
    {
      id: 'secure-payments',
      title: 'Secure Payments',
      description: 'Biometric authentication dan secure payment methods',
      icon: Shield,
      color: 'bg-red-500',
      benefits: [
        'Face ID/Touch ID',
        'Secure checkout',
        'Saved cards',
        'Fraud protection'
      ],
      available: true,
    },
  ];

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Check if app is installed (PWA)
    setAppInstalled(window.matchMedia('(display-mode: standalone)').matches);
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleInstallApp = async () => {
    // PWA Install prompt
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (!registration) return;

        // Show install prompt (in real app, this would use the beforeinstallprompt event)
        setShowInstallPrompt(true);
      } catch (error) {
        console.error('PWA install error:', error);
      }
    }
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
        
        if (permission === 'granted') {
          // Subscribe to push notifications (in real app)
          console.log('Notifications enabled');
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    }
  };

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

  const getMobileOS = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    return 'web';
  };

  const mobileOS = getMobileOS();

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smartphone className="h-8 w-8 text-blue-400" />
            <h2 className="text-4xl font-bold">Mobile App Experience</h2>
            <Smartphone className="h-8 w-8 text-blue-400" />
          </div>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Nikmati shopping experience yang lebih baik dengan mobile app features
          </p>

          {/* Mobile Detection */}
          {isMobile && (
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full mb-6">
              <Check className="h-4 w-4" />
              <span className="font-medium">Mobile device detected</span>
            </div>
          )}

          {/* App Install Banner */}
          {!appInstalled && isMobile && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Install Our App</h3>
                    <p className="text-sm text-gray-400">Get the best mobile experience</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallApp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Install
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mobileFeatures.map((feature) => {
            const IconComponent = feature.icon;
            const isSelected = selectedFeature === feature.id;
            
            return (
              <div
                key={feature.id}
                className={`bg-gray-800 rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500 transform scale-105'
                    : 'border-gray-700 hover:border-gray-600 hover:transform hover:scale-102'
                }`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>

                {/* Expandable Benefits */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-medium mb-3 text-blue-400">Benefits:</h4>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    
                    {feature.available ? (
                      <div className="mt-4 p-3 bg-green-900 bg-opacity-30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <Check className="h-4 w-4" />
                          <span>Available on {mobileOS === 'android' ? 'Android' : mobileOS === 'ios' ? 'iOS' : 'Web'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>Coming soon</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile App Preview */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Mobile App Preview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Mockup */}
            <div className="flex justify-center">
              <div className="w-64 h-[500px] bg-black rounded-[3rem] p-4 shadow-2xl">
                <div className="w-full h-full bg-gray-900 rounded-[2rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="bg-black px-4 py-1 flex items-center justify-between text-xs text-white">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* App Header */}
                  <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
                    <Menu className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">ShopEase</span>
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4 space-y-3">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="w-full h-24 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="w-full h-24 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2">
                    <div className="flex items-center justify-around">
                      <Home className="h-5 w-5 text-blue-500" />
                      <Search className="h-5 w-5 text-gray-400" />
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Key Features</h4>
              {[
                { icon: Bell, title: 'Push Notifications', desc: 'Real-time alerts' },
                { icon: Camera, title: 'Camera Search', desc: 'Visual product search' },
                { icon: MapPin, title: 'Store Locator', desc: 'Find nearby stores' },
                { icon: Shield, title: 'Secure Payments', desc: 'Biometric auth' },
                { icon: Wifi, title: 'Offline Mode', desc: 'Browse without internet' },
                { icon: Zap, title: 'Quick Actions', desc: 'Gesture controls' },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="font-medium">{item.title}</h5>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download Options */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Download App</h4>
              
              <div className="space-y-3">
                <button className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
                  <Download className="h-5 w-5" />
                  <span>Download for iOS</span>
                </button>
                
                <button className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
                  <Download className="h-5 w-5" />
                  <span>Download for Android</span>
                </button>
                
                <button className="w-full bg-blue-600 rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                  <Smartphone className="h-5 w-5" />
                  <span>Install Web App</span>
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                <p>Available on:</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span>App Store</span>
                  <span>•</span>
                  <span>Google Play</span>
                  <span>•</span>
                  <span>Web App</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Permission Banner */}
        {!notificationsEnabled && isMobile && (
          <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Enable Notifications</h3>
                  <p className="text-gray-300 text-sm">
                    Get notified about flash sales, order updates, and personalized offers
                  </p>
                </div>
              </div>
              <button
                onClick={handleEnableNotifications}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {[
            { number: '4.8', label: 'App Rating', icon: Star },
            { number: '100K+', label: 'Downloads', icon: Download },
            { number: '50K+', label: 'Active Users', icon: User },
            { number: '99.9%', label: 'Uptime', icon: Shield },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
