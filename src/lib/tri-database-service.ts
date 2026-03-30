// Tri-database system: Pending, Marketplace, Backup
import { Pool } from 'pg';

// Database connections
const pendingPool = new Pool({
  connectionString: process.env.PENDING_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
});

const marketplacePool = new Pool({
  connectionString: process.env.MARKETPLACE_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
});

const backupPool = new Pool({
  connectionString: process.env.BACKUP_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/commercedb"
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
  badges: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

// DATABASE A: PENDING DATABASE
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

// DATABASE B: MARKETPLACE DATABASE
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
    const client = await marketplacePool.connect();
    try {
      const result = await client.query('SELECT * FROM products ORDER BY approved_at DESC');
      return result.rows.map(row => this.mapRowToProduct(row));
    } finally {
      client.release();
    }
  }
  
  // Update product (for inventory, price changes)
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const client = await marketplacePool.connect();
    try {
      const updateFields = [];
      const values = [];
      let paramIndex = 1;
      
      if (updates.price !== undefined) {
        updateFields.push(`price = $${paramIndex++}`);
        values.push(updates.price);
      }
      if (updates.inStock !== undefined) {
        updateFields.push(`in_stock = $${paramIndex++}`);
        values.push(updates.inStock);
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
      
      return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
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

// DATABASE C: BACKUP DATABASE
export class BackupDatabaseService {
  // Backup product from pending to backup database
  static async backupProduct(product: Product): Promise<Product> {
    const client = await backupPool.connect();
    try {
      const result = await client.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
        RETURNING *
      `, [
        product.id, product.title, product.price, product.category, product.description,
        product.featured, product.inStock, product.rating, product.reviews,
        product.images, product.material, product.care, product.status,
        product.badges, product.sellerId, product.createdAt, product.updatedAt
      ]);
      
      return this.mapRowToProduct(result.rows[0]);
    } finally {
      client.release();
    }
  }
  
  // Get all products from backup (for admin recovery)
  static async getAllBackupProducts(): Promise<Product[]> {
    const client = await backupPool.connect();
    try {
      const result = await client.query('SELECT * FROM products ORDER BY updated_at DESC');
      return result.rows.map(row => this.mapRowToProduct(row));
    } finally {
      client.release();
    }
  }
  
  // Restore product from backup to pending
  static async restoreProductToPending(productId: string): Promise<Product | null> {
    const client = await backupPool.connect();
    try {
      // Get product from backup
      const result = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
      if (result.rows.length === 0) return null;
      
      const product = this.mapRowToProduct(result.rows[0]);
      client.release();
      
      // Add to pending database
      return await PendingDatabaseService.addProduct({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        featured: product.featured,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
        images: product.images,
        material: product.material,
        care: product.care,
        status: 'pending', // Reset to pending
        badges: product.badges,
        sellerId: product.sellerId
      });
    } catch (error) {
      if (client) client.release();
      throw error;
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

// TRI-DATABASE WORKFLOW SERVICE
export class TriDatabaseWorkflowService {
  // Approve product workflow: Pending → Marketplace → Backup
  static async approveProduct(productId: string): Promise<boolean> {
    try {
      // 1. Get product from pending database
      const pendingProducts = await PendingDatabaseService.getPendingProducts();
      const product = pendingProducts.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Product not found in pending database');
      }
      
      // 2. Backup product to backup database
      await BackupDatabaseService.backupProduct(product);
      
      // 3. Add to marketplace database
      await MarketplaceDatabaseService.addApprovedProduct(product);
      
      // 4. Update status in pending database
      await PendingDatabaseService.updateProductStatus(productId, 'approved');
      
      // 5. Optionally remove from pending database
      // await PendingDatabaseService.deleteProduct(productId);
      
      console.log(`✅ Product ${productId} approved: Pending → Marketplace → Backup`);
      return true;
      
    } catch (error) {
      console.error('Error approving product:', error);
      return false;
    }
  }
  
  // Reject product workflow: Pending → Backup (rejected)
  static async rejectProduct(productId: string): Promise<boolean> {
    try {
      // 1. Get product from pending database
      const pendingProducts = await PendingDatabaseService.getPendingProducts();
      const product = pendingProducts.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Product not found in pending database');
      }
      
      // 2. Update status to rejected
      await PendingDatabaseService.updateProductStatus(productId, 'rejected');
      
      // 3. Backup to backup database
      await BackupDatabaseService.backupProduct(product);
      
      console.log(`❌ Product ${productId} rejected: Pending → Backup`);
      return true;
    } catch (error) {
      console.error('Error rejecting product:', error);
      return false;
    }
  }
  
  // Get system statistics
  static async getSystemStats(): Promise<{
    pending: number;
    marketplace: number;
    backup: number;
  }> {
    try {
      const pendingProducts = await PendingDatabaseService.getPendingProducts();
      const marketplaceProducts = await MarketplaceDatabaseService.getMarketplaceProducts();
      const backupProducts = await BackupDatabaseService.getAllBackupProducts();
      
      return {
        pending: pendingProducts.length,
        marketplace: marketplaceProducts.length,
        backup: backupProducts.length
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      return { pending: 0, marketplace: 0, backup: 0 };
    }
  }
}

export default { 
  PendingDatabaseService, 
  MarketplaceDatabaseService, 
  BackupDatabaseService, 
  TriDatabaseWorkflowService 
};
