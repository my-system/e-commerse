import pool from '@/lib/database-connection';
import { testConnection, initializeDatabase } from '@/lib/database-connection';

// Initialize database on first import
let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }
}

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
  badges: string;
  sellerId: string;
  sizes?: Array<{ id: string; name: string; value: string; inStock: boolean }>;
  colors?: Array<{ id: string; name: string; value: string; inStock: boolean }>;
  specifications?: Record<string, string>;
}

export async function getProducts(): Promise<Product[]> {
  await ensureInitialized();
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products ORDER BY created_at DESC');
    client.release();
    
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description || '',
      featured: row.featured,
      inStock: row.in_stock,
      rating: row.rating,
      reviews: row.reviews,
      images: row.images || '[]',
      material: row.material || '',
      care: row.care || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status,
      badges: row.badges || '[]',
      sellerId: row.seller_id,
      sizes: [],
      colors: [],
      specifications: {}
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  await ensureInitialized();
  
  try {
    const client = await pool.connect();
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const result = await client.query(`
      INSERT INTO products (
        id, title, price, category, description, featured, in_stock,
        rating, reviews, images, material, care, status, badges, seller_id,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      id, product.title, product.price, product.category, product.description,
      product.featured, product.inStock, product.rating, product.reviews,
      product.images, product.material, product.care, product.status,
      product.badges, product.sellerId, now, now
    ]);
    
    client.release();
    
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description || '',
      featured: row.featured,
      inStock: row.in_stock,
      rating: row.rating,
      reviews: row.reviews,
      images: row.images || '[]',
      material: row.material || '',
      care: row.care || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status,
      badges: row.badges || '[]',
      sellerId: row.seller_id,
      sizes: [],
      colors: [],
      specifications: {}
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  await ensureInitialized();
  
  try {
    const client = await pool.connect();
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (updates.title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.price !== undefined) {
      updateFields.push(`price = $${paramIndex++}`);
      values.push(updates.price);
    }
    if (updates.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    
    updateFields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date().toISOString());
    
    if (updateFields.length === 1) {
      client.release();
      return null;
    }
    
    const result = await client.query(`
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, [...values, id]);
    
    client.release();
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description || '',
      featured: row.featured,
      inStock: row.in_stock,
      rating: row.rating,
      reviews: row.reviews,
      images: row.images || '[]',
      material: row.material || '',
      care: row.care || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status,
      badges: row.badges || '[]',
      sellerId: row.seller_id,
      sizes: [],
      colors: [],
      specifications: {}
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureInitialized();
  
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM products WHERE id = $1', [id]);
    client.release();
    
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
