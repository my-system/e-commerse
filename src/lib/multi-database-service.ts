// Multi-database service for product approval workflow
import { Pool } from 'pg';
import { products } from '@/data/products'; // Fallback to dummy data

// Database connections
const pendingPool = new Pool({
  connectionString: process.env.PENDING_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
});

const marketplacePool = new Pool({
  connectionString: process.env.MARKETPLACE_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
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
  status: 'pending' | 'approved' | 'rejected';
  badges: string | string[]; // Support both string and array
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

// PENDING DATABASE OPERATIONS
export class PendingDatabaseService {
  // Add new product to pending database
  static async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const client = await pendingPool.connect();
    try {
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
      
      return this.mapRowToProduct(result.rows[0]);
    } finally {
      client.release();
    }
  }
  
  // Get all pending products for admin review
  static async getPendingProducts(): Promise<Product[]> {
    const client = await pendingPool.connect();
    try {
      const result = await client.query('SELECT * FROM products ORDER BY created_at DESC');
      return result.rows.map(row => this.mapRowToProduct(row));
    } finally {
      client.release();
    }
  }
  
  // Get products by seller
  static async getSellerProducts(sellerId: string): Promise<Product[]> {
    const client = await pendingPool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC',
        [sellerId]
      );
      return result.rows.map(row => this.mapRowToProduct(row));
    } finally {
      client.release();
    }
  }
  
  // Update product status
  static async updateProductStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Product | null> {
    const client = await pendingPool.connect();
    try {
      const result = await client.query(`
        UPDATE products 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [status, id]);
      
      return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }
  
  // Delete product after approval
  static async deleteProduct(id: string): Promise<boolean> {
    const client = await pendingPool.connect();
    try {
      const result = await client.query('DELETE FROM products WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    } finally {
      client.release();
    }
  }
  
  private static mapRowToProduct(row: any): Product {
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
      status: row.status,
      badges: row.badges || '[]',
      sellerId: row.seller_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// MARKETPLACE DATABASE OPERATIONS
export class MarketplaceDatabaseService {
  // Add approved product to marketplace
  static async addApprovedProduct(product: Product): Promise<Product> {
    const client = await marketplacePool.connect();
    try {
      const now = new Date().toISOString();
      
      const result = await client.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          approved_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `, [
        product.id, product.title, product.price, product.category, product.description,
        product.featured, product.inStock, product.rating, product.reviews,
        product.images, product.material, product.care, 'approved',
        product.badges, product.sellerId, now, product.createdAt, now
      ]);
      
      return this.mapRowToProduct(result.rows[0]);
    } finally {
      client.release();
    }
  }
  
  // Get all approved products for marketplace
  static async getMarketplaceProducts(): Promise<Product[]> {
    try {
      const client = await marketplacePool.connect();
      try {
        const result = await client.query('SELECT * FROM products ORDER BY approved_at DESC');
        return result.rows.map(row => this.mapRowToProduct(row));
      } finally {
        client.release();
      }
    } catch (error) {
      console.warn('Database connection failed, using fallback data:', error);
      // Fallback to dummy data if database fails
      return products.filter(p => p.featured !== undefined).map(p => ({
        ...p,
        featured: p.featured || false,
        inStock: p.inStock !== undefined ? p.inStock : true,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        images: Array.isArray(p.images) ? p.images.join(',') : p.images || '',
        status: 'approved' as const,
        badges: Array.isArray(p.badges) ? p.badges.join(',') : 'Approved',
        sellerId: 'demo-seller',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
  }
  
  private static mapRowToProduct(row: any): Product {
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
      status: row.status,
      badges: row.badges || '[]',
      sellerId: row.seller_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// APPROVAL WORKFLOW SERVICE
export class ApprovalWorkflowService {
  // Approve product and move to marketplace
  static async approveProduct(productId: string): Promise<boolean> {
    try {
      // 1. Get product from pending database
      const pendingProducts = await PendingDatabaseService.getPendingProducts();
      const product = pendingProducts.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Product not found in pending database');
      }
      
      // 2. Add to marketplace database
      await MarketplaceDatabaseService.addApprovedProduct(product);
      
      // 3. Update status in pending database
      await PendingDatabaseService.updateProductStatus(productId, 'approved');
      
      // 4. Optionally remove from pending database
      // await PendingDatabaseService.deleteProduct(productId);
      
      console.log(`✅ Product ${productId} approved and moved to marketplace`);
      return true;
      
    } catch (error) {
      console.error('Error approving product:', error);
      return false;
    }
  }
  
  // Reject product
  static async rejectProduct(productId: string): Promise<boolean> {
    try {
      await PendingDatabaseService.updateProductStatus(productId, 'rejected');
      console.log(`❌ Product ${productId} rejected`);
      return true;
    } catch (error) {
      console.error('Error rejecting product:', error);
      return false;
    }
  }
}

export default { PendingDatabaseService, MarketplaceDatabaseService, ApprovalWorkflowService };
