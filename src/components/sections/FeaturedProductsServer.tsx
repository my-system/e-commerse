import { PrismaClient } from '@prisma/client';
import FeaturedProductsDB from './FeaturedProductsDB';

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

export default async function FeaturedProductsServer() {
  const featuredProducts = await getFeaturedProducts();
  
  return <FeaturedProductsDB products={featuredProducts} />;
}
