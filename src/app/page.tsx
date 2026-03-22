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
import { MobileNavigation, MobileGrid } from '@/components/MobileNavigation';
import { MobileLayout, MobileSection } from '@/components/MobileLayout';
import { MobileProductGridPremium } from '@/components/MobileProductGridPremium'
import { MobileCategoryGridPremium } from '@/components/MobileCategoryGridPremium'
import { MobileFeaturedProductsPremium } from '@/components/MobileFeaturedProductsPremium';

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
      <div className="md:hidden bg-gray-50 min-h-screen">
        <MobileNavigation>
          {/* Main Content with proper spacing */}
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Featured Products */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
                  <p className="text-sm text-gray-600 mt-1">Handpicked for you</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  See All
                </button>
              </div>
              <MobileFeaturedProductsPremium products={sampleProducts} />
            </section>
            
            {/* Mobile Categories */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
                <p className="text-sm text-gray-600 mt-1">Browse our collections</p>
              </div>
              <MobileCategoryGridPremium categories={categories} />
            </section>

            {/* Mobile Products */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
                  <p className="text-sm text-gray-600 mt-1">Most popular items this week</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View More
                </button>
              </div>
              <MobileProductGridPremium products={sampleProducts} />
            </section>

            {/* Mobile Flash Sales */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-red-600">⚡ Flash Deals</h2>
                  <p className="text-sm text-gray-600 mt-1">Limited time offers</p>
                </div>
                <div className="text-sm font-medium text-red-600">
                  Ends in 2:45:30
                </div>
              </div>
              <MobileProductGridPremium products={sampleProducts.slice(0, 2)} columns={1} />
            </section>
          </div>
        </MobileNavigation>
      </div>
      
      {/* Debug Components - Only visible in development */}
      <ServiceWorkerDebugDraggable />
      <PWAInstallPrompt />
      <NetworkStatus />
      
      {/* Push Notification Manager - Fixed Position */}
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <PushNotificationManager />
      </div>
    </div>
  );
}
