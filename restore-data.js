// Restore products to database with correct file mappings
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Products to restore with updated image paths
const products = [
  {
    id: '1',
    title: 'Test Product 1',
    price: 299900,
    category: 'electronics',
    description: 'Test description with bullet points:\n• Feature 1\n• Feature 2\n• Feature 3',
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: JSON.stringify(['/uploads/products/1774710782218-b1x4jm5gfc8.jpeg']),
    material: 'Premium Material',
    care: 'Machine wash cold',
    status: 'pending',
    badges: JSON.stringify([]),
    sellerId: 'mock-seller-id'
  },
  {
    id: '2',
    title: 'Test Product 2',
    price: 499900,
    category: 'fashion',
    description: 'Another test product with features:\n• Premium quality fabric\n• Comfortable fit\n• Stylish design',
    featured: true,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: JSON.stringify(['/uploads/products/1774710787090-3saxy7yvsfa.jpeg']),
    material: 'Cotton',
    care: 'Machine wash',
    status: 'approved',
    badges: JSON.stringify(['HOT']),
    sellerId: 'mock-seller-id'
  },
  {
    id: '1774720951361',
    title: 'baju',
    price: 200000,
    category: 'fashion',
    description: 'baju',
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: JSON.stringify([
      '/uploads/products/1774710794400-rmm8dfqn1vb.jpeg',
      '/uploads/products/1774710782218-b1x4jm5gfc8.jpeg',
      '/uploads/products/1774710787090-3saxy7yvsfa.jpeg'
    ]),
    status: 'approved',
    badges: JSON.stringify([]),
    sellerId: 'mock-seller-id'
  }
];

async function restoreProducts() {
  try {
    console.log('=== RESTORING PRODUCTS TO DATABASE ===');
    
    for (const product of products) {
      console.log(`Restoring product: ${product.title}`);
      
      // Use PowerShell to add product
      const productData = JSON.stringify(product);
      const command = `powershell -Command "Invoke-RestMethod -Uri http://localhost:3000/api/test-seller-products -Method Post -ContentType 'application/json' -Body '${productData}' | ConvertTo-Json"`;
      
      try {
        const { stdout } = await execPromise(command);
        const result = JSON.parse(stdout);
        
        if (result.success) {
          console.log(`✅ Successfully restored: ${product.title}`);
        } else {
          console.log(`❌ Failed to restore: ${product.title} - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ Error restoring ${product.title}:`, error.message);
      }
    }
    
    console.log('\n=== RESTORE COMPLETE ===');
    console.log('All products have been restored to the database');
    
  } catch (error) {
    console.error('Error restoring products:', error);
  }
}

restoreProducts();
