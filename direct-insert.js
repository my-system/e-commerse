// Insert products directly to database
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
});

const products = [
  {
    id: '1',
    title: 'Test Product 1',
    price: 299900,
    category: 'electronics',
    description: 'Test description with bullet points:\n• Feature 1\n• Feature 2\n• Feature 3',
    featured: false,
    in_stock: true,
    rating: 0,
    reviews: 0,
    images: '["/uploads/products/1774710782218-b1x4jm5gfc8.jpeg"]',
    material: 'Premium Material',
    care: 'Machine wash cold',
    status: 'pending',
    badges: '[]',
    seller_id: 'mock-seller-id'
  },
  {
    id: '2',
    title: 'Test Product 2',
    price: 499900,
    category: 'fashion',
    description: 'Another test product with features:\n• Premium quality fabric\n• Comfortable fit\n• Stylish design',
    featured: true,
    in_stock: true,
    rating: 0,
    reviews: 0,
    images: '["/uploads/products/1774710787090-3saxy7yvsfa.jpeg"]',
    material: 'Cotton',
    care: 'Machine wash',
    status: 'approved',
    badges: '["HOT"]',
    seller_id: 'mock-seller-id'
  },
  {
    id: '1774720951361',
    title: 'baju',
    price: 200000,
    category: 'fashion',
    description: 'baju',
    featured: false,
    in_stock: true,
    rating: 0,
    reviews: 0,
    images: '["/uploads/products/1774720794400-rmm8dfqn1vb.jpeg","/uploads/products/1774710782218-b1x4jm5gfc8.jpeg","/uploads/products/1774710787090-3saxy7yvsfa.jpeg"]',
    status: 'approved',
    badges: '[]',
    seller_id: 'mock-seller-id'
  }
];

async function insertProducts() {
  try {
    console.log('=== INSERTING PRODUCTS DIRECTLY TO DATABASE ===');
    
    const client = await pool.connect();
    
    for (const product of products) {
      console.log(`Inserting: ${product.title}`);
      
      const result = await client.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          in_stock = EXCLUDED.in_stock,
          rating = EXCLUDED.rating,
          reviews = EXCLUDED.reviews,
          images = EXCLUDED.images,
          material = EXCLUDED.material,
          care = EXCLUDED.care,
          status = EXCLUDED.status,
          badges = EXCLUDED.badges,
          seller_id = EXCLUDED.seller_id,
          updated_at = NOW()
      `, [
        product.id, product.title, product.price, product.category, product.description,
        product.featured, product.in_stock, product.rating, product.reviews,
        product.images, product.material, product.care, product.status,
        product.badges, product.seller_id
      ]);
      
      console.log(`✅ Inserted: ${product.title}`);
    }
    
    client.release();
    console.log('\n=== INSERT COMPLETE ===');
    
    // Verify
    const verifyClient = await pool.connect();
    const countResult = await verifyClient.query('SELECT COUNT(*) FROM products');
    console.log(`Total products in database: ${countResult.rows[0].count}`);
    
    const listResult = await verifyClient.query('SELECT id, title, status FROM products ORDER BY created_at');
    console.log('Products in database:');
    listResult.rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.title} (${row.status})`);
    });
    
    verifyClient.release();
    
  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    await pool.end();
  }
}

insertProducts();
