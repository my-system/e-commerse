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
import { ServiceWorkerDebug } from '@/components/ServiceWorkerDebug';
import { MobileNavigation, MobileGrid } from '@/components/MobileNavigation';
import { MobileLayout, MobileSection } from '@/components/MobileLayout';
import { MobileProductGrid, MobileFeaturedProducts, MobileCategoryGrid } from '@/components/MobileProductGrid';

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
      category: 'clothing'
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
      category: 'shoes'
    },
    {
      id: '3',
      name: 'Luxury Watch',
      description: 'Elegant timepiece with precision movement',
      price: 599,
      rating: 4.8,
      reviews: 45,
      isNew: true,
      category: 'accessories'
    }
  ];

  const categories = [
    { name: 'Clothing', image: '/categories/clothing.jpg', count: 245 },
    { name: 'Shoes', image: '/categories/shoes.jpg', count: 128 },
    { name: 'Accessories', image: '/categories/accessories.jpg', count: 89 },
    { name: 'Bags', image: '/categories/bags.jpg', count: 67 },
    { name: 'Jewelry', image: '/categories/jewelry.jpg', count: 34 },
    { name: 'Watches', image: '/categories/watches.jpg', count: 56 }
  ];

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

      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileNavigation />
        
        {/* Main Content with proper spacing */}
        <div className="pb-20">
          {/* Mobile Featured Products */}
          <MobileFeaturedProducts products={sampleProducts} />
          
          {/* Mobile Categories */}
          <MobileSection title="Shop by Category">
            <MobileCategoryGrid categories={categories} />
          </MobileSection>

          {/* Mobile Products */}
          <MobileSection 
            title="Trending Products" 
            subtitle="Most popular items this week"
          >
            <MobileProductGrid products={sampleProducts} />
          </MobileSection>

          {/* Mobile Flash Sales */}
          <MobileSection title="Flash Deals" subtitle="Limited time offers">
            <MobileProductGrid products={sampleProducts.slice(0, 2)} columns={1} />
          </MobileSection>
        </div>
      </div>
      
      {/* Debug Components - Only visible in development */}
      <ServiceWorkerDebug />
      <PWAInstallPrompt />
      <NetworkStatus />
      
      {/* Push Notification Manager - Fixed Position */}
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <PushNotificationManager />
      </div>
    </div>
  );
}
