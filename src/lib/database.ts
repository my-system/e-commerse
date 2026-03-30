// Real PostgreSQL database connection
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  images: string;
  material?: string;
  care?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  sizes?: Array<{ name: string; value: string; inStock: boolean }>;
  colors?: Array<{ name: string; value: string; inStock: boolean }>;
  specifications?: Record<string, string>;
  sellerId?: string;
  badges?: string;
}

// Initialize database tables
async function initDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Create products table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT,
        featured BOOLEAN DEFAULT false,
        instock BOOLEAN DEFAULT true,
        rating DECIMAL(3,2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        images TEXT DEFAULT '[]',
        material VARCHAR(255),
        care VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        badges TEXT DEFAULT '[]',
        sellerId VARCHAR(255) DEFAULT 'mock-seller-id',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw error, just log it
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Initialize on module load
initDatabase();

export const productDb = {
  // Get all products
  async getAll(): Promise<Product[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products ORDER BY "createdAt" DESC');
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        category: row.category,
        description: row.description,
        featured: row.featured,
        inStock: row.instock,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        images: row.images,
        material: row.material,
        care: row.care,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: row.status,
        sellerId: row.sellerId,
        badges: row.badges
      }));
    } finally {
      client.release();
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product | undefined> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) return undefined;
      
      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        category: row.category,
        description: row.description,
        featured: row.featured,
        inStock: row.instock,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        images: row.images,
        material: row.material,
        care: row.care,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: row.status,
        sellerId: row.sellerId,
        badges: row.badges
      };
    } finally {
      client.release();
    }
  },

  // Create new product
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO products (title, price, category, description, featured, instock, rating, reviews, images, material, care, status, badges, sellerId)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        productData.title,
        productData.price,
        productData.category,
        productData.description,
        productData.featured,
        productData.inStock,
        productData.rating,
        productData.reviews,
        productData.images,
        productData.material,
        productData.care,
        productData.status,
        productData.badges || '[]',
        productData.sellerId || 'mock-seller-id'
      ]);

      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        category: row.category,
        description: row.description,
        featured: row.featured,
        inStock: row.instock,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        images: row.images,
        material: row.material,
        care: row.care,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: row.status,
        sellerId: row.sellerId,
        badges: row.badges
      };
    } finally {
      client.release();
    }
  },

  // Update product
  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && value !== undefined) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      if (fields.length === 0) return null;

      fields.push(`"updatedAt" = NOW()`);
      values.push(id);

      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      const result = await client.query(query, values);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        category: row.category,
        description: row.description,
        featured: row.featured,
        inStock: row.instock,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        images: row.images,
        material: row.material,
        care: row.care,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: row.status,
        sellerId: row.sellerId,
        badges: row.badges
      };
    } finally {
      client.release();
    }
  },

  // Delete product
  async delete(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM products WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    } finally {
      client.release();
    }
  },

  // Get products by category
  async getByCategory(category: string): Promise<Product[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE category = $1 ORDER BY "createdAt" DESC', [category]);
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        category: row.category,
        description: row.description,
        featured: row.featured,
        inStock: row.instock,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        images: row.images,
        material: row.material,
        care: row.care,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: row.status,
        sellerId: row.sellerId,
        badges: row.badges
      }));
    } finally {
      client.release();
    }
  },

  // Search products
  async search(query: string): Promise<Product[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM products 
        WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1 
        ORDER BY "createdAt" DESC
      `, [`%${query}%`]);
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        price: parseFloat(row.price),
        category: row.category,
        description: row.description,
        featured: row.featured,
        inStock: row.instock,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        images: row.images,
        material: row.material,
        care: row.care,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: row.status,
        sellerId: row.sellerId,
        badges: row.badges
      }));
    } finally {
      client.release();
    }
  }
};
