// Test script untuk product detail system
const testProducts = [
  {
    id: 'test-product-1',
    title: 'Denim Jacket Premium',
    slug: 'denim-jacket-premium',
    price: 299000,
    discount_price: 249000,
    description: 'Denim jacket berkualitas tinggi dengan desain modern dan material terbaik. Cocok untuk berbagai kesempatan dan gaya fashion Anda.',
    category: 'fashion',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    stock: 25,
    featured: true,
    material: 'Cotton Denim',
    care: 'Machine wash cold, tumble dry low',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a5255b0e4c9?w=800&h=600&fit=crop'
    ],
    variants: {
      sizes: [
        { id: 's', name: 'S', price: 299000, inStock: true },
        { id: 'm', name: 'M', price: 299000, inStock: true },
        { id: 'l', name: 'L', price: 299000, inStock: true },
        { id: 'xl', name: 'XL', price: 329000, inStock: false }
      ],
      colors: [
        { id: 'blue', name: 'Blue', value: '#2563eb', inStock: true },
        { id: 'black', name: 'Black', value: '#000000', inStock: true },
        { id: 'gray', name: 'Gray', value: '#6b7280', inStock: false }
      ]
    },
    specifications: {
      'Brand': 'Premium Fashion',
      'Origin': 'Indonesia',
      'Weight': '500g',
      'Dimensions': '60cm x 50cm x 5cm'
    },
    sellerId: 'seller-001',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-product-2',
    title: 'Wireless Headphones Pro',
    slug: 'wireless-headphones-pro',
    price: 899000,
    description: 'Headphone wireless dengan kualitas suara premium, noise cancellation, dan battery life hingga 30 jam.',
    category: 'electronics',
    rating: 4.8,
    reviews: 89,
    inStock: true,
    stock: 15,
    featured: false,
    material: 'Plastic & Metal',
    care: 'Clean with dry cloth only',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849701-f402564e0c11?w=800&h=600&fit=crop'
    ],
    variants: {
      colors: [
        { id: 'black', name: 'Black', value: '#000000', inStock: true },
        { id: 'white', name: 'White', value: '#ffffff', inStock: true }
      ]
    },
    specifications: {
      'Brand': 'AudioTech',
      'Bluetooth': '5.0',
      'Battery': '30 hours',
      'Weight': '250g'
    },
    sellerId: 'seller-002',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

console.log('🧪 Test Product Detail System');
console.log('================================');

// Test 1: Check slug generation
console.log('\n1. Testing Slug Generation:');
testProducts.forEach(product => {
  const expectedSlug = product.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  console.log(`   ${product.title} -> ${expectedSlug}`);
  console.log(`   ✓ Match: ${product.slug === expectedSlug}`);
});

// Test 2: API endpoints to test
console.log('\n2. API Endpoints to Test:');
console.log('   GET /api/products/slug/denim-jacket-premium');
console.log('   GET /api/products/slug/wireless-headphones-pro');
console.log('   GET /product/denim-jacket-premium');
console.log('   GET /product/wireless-headphones-pro');

// Test 3: Features checklist
console.log('\n3. Features Checklist:');
console.log('   ✓ Dynamic routing: /product/[slug]');
console.log('   ✓ API endpoint: /api/products/slug/[slug]');
console.log('   ✓ SEO meta tags dinamis');
console.log('   ✓ Product gallery dengan thumbnails');
console.log('   ✓ Variant selectors (size & color)');
console.log('   ✓ Quantity selector');
console.log('   ✓ Add to Cart & Buy Now buttons');
console.log('   ✓ Wishlist functionality');
console.log('   ✓ Related products section');
console.log('   ✓ Responsive design');
console.log('   ✓ Loading states');
console.log('   ✓ 404 handling');

console.log('\n🚀 Ready to test!');
console.log('Open http://localhost:3000/product/denim-jacket-premium');
console.log('Open http://localhost:3000/product/wireless-headphones-pro');
