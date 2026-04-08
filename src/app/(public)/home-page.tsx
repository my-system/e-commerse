import { PrismaClient } from '@prisma/client';
import FeaturedProductsDB from '@/components/sections/FeaturedProductsDB';

// Revalidate on every request
export const revalidate = 0;

// Create Prisma client with database configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.NODE_ENV === 'production' 
        ? process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
        : process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
});

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        inStock: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sizes: true,
        colors: true,
        specs: true
      }
    });

    // Transform data to match DBProduct interface
    return products.map(product => ({
      ...product,
      description: product.description || undefined,
      material: product.material || undefined,
      care: product.care || undefined,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Marketplace
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Terbaik
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Temukan produk berkualitas tinggi dari seller terpercaya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Mulai Belanja
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Jadi Seller
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProductsDB products={featuredProducts} />
    </main>
  );
}
