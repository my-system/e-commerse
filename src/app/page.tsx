import AppLayout from '@/components/layout/AppLayout';
import HeroSection from '@/components/sections/HeroSection';
import ProductCategories from '@/components/sections/ProductCategories';
import PersonalizedRecommendations from '@/components/sections/PersonalizedRecommendations';
import AdvancedRecommendations from '@/components/sections/AdvancedRecommendations';
import FlashSales from '@/components/sections/FlashSales';
import BundleDeals from '@/components/sections/BundleDeals';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import PromoBanner from '@/components/sections/PromoBanner';
import Testimonials from '@/components/sections/Testimonials';
import { PushNotificationManager } from '@/components/PushNotificationManager';
import { PWAInstallPrompt, NetworkStatus } from '@/components/PWAComponents';
import { ServiceWorkerDebugDraggable } from '@/components/ServiceWorkerDebugDraggable';
import { categories } from '@/data/categories';

export default function Home() {
  // Sample data for mobile components
  const sampleProducts = [
    {
      id: '1',
      name: 'Premium Leather Jacket',
      description: 'High-quality leather jacket with modern design',
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.5,
      reviews: 128,
      isNew: true,
      category: 'clothing',
      image: '/images/placeholder-1.jpg'
    },
    {
      id: '2',
      name: 'Designer Sneakers',
      description: 'Comfortable and stylish sneakers for everyday wear',
      price: 159,
      originalPrice: 199,
      discount: 20,
      rating: 4.3,
      reviews: 89,
      category: 'shoes',
      image: '/images/placeholder-2.jpg'
    },
    {
      id: '3',
      name: 'Luxury Watch',
      description: 'Elegant timepiece with precision movement',
      price: 599,
      rating: 4.8,
      reviews: 45,
      isNew: true,
      category: 'accessories',
      image: '/images/placeholder-3.jpg'
    }
  ];

  const categories = [
    { name: 'Clothing', image: '/images/placeholder-1.jpg', count: 245 },
    { name: 'Shoes', image: '/images/placeholder-2.jpg', count: 128 },
    { name: 'Accessories', image: '/images/placeholder-3.jpg', count: 89 },
    { name: 'Bags', image: '/images/placeholder-1.jpg', count: 67 },
    { name: 'Jewelry', image: '/images/placeholder-2.jpg', count: 34 },
    { name: 'Watches', image: '/images/placeholder-3.jpg', count: 56 }
  ];

  const categoriesWithCount = categories.map((cat: any) => ({
    name: cat.name,
    image: cat.image,
    count: Math.floor(Math.random() * 200) + 50 // Random count for demo
  }));

  return (
    <AppLayout showSidebar={true} showFooter={true}>
      <div className="space-y-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Product Categories */}
        <ProductCategories />

        {/* Personalized Recommendations */}
        <PersonalizedRecommendations />

        {/* Advanced Recommendations */}
        <AdvancedRecommendations />

        {/* Flash Sales */}
        <FlashSales />

        {/* Bundle Deals */}
        <BundleDeals />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Promo Banner */}
        <PromoBanner />

        {/* Testimonials */}
        <Testimonials />

        {/* PWA Components */}
        <PushNotificationManager />
        <PWAInstallPrompt />
        <NetworkStatus />
        <ServiceWorkerDebugDraggable />
      </div>
    </AppLayout>
  );
}
