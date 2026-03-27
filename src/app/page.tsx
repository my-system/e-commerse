import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ProductCategories from '@/components/sections/ProductCategories';
import PersonalizedRecommendations from '@/components/sections/PersonalizedRecommendations';
import AdvancedRecommendations from '@/components/sections/AdvancedRecommendations';
import FlashSales from '@/components/sections/FlashSales';
import BundleDeals from '@/components/sections/BundleDeals';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import PromoBanner from '@/components/sections/PromoBanner';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/layout/Footer';
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
      image: '/api/placeholder/400/300/leather-jacket',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      category: 'fashion'
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling headphones',
      price: 199,
      originalPrice: 299,
      image: '/api/placeholder/400/300/headphones',
      rating: 4.8,
      reviews: 256,
      isNew: false,
      category: 'electronics'
    },
    {
      id: '3',
      name: 'Designer Watch',
      description: 'Luxury Swiss-made timepiece',
      price: 899,
      originalPrice: 1299,
      image: '/api/placeholder/400/300/luxury-watch',
      rating: 4.9,
      reviews: 45,
      isNew: true,
      category: 'accessories'
    }
  ];

  const categoriesWithCount = categories.map((cat: any) => ({
    name: cat.name,
    image: cat.image,
    count: Math.floor(Math.random() * 200) + 50 // Random count for demo
  }));

  return (
    <div className="min-h-screen">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <Navbar />
        <HeroSection />
        <ProductCategories />
        <PersonalizedRecommendations />
        <AdvancedRecommendations />
        <FlashSales />
        <BundleDeals />
        <FeaturedProducts />
        <PromoBanner />
        <Testimonials />
        <Footer />
      </div>

      {/* Mobile Version - Simplified */}
      <div className="md:hidden">
        <Navbar />
        <HeroSection />
        <ProductCategories />
        <FlashSales />
        <BundleDeals />
        <FeaturedProducts />
        <PromoBanner />
        <Testimonials />
        <Footer />
      </div>

      {/* PWA Components */}
      <PushNotificationManager />
      <PWAInstallPrompt />
      <NetworkStatus />
      <ServiceWorkerDebugDraggable />
    </div>
  );
}
