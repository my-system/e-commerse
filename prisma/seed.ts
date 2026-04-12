import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
});

async function main() {
  console.log('Start seeding...');

  // Create tester account
  const testerEmail = 'akuntester@gmail.com';
  const testerPassword = '12345678';
  
  const existingTester = await prisma.user.findUnique({
    where: { email: testerEmail }
  });

  if (!existingTester) {
    const hashedPassword = await bcrypt.hash(testerPassword, 12);
    await prisma.user.create({
      data: {
        email: testerEmail,
        name: 'Tester Account',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: new Date()
      }
    });
    console.log(`Created tester account: ${testerEmail} / ${testerPassword}`);
  } else {
    console.log(`Tester account already exists: ${testerEmail}`);
  }

  // Clear existing data
  await prisma.productSpec.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();

  // Dummy products data
  const products = [
    {
      title: 'Nike Air Max 270',
      price: 129.99,
      category: 'Sepatu',
      description: 'Sepatu olahraga yang nyaman dengan teknologi Air Max untuk kenyamanan maksimal sepanjang hari.',
      featured: true,
      inStock: true,
      rating: 4.5,
      reviewCount: 234,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop'
      ]),
      material: 'Mesh, Rubber, Synthetic Leather',
      care: 'Bersihkan dengan kain lembut, hindari pencucian mesin',
      sizes: [
        { name: 'US 7', value: '40', inStock: true },
        { name: 'US 8', value: '41', inStock: true },
        { name: 'US 9', value: '42', inStock: true },
        { name: 'US 10', value: '43', inStock: false },
        { name: 'US 11', value: '44', inStock: true }
      ],
      colors: [
        { name: 'Black', value: '#000000', inStock: true },
        { name: 'White', value: '#FFFFFF', inStock: true },
        { name: 'Red', value: '#FF0000', inStock: false }
      ],
      specs: [
        { key: 'Berat', value: '300g' },
        { key: 'Material Upper', value: 'Mesh' },
        { key: 'Material Sole', value: 'Rubber' },
        { key: 'Technology', value: 'Air Max' }
      ]
    },
    {
      title: 'Adidas Backpack Pro',
      price: 89.99,
      category: 'Tas',
      description: 'Tas ransel profesional dengan kapasitas besar dan banyak kompartemen untuk organisasi yang baik.',
      featured: true,
      inStock: true,
      rating: 4.7,
      reviewCount: 189,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598626773755-6b2f7c5c0b2a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
      ]),
      material: 'Polyester 600D, Nylon',
      care: 'Cuci dengan tangan menggunakan air dingin, jangan gunakan pemutih',
      sizes: [
        { name: 'One Size', value: 'OS', inStock: true }
      ],
      colors: [
        { name: 'Black', value: '#000000', inStock: true },
        { name: 'Navy Blue', value: '#000080', inStock: true },
        { name: 'Gray', value: '#808080', inStock: true }
      ],
      specs: [
        { key: 'Kapasitas', value: '25L' },
        { key: 'Laptop Sleeve', value: '15.6 inch' },
        { key: 'Water Resistant', value: 'Yes' },
        { key: 'Weight', value: '650g' }
      ]
    },
    {
      title: 'The North Face Jacket',
      price: 199.99,
      category: 'Jaket',
      description: 'Jaket waterproof dengan teknologi DryVent untuk melindungi dari cuaca ekstrem.',
      featured: true,
      inStock: true,
      rating: 4.8,
      reviewCount: 312,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591047139829-a91d1cda5495?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dcef5824279?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544982994-5e9b645af3d1?w=800&h=600&fit=crop'
      ]),
      material: 'DryVent 2L Fabric, Polyester',
      care: 'Cuci kering atau cuci tangan dengan air dingin',
      sizes: [
        { name: 'S', value: 'S', inStock: true },
        { name: 'M', value: 'M', inStock: true },
        { name: 'L', value: 'L', inStock: false },
        { name: 'XL', value: 'XL', inStock: true },
        { name: 'XXL', value: 'XXL', inStock: true }
      ],
      colors: [
        { name: 'Black', value: '#000000', inStock: true },
        { name: 'Dark Blue', value: '#00008B', inStock: true },
        { name: 'Forest Green', value: '#228B22', inStock: false }
      ],
      specs: [
        { key: 'Waterproof', value: 'Yes' },
        { key: 'Breathable', value: 'Yes' },
        { key: 'Windproof', value: 'Yes' },
        { key: 'Weight', value: '450g' }
      ]
    },
    {
      title: 'Puma Running Shoes',
      price: 109.99,
      category: 'Sepatu',
      description: 'Sepatu lari ringan dengan cushioning yang responsif untuk performa maksimal.',
      featured: false,
      inStock: true,
      rating: 4.3,
      reviewCount: 156,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop'
      ]),
      material: 'Mesh, Rubber, EVA Foam',
      care: 'Bersihkan dengan sikat lembut dan air sabun',
      sizes: [
        { name: 'US 6', value: '39', inStock: true },
        { name: 'US 7', value: '40', inStock: true },
        { name: 'US 8', value: '41', inStock: true },
        { name: 'US 9', value: '42', inStock: true },
        { name: 'US 10', value: '43', inStock: false }
      ],
      colors: [
        { name: 'Blue', value: '#0000FF', inStock: true },
        { name: 'Orange', value: '#FFA500', inStock: true },
        { name: 'Black', value: '#000000', inStock: true }
      ],
      specs: [
        { key: 'Drop', value: '8mm' },
        { key: 'Weight', value: '280g' },
        { key: 'Cushioning', value: 'Hybrid' },
        { key: 'Outsole', value: 'Rubber' }
      ]
    },
    {
      title: 'Leather Messenger Bag',
      price: 149.99,
      category: 'Tas',
      description: 'Tas messenger premium dari kulit asli dengan desain klasik dan modern.',
      featured: false,
      inStock: true,
      rating: 4.6,
      reviewCount: 98,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598626773755-6b2f7c5c0b2a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
      ]),
      material: 'Genuine Leather, Brass Hardware',
      care: 'Gunakan leather conditioner setiap 3 bulan',
      sizes: [
        { name: 'One Size', value: 'OS', inStock: true }
      ],
      colors: [
        { name: 'Brown', value: '#8B4513', inStock: true },
        { name: 'Black', value: '#000000', inStock: true },
        { name: 'Tan', value: '#D2B48C', inStock: false }
      ],
      specs: [
        { key: 'Material', value: 'Full Grain Leather' },
        { key: 'Capacity', value: '15L' },
        { key: 'Laptop Compartment', value: '13 inch' },
        { key: 'Adjustable Strap', value: 'Yes' }
      ]
    },
    {
      title: 'Urban Hoodie Premium',
      price: 79.99,
      category: 'Jaket',
      description: 'Hoodie nyaman dengan desain urban yang stylish untuk sehari-hari.',
      featured: false,
      inStock: true,
      rating: 4.4,
      reviewCount: 267,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551698618-1dcef5824279?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544982994-5e9b645af3d1?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-a91d1cda5495?w=800&h=600&fit=crop'
      ]),
      material: 'Cotton Blend, Fleece Lining',
      care: 'Cuci mesin dengan air dingin, tumble dry low',
      sizes: [
        { name: 'S', value: 'S', inStock: true },
        { name: 'M', value: 'M', inStock: true },
        { name: 'L', value: 'L', inStock: true },
        { name: 'XL', value: 'XL', inStock: false },
        { name: 'XXL', value: 'XXL', inStock: true }
      ],
      colors: [
        { name: 'Gray', value: '#808080', inStock: true },
        { name: 'Black', value: '#000000', inStock: true },
        { name: 'Navy', value: '#000080', inStock: true },
        { name: 'Burgundy', value: '#800020', inStock: false }
      ],
      specs: [
        { key: 'Material', value: '80% Cotton, 20% Polyester' },
        { key: 'Weight', value: '380g' },
        { key: 'Pocket Type', value: 'Kangaroo Pocket' },
        { key: 'Hood Type', value: 'Adjustable Drawstring' }
      ]
    }
  ];

  // Insert products and their relations
  for (const productData of products) {
    const { sizes, colors, specs, ...product } = productData;
    
    const createdProduct = await prisma.product.create({
      data: product,
    });

    // Insert sizes
    for (const size of sizes) {
      await prisma.productSize.create({
        data: {
          ...size,
          productId: createdProduct.id,
        },
      });
    }

    // Insert colors
    for (const color of colors) {
      await prisma.productColor.create({
        data: {
          ...color,
          productId: createdProduct.id,
        },
      });
    }

    // Insert specs
    for (const spec of specs) {
      await prisma.productSpec.create({
        data: {
          ...spec,
          productId: createdProduct.id,
        },
      });
    }

    console.log(`Created product: ${createdProduct.title}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
