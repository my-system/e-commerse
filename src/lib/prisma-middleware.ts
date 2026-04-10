import { PrismaClient } from '@prisma/client';
import { generateUniqueSlug } from './utils';

// Buat Prisma client dengan auto-slug functionality
export function createPrismaWithMiddleware(): PrismaClient {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  // Prisma middleware untuk auto-generate slug
  prisma.$use(async (params, next) => {
    console.log('Middleware triggered:', params.model, params.action);
    
    // Handle Product creation
    if (params.model === 'Product' && params.action === 'create') {
      const data = params.args.data;
      console.log('Product create data:', { title: data.title, slug: data.slug });
      
      // Generate slug jika tidak ada
      if (!data.slug && data.title) {
        console.log('Generating slug for:', data.title);
        data.slug = await generateUniqueSlug(data.title, prisma);
        console.log('Generated slug:', data.slug);
      }
    }
    
    // Handle Product update
    if (params.model === 'Product' && params.action === 'update') {
      const data = params.args.data;
      console.log('Product update data:', { title: data.title, slug: data.slug });
      
      // Generate slug baru jika title berubah tapi slug tidak disediakan
      if (data.title && !data.slug) {
        console.log('Generating new slug for updated title:', data.title);
        data.slug = await generateUniqueSlug(data.title, prisma);
        console.log('Generated new slug:', data.slug);
      }
    }
    
    return next(params);
  });

  return prisma;
}
