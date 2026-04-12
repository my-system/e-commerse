// Approval Workflow Service for product management
import { Pool } from 'pg';
import { checkDatabaseHealth } from './database';
import { products } from '@/data/products'; // Fallback to dummy data

// Database connections - using centralized configuration
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
}

const pendingPool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const marketplacePool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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
  approvedAt?: string; // When product was approved
  rejectedReason?: string; // Why product was rejected
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
    try {
      const client = await pendingPool.connect();
      try {
        // Query products with PENDING status from main database
        const result = await client.query('SELECT * FROM products WHERE status = $1 ORDER BY created_at DESC', ['PENDING']);
        return result.rows.map(row => this.mapRowToProduct(row));
      } finally {
        client.release();
      }
    } catch (error) {
      // Fallback to dummy data if database fails
      return products.slice(0, 5).map(p => ({
        ...p,
        status: 'pending' as const,
        featured: false,
        inStock: true,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        images: Array.isArray(p.images) ? p.images.join(',') : (p.images?.[0] || ''),
        badges: 'Pending Review', // Simple string for fallback
        sellerId: 'demo-seller',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
  }
  
  // Get products by seller
  static async getSellerProducts(sellerId: string): Promise<Product[]> {
    try {
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
    } catch (error) {
      // Fallback to dummy data if database fails
      return products.slice(0, 3).map(p => ({
        ...p,
        status: 'pending' as const,
        featured: false,
        inStock: true,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        images: Array.isArray(p.images) ? p.images.join(',') : (p.images?.[0] || ''),
        badges: 'Pending Review',
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
  }
  
  // Update product status
  static async updateProductStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Product | null> {
    try {
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
    } catch (error) {
      return null;
    }
  }
  
  // Delete product after approval
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      const client = await pendingPool.connect();
      try {
        const result = await client.query('DELETE FROM products WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }

  // Delete pending product (alias for consistency)
  static async deletePendingProduct(id: string): Promise<boolean> {
    return this.deleteProduct(id);
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
  
  // Get all approved products for marketplace with pagination and filtering
  static async getMarketplaceProducts(
    page: number = 1,
    limit: number = 50,
    search?: string,
    category?: string,
    featured?: boolean
  ): Promise<{ products: Product[], total: number }> {
    try {
      const client = await marketplacePool.connect();
      try {
        // Build WHERE clause dynamically
        const conditions: string[] = ['status = $1'];
        const params: any[] = ['APPROVED'];
        let paramIndex = 2;

        if (search && search.trim()) {
          conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR category ILIKE $${paramIndex})`);
          params.push(`%${search.trim()}%`);
          paramIndex++;
        }

        if (category && category !== 'all') {
          conditions.push(`category = $${paramIndex}`);
          params.push(category);
          paramIndex++;
        }

        if (featured === true) {
          conditions.push(`featured = $${paramIndex}`);
          params.push(true);
          paramIndex++;
        }

        const whereClause = conditions.join(' AND ');

        // Get total count first
        const countResult = await client.query(
          `SELECT COUNT(*) FROM products WHERE ${whereClause}`,
          params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated products
        const offset = (page - 1) * limit;
        params.push(limit, offset);
        const result = await client.query(`
          SELECT id, title, price, category, description, featured, "inStock",
                 rating, "reviewCount", images, "sellerId", "createdAt", "updatedAt"
          FROM products
          WHERE ${whereClause}
          ORDER BY "createdAt" DESC
          LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `, params);

        return {
          products: result.rows.map(row => this.mapRowToProduct(row)),
          total
        };
      } finally {
        client.release();
      }
    } catch (error) {
      const fallbackProducts = products.filter(p => p.featured !== undefined).map(p => ({
        ...p,
        featured: p.featured || false,
        inStock: p.inStock !== undefined ? p.inStock : true,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        images: Array.isArray(p.images) ? p.images.join(',') : (p.images?.[0] || ''),
        status: 'approved' as const,
        badges: 'Approved',
        sellerId: 'demo-seller',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      // Apply pagination to fallback data
      const offset = (page - 1) * limit;
      const paginatedFallback = fallbackProducts.slice(offset, offset + limit);
      
      return {
        products: paginatedFallback,
        total: fallbackProducts.length
      };
    }
  }

  // Approve pending product and move to marketplace
  static async approveProduct(productId: string, approvedBy: string): Promise<boolean> {
    try {
      // First, get the pending product
      const pendingClient = await pendingPool.connect();
      let pendingProduct = null;
      
      try {
        const result = await pendingClient.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (result.rows.length > 0) {
          pendingProduct = result.rows[0];
        }
      } finally {
        pendingClient.release();
      }

      if (!pendingProduct) {
        return false;
      }

      // Add to marketplace database
      const marketplaceClient = await marketplacePool.connect();
      try {
        const now = new Date().toISOString();
        const result = await marketplaceClient.query(`
          INSERT INTO products (
            id, title, price, category, description, featured, in_stock,
            rating, reviews, images, material, care, status, badges, seller_id,
            approved_at, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING *
        `, [
          pendingProduct.id,
          pendingProduct.title,
          pendingProduct.price,
          pendingProduct.category,
          pendingProduct.description,
          pendingProduct.featured,
          pendingProduct.in_stock,
          pendingProduct.rating,
          pendingProduct.reviews,
          pendingProduct.images,
          pendingProduct.material,
          pendingProduct.care,
          'approved',
          'Approved',
          pendingProduct.seller_id,
          now, // approved_at
          pendingProduct.created_at,
          now // updated_at
        ]);

        return true;
      } finally {
        marketplaceClient.release();
      }
    } catch (error) {
      return false;
    }
  }

  // Reject pending product
  static async rejectProduct(productId: string, reason: string, rejectedBy: string): Promise<boolean> {
    try {
      const pendingClient = await pendingPool.connect();
      try {
        // Update status to rejected in pending database
        await pendingClient.query(`
          UPDATE products 
          SET status = $1, rejected_reason = $2, updated_at = $3 
          WHERE id = $4
        `, ['rejected', reason, new Date().toISOString(), productId]);

        return true;
      } finally {
        pendingClient.release();
      }
    } catch (error) {
      return false;
    }
  }

  // Get pending products for admin review
  static async getPendingProducts(): Promise<Product[]> {
    try {
      const client = await pendingPool.connect();
      try {
        const result = await client.query('SELECT * FROM products WHERE status = $1 ORDER BY "createdAt" DESC', ['pending']);
        return result.rows.map(row => this.mapRowToProduct(row));
      } finally {
        client.release();
      }
    } catch (error) {
      return [];
    }
  }
  
  // Delete product from marketplace
  static async deleteMarketplaceProduct(productId: string): Promise<boolean> {
    try {
      const client = await marketplacePool.connect();
      try {
        const result = await client.query('DELETE FROM products WHERE id = $1', [productId]);
        return (result.rowCount || 0) > 0;
      } finally {
        client.release();
      }
    } catch (error) {
      return false;
    }
  }
  
  private static mapRowToProduct(row: any): Product {
    // Parse images from JSON string to array
    let parsedImages = '[]';
    try {
      if (row.images) {
        if (typeof row.images === 'string') {
          parsedImages = row.images;
        } else if (Array.isArray(row.images)) {
          parsedImages = JSON.stringify(row.images);
        }
      }
    } catch (error) {
      console.warn('Error parsing images:', error);
      parsedImages = '[]';
    }

    return {
      id: row.id,
      title: row.title,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description || '',
      featured: row.featured || false,
      inStock: row.inStock !== undefined ? row.inStock : true,
      rating: row.rating || 0,
      reviews: row.reviewCount || row.reviews || 0,
      images: parsedImages,
      material: row.material || '',
      care: row.care || '',
      status: 'approved', // All products in main database are considered approved
      badges: 'Approved', // Default badge
      sellerId: row.sellerId || 'default-seller',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
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
      
      // 2. Add to marketplace database with approved status
      await MarketplaceDatabaseService.addApprovedProduct(product);
      
      // 3. Remove from pending database (not just update status)
      await PendingDatabaseService.deleteProduct(productId);
      
      return true;
      
    } catch (error) {
      return false;
    }
  }
  
  // Reject product
  static async rejectProduct(productId: string): Promise<boolean> {
    try {
      await PendingDatabaseService.updateProductStatus(productId, 'rejected');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default { PendingDatabaseService, MarketplaceDatabaseService, ApprovalWorkflowService };
