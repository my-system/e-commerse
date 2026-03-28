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
import { ProductGridModern } from '@/components/mobile/ProductGridModern'
import { CategoryGridModern } from '@/components/mobile/CategoryGridModern'
import { FeaturedProductsModern } from '@/components/mobile/FeaturedProductsModern'
import { MobileContainerModern, MobileSectionModern } from '@/components/mobile/MobileLayoutModern'

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

      {/* Mobile Version - Modern Design */}
      <div className="md:hidden">
        <MobileNavigation>
          <MobileContainerModern>
            {/* Mobile Hero Section */}
            <MobileSectionModern 
              title="Welcome to DEMO WEB"
              subtitle="Discover amazing products"
            >
              <HeroSection />
            </MobileSectionModern>

            {/* Mobile Featured Products */}
            <MobileSectionModern 
              title="⭐ Featured Products"
              subtitle="Handpicked for you"
              action={{ label: "See All", href: "/featured" }}
            >
              <FeaturedProductsModern products={sampleProducts} />
            </MobileSectionModern>
            
            {/* Mobile Categories */}
            <MobileSectionModern 
              title="📂 Shop by Category"
              subtitle="Browse our collections"
            >
              <CategoryGridModern categories={categories} />
            </MobileSectionModern>

            {/* Mobile Trending Products */}
            <MobileSectionModern 
              title="🔥 Trending Now"
              subtitle="Most popular items this week"
              action={{ label: "View More", href: "/trending" }}
            >
              <ProductGridModern products={sampleProducts} columns={2} />
            </MobileSectionModern>

            {/* Mobile Flash Sales */}
            <MobileSectionModern 
              title="⚡ Flash Deals"
              subtitle="Limited time offers"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-600 font-bold text-sm">⏰ Ends in:</span>
                  <span className="text-red-600 font-bold">2:45:30</span>
                </div>
                <ProductGridModern products={sampleProducts.slice(0, 2)} columns={1} />
              </div>
            </MobileSectionModern>

            {/* Mobile Bundle Deals */}
            <MobileSectionModern 
              title="🎁 Bundle Deals"
              subtitle="Save more together"
              action={{ label: "View All", href: "/bundles" }}
            >
              <BundleDeals />
            </MobileSectionModern>

            {/* Mobile Promo Banner */}
            <MobileSectionModern>
              <PromoBanner />
            </MobileSectionModern>

            {/* Mobile Testimonials */}
            <MobileSectionModern 
              title="💬 Customer Reviews"
              subtitle="What our customers say"
            >
              <Testimonials />
            </MobileSectionModern>
          </MobileContainerModern>
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
