// Database C (Central Backup) Validation System
// Ensures Database C serves as the Single Source of Truth for all product history
import { Pool } from 'pg';

export interface BackupValidationResult {
  isValid: boolean;
  issues: Array<{
    type: 'missing_product' | 'status_mismatch' | 'timestamp_inconsistency' | 'data_corruption';
    productId: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    autoFixed: boolean;
  }>;
  summary: {
    totalProducts: number;
    missingProducts: number;
    statusMismatches: number;
    timestampIssues: number;
    corruptionIssues: number;
    validationTime: string;
  };
}

export interface ProductHistory {
  productId: string;
  events: Array<{
    eventType: 'created' | 'approved' | 'rejected' | 'updated' | 'moved';
    timestamp: string;
    fromDatabase?: 'A' | 'B' | 'C';
    toDatabase?: 'A' | 'B' | 'C';
    status: string;
    details?: any;
  }>;
}

export class CentralBackupValidator {
  private backupPool: Pool;
  private pendingPool: Pool;
  private marketplacePool: Pool;
  private logger: any;

  constructor() {
    this.backupPool = new Pool({
      connectionString: process.env.BACKUP_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/commercedb",
      connectionTimeoutMillis: 30000
    });
    
    this.pendingPool = new Pool({
      connectionString: process.env.PENDING_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
      connectionTimeoutMillis: 30000
    });
    
    this.marketplacePool = new Pool({
      connectionString: process.env.MARKETPLACE_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace",
      connectionTimeoutMillis: 30000
    });

    this.logger = {
      logStep: (step: string, message: string, details?: string) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [BACKUP-VALIDATOR] ${step}: ${message}`);
        if (details) console.log(`    ℹ️  ${details}`);
      },
      logError: (step: string, error: Error, details?: string) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [BACKUP-VALIDATOR] ❌ ${step} ERROR: ${error.message}`);
        if (details) console.error(`    🔍 Details: ${details}`);
      },
      logSuccess: (step: string, message: string, details?: string) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [BACKUP-VALIDATOR] ✅ ${step} SUCCESS: ${message}`);
        if (details) console.log(`    🎯 ${details}`);
      }
    };
  }

  // Comprehensive validation of Database C as Single Source of Truth
  async validateCentralBackup(): Promise<BackupValidationResult> {
    const startTime = Date.now();
    
    try {
      this.logger.logStep('BACKUP-VALIDATION', 'Starting comprehensive Central Backup validation');
      
      const result: BackupValidationResult = {
        isValid: true,
        issues: [],
        summary: {
          totalProducts: 0,
          missingProducts: 0,
          statusMismatches: 0,
          timestampIssues: 0,
          corruptionIssues: 0,
          validationTime: new Date().toISOString()
        }
      };

      // Step 1: Validate backup completeness
      this.logger.logStep('STEP-1', 'Validating backup completeness');
      const completenessIssues = await this.validateBackupCompleteness();
      result.issues.push(...completenessIssues);
      result.summary.missingProducts = completenessIssues.length;

      // Step 2: Validate status consistency
      this.logger.logStep('STEP-2', 'Validating status consistency');
      const statusIssues = await this.validateStatusConsistency();
      result.issues.push(...statusIssues);
      result.summary.statusMismatches = statusIssues.length;

      // Step 3: Validate timestamp integrity
      this.logger.logStep('STEP-3', 'Validating timestamp integrity');
      const timestampIssues = await this.validateTimestampIntegrity();
      result.issues.push(...timestampIssues);
      result.summary.timestampIssues = timestampIssues.length;

      // Step 4: Validate data integrity
      this.logger.logStep('STEP-4', 'Validating data integrity');
      const corruptionIssues = await this.validateDataIntegrity();
      result.issues.push(...corruptionIssues);
      result.summary.corruptionIssues = corruptionIssues.length;

      // Step 5: Get total product count
      const backupClient = await this.backupPool.connect();
      try {
        const countResult = await backupClient.query('SELECT COUNT(*) FROM products');
        result.summary.totalProducts = parseInt(countResult.rows[0].count);
      } finally {
        backupClient.release();
      }

      // Step 6: Auto-fix issues where possible
      this.logger.logStep('STEP-5', 'Attempting auto-fix of detected issues');
      const fixedIssues = await this.autoFixBackupIssues(result.issues);
      result.issues = fixedIssues;

      // Determine overall validity
      const criticalIssues = result.issues.filter(i => i.severity === 'critical' && !i.autoFixed);
      const highSeverityIssues = result.issues.filter(i => i.severity === 'high' && !i.autoFixed);
      
      result.isValid = criticalIssues.length === 0 && highSeverityIssues.length === 0;

      const validationDuration = Date.now() - startTime;
      this.logger.logSuccess('BACKUP-VALIDATION', 'Central Backup validation completed', 
        `Duration: ${validationDuration}ms, Issues: ${result.issues.length}, Valid: ${result.isValid}`);

      return result;

    } catch (error) {
      this.logger.logError('BACKUP-VALIDATION', error as Error, 'Central Backup validation failed');
      throw error;
    }
  }

  // Validate that all products from A and B exist in C
  private async validateBackupCompleteness(): Promise<any[]> {
    const issues = [];
    
    try {
      // Get all products from all databases
      const [pendingProducts, marketplaceProducts, backupProducts] = await Promise.all([
        this.getAllProductsFromDatabase('pending'),
        this.getAllProductsFromDatabase('marketplace'),
        this.getAllProductsFromDatabase('backup')
      ]);

      // Create backup lookup map
      const backupMap = new Map(backupProducts.map(p => [p.id, p]));

      // Check all products from pending database
      for (const pendingProduct of pendingProducts) {
        if (!backupMap.has(pendingProduct.id)) {
          issues.push({
            type: 'missing_product',
            productId: pendingProduct.id,
            description: `Product ${pendingProduct.id} from Pending database missing from Central Backup`,
            severity: 'high',
            autoFixed: false
          });
        }
      }

      // Check all products from marketplace database
      for (const marketplaceProduct of marketplaceProducts) {
        if (!backupMap.has(marketplaceProduct.id)) {
          issues.push({
            type: 'missing_product',
            productId: marketplaceProduct.id,
            description: `Product ${marketplaceProduct.id} from Marketplace database missing from Central Backup`,
            severity: 'critical',
            autoFixed: false
          });
        }
      }

      this.logger.logStep('COMPLETENESS', `Found ${issues.length} missing products in backup`);
      
    } catch (error) {
      this.logger.logError('COMPLETENESS', error as Error, 'Failed to validate backup completeness');
    }

    return issues;
  }

  // Validate that status in backup matches expected status
  private async validateStatusConsistency(): Promise<any[]> {
    const issues = [];
    
    try {
      const [pendingProducts, marketplaceProducts, backupProducts] = await Promise.all([
        this.getAllProductsFromDatabase('pending'),
        this.getAllProductsFromDatabase('marketplace'),
        this.getAllProductsFromDatabase('backup')
      ]);

      const backupMap = new Map(backupProducts.map(p => [p.id, p]));

      // Check pending products - should have 'pending' status in backup
      for (const pendingProduct of pendingProducts) {
        const backupProduct = backupMap.get(pendingProduct.id);
        if (backupProduct && backupProduct.status !== 'pending') {
          issues.push({
            type: 'status_mismatch',
            productId: pendingProduct.id,
            description: `Status mismatch for ${pendingProduct.id}: Pending='pending', Backup='${backupProduct.status}'`,
            severity: 'medium',
            autoFixed: false
          });
        }
      }

      // Check marketplace products - should have 'approved' status in backup
      for (const marketplaceProduct of marketplaceProducts) {
        const backupProduct = backupMap.get(marketplaceProduct.id);
        if (backupProduct && backupProduct.status !== 'approved') {
          issues.push({
            type: 'status_mismatch',
            productId: marketplaceProduct.id,
            description: `Status mismatch for ${marketplaceProduct.id}: Marketplace='approved', Backup='${backupProduct.status}'`,
            severity: 'high',
            autoFixed: false
          });
        }
      }

      this.logger.logStep('STATUS-CONSISTENCY', `Found ${issues.length} status mismatches`);
      
    } catch (error) {
      this.logger.logError('STATUS-CONSISTENCY', error as Error, 'Failed to validate status consistency');
    }

    return issues;
  }

  // Validate timestamp integrity and chronological order
  private async validateTimestampIntegrity(): Promise<any[]> {
    const issues = [];
    
    try {
      const backupClient = await this.backupPool.connect();
      
      try {
        // Check for products with invalid timestamps
        const invalidTimestamps = await backupClient.query(`
          SELECT id, created_at, updated_at 
          FROM products 
          WHERE created_at > updated_at 
          OR created_at IS NULL 
          OR updated_at IS NULL
        `);

        for (const row of invalidTimestamps.rows) {
          issues.push({
            type: 'timestamp_inconsistency',
            productId: row.id,
            description: `Invalid timestamps for product ${row.id}: created_at=${row.created_at}, updated_at=${row.updated_at}`,
            severity: 'medium',
            autoFixed: false
          });
        }

        // Check for products with future timestamps
        const now = new Date();
        const futureTimestamps = await backupClient.query(`
          SELECT id, created_at, updated_at 
          FROM products 
          WHERE created_at > $1 OR updated_at > $1
        `, [now]);

        for (const row of futureTimestamps.rows) {
          issues.push({
            type: 'timestamp_inconsistency',
            productId: row.id,
            description: `Future timestamps detected for product ${row.id}`,
            severity: 'low',
            autoFixed: false
          });
        }

      } finally {
        backupClient.release();
      }

      this.logger.logStep('TIMESTAMP-INTEGRITY', `Found ${issues.length} timestamp issues`);
      
    } catch (error) {
      this.logger.logError('TIMESTAMP-INTEGRITY', error as Error, 'Failed to validate timestamp integrity');
    }

    return issues;
  }

  // Validate data integrity and corruption
  private async validateDataIntegrity(): Promise<any[]> {
    const issues = [];
    
    try {
      const backupClient = await this.backupPool.connect();
      
      try {
        // Check for corrupted data (null essential fields)
        const corruptedData = await backupClient.query(`
          SELECT id 
          FROM products 
          WHERE title IS NULL 
          OR price IS NULL 
          OR category IS NULL 
          OR status IS NULL
          OR seller_id IS NULL
        `);

        for (const row of corruptedData.rows) {
          issues.push({
            type: 'data_corruption',
            productId: row.id,
            description: `Essential fields are NULL for product ${row.id}`,
            severity: 'critical',
            autoFixed: false
          });
        }

        // Check for invalid price values
        const invalidPrices = await backupClient.query(`
          SELECT id, price 
          FROM products 
          WHERE price <= 0 OR price IS NOT numeric
        `);

        for (const row of invalidPrices.rows) {
          issues.push({
            type: 'data_corruption',
            productId: row.id,
            description: `Invalid price value for product ${row.id}: ${row.price}`,
            severity: 'high',
            autoFixed: false
          });
        }

        // Check for invalid status values
        const invalidStatuses = await backupClient.query(`
          SELECT id, status 
          FROM products 
          WHERE status NOT IN ('pending', 'approved', 'rejected')
        `);

        for (const row of invalidStatuses.rows) {
          issues.push({
            type: 'data_corruption',
            productId: row.id,
            description: `Invalid status for product ${row.id}: ${row.status}`,
            severity: 'medium',
            autoFixed: false
          });
        }

      } finally {
        backupClient.release();
      }

      this.logger.logStep('DATA-INTEGRITY', `Found ${issues.length} data corruption issues`);
      
    } catch (error) {
      this.logger.logError('DATA-INTEGRITY', error as Error, 'Failed to validate data integrity');
    }

    return issues;
  }

  // Auto-fix backup issues where possible
  private async autoFixBackupIssues(issues: any[]): Promise<any[]> {
    const fixedIssues = [...issues];
    
    for (const issue of fixedIssues) {
      try {
        switch (issue.type) {
          case 'missing_product':
            await this.fixMissingProduct(issue);
            break;
          case 'status_mismatch':
            await this.fixStatusMismatch(issue);
            break;
          case 'timestamp_inconsistency':
            await this.fixTimestampIssue(issue);
            break;
        }
      } catch (error) {
        this.logger.logError('AUTO-FIX', error as Error, `Failed to fix issue: ${issue.description}`);
        issue.autoFixed = false;
      }
    }

    const autoFixedCount = fixedIssues.filter(i => i.autoFixed).length;
    this.logger.logSuccess('AUTO-FIX', `Auto-fix process completed`, `Fixed ${autoFixedCount}/${issues.length} issues`);

    return fixedIssues;
  }

  // Fix missing products in backup
  private async fixMissingProduct(issue: any): Promise<void> {
    this.logger.logStep('FIX-MISSING', `Attempting to backup missing product ${issue.productId}`);

    // Try to find the product in pending or marketplace database
    let product: any;
    
    try {
      const pendingProducts = await this.getAllProductsFromDatabase('pending');
      product = pendingProducts.find(p => p.id === issue.productId);
    } catch {}

    if (!product) {
      try {
        const marketplaceProducts = await this.getAllProductsFromDatabase('marketplace');
        product = marketplaceProducts.find(p => p.id === issue.productId);
      } catch {}
    }

    if (product) {
      await this.backupProduct(product);
      issue.autoFixed = true;
      this.logger.logSuccess('FIX-MISSING', `Product ${issue.productId} successfully backed up`);
    } else {
      this.logger.logStep('FIX-MISSING', `Could not find product ${issue.productId} to backup`);
    }
  }

  // Fix status mismatches
  private async fixStatusMismatch(issue: any): Promise<void> {
    this.logger.logStep('FIX-STATUS', `Attempting to fix status mismatch for product ${issue.productId}`);

    // Determine correct status based on source database
    let correctStatus: string = '';
    let sourceProduct: any;

    try {
      const pendingProducts = await this.getAllProductsFromDatabase('pending');
      sourceProduct = pendingProducts.find(p => p.id === issue.productId);
      if (sourceProduct) {
        correctStatus = sourceProduct.status;
      }
    } catch {}

    if (!sourceProduct) {
      try {
        const marketplaceProducts = await this.getAllProductsFromDatabase('marketplace');
        sourceProduct = marketplaceProducts.find(p => p.id === issue.productId);
        if (sourceProduct) {
          correctStatus = 'approved'; // Marketplace products should always be approved
        }
      } catch {}
    }

    if (sourceProduct && correctStatus) {
      await this.updateProductStatus(issue.productId, correctStatus);
      issue.autoFixed = true;
      this.logger.logSuccess('FIX-STATUS', `Product ${issue.productId} status updated to ${correctStatus}`);
    }
  }

  // Fix timestamp issues
  private async fixTimestampIssue(issue: any): Promise<void> {
    this.logger.logStep('FIX-TIMESTAMP', `Attempting to fix timestamp issue for product ${issue.productId}`);

    const backupClient = await this.backupPool.connect();
    
    try {
      // Get current product data
      const result = await backupClient.query('SELECT * FROM products WHERE id = $1', [issue.productId]);
      
      if (result.rows.length > 0) {
        const product = result.rows[0];
        const now = new Date();
        
        // Fix timestamps
        let createdAt = product.created_at;
        let updatedAt = product.updated_at;
        
        if (!createdAt || createdAt > updatedAt) {
          createdAt = now;
        }
        
        if (!updatedAt || updatedAt < createdAt) {
          updatedAt = now;
        }
        
        await backupClient.query(`
          UPDATE products 
          SET created_at = $1, updated_at = $2 
          WHERE id = $3
        `, [createdAt, updatedAt, issue.productId]);
        
        issue.autoFixed = true;
        this.logger.logSuccess('FIX-TIMESTAMP', `Product ${issue.productId} timestamps corrected`);
      }
      
    } finally {
      backupClient.release();
    }
  }

  // Helper methods
  private async getAllProductsFromDatabase(database: 'pending' | 'marketplace' | 'backup'): Promise<any[]> {
    const pool = database === 'pending' ? this.pendingPool : 
                 database === 'marketplace' ? this.marketplacePool : this.backupPool;
    
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM products ORDER BY created_at DESC');
      return result.rows;
    } finally {
      client.release();
    }
  }

  private async backupProduct(product: any): Promise<void> {
    const backupClient = await this.backupPool.connect();
    
    try {
      await backupClient.query(`
        INSERT INTO products (
          id, title, price, category, description, featured, in_stock,
          rating, reviews, images, material, care, status, badges, seller_id,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
        product.badges, product.seller_id, product.created_at, product.updated_at
      ]);
    } finally {
      backupClient.release();
    }
  }

  private async updateProductStatus(productId: string, status: string): Promise<void> {
    const backupClient = await this.backupPool.connect();
    
    try {
      await backupClient.query(`
        UPDATE products 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
      `, [status, productId]);
    } finally {
      backupClient.release();
    }
  }

  // Get product history from backup database
  async getProductHistory(productId: string): Promise<ProductHistory | null> {
    const backupClient = await this.backupPool.connect();
    
    try {
      const result = await backupClient.query(`
        SELECT * FROM products WHERE id = $1
      `, [productId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const product = result.rows[0];
      
      // Reconstruct history from timestamps and status changes
      const history: ProductHistory = {
        productId,
        events: [
          {
            eventType: 'created',
            timestamp: product.created_at,
            fromDatabase: 'A', // Assume created in pending
            toDatabase: 'A',
            status: 'pending',
            details: { title: product.title, sellerId: product.seller_id }
          }
        ]
      };
      
      // Add approval/rejection event if status changed
      if (product.status !== 'pending') {
        history.events.push({
          eventType: product.status === 'approved' ? 'approved' : 'rejected',
          timestamp: product.updated_at,
          fromDatabase: 'A',
          toDatabase: product.status === 'approved' ? 'B' : 'C',
          status: product.status,
          details: { reason: 'Admin review completed' }
        });
      }
      
      return history;
      
    } finally {
      backupClient.release();
    }
  }

  // Generate comprehensive backup report
  async generateBackupReport(): Promise<{
    summary: any;
    validation: BackupValidationResult;
    recommendations: string[];
  }> {
    this.logger.logStep('BACKUP-REPORT', 'Generating comprehensive Central Backup report');
    
    const validation = await this.validateCentralBackup();
    
    const summary = {
      totalProducts: validation.summary.totalProducts,
      healthyProducts: validation.summary.totalProducts - validation.issues.length,
      issueBreakdown: {
        missing: validation.summary.missingProducts,
        statusMismatches: validation.summary.statusMismatches,
        timestampIssues: validation.summary.timestampIssues,
        corruption: validation.summary.corruptionIssues
      },
      lastValidated: new Date().toISOString(),
      backupIntegrity: validation.isValid ? 'HEALTHY' : 'NEEDS_ATTENTION'
    };
    
    const recommendations = this.generateBackupRecommendations(validation);
    
    return {
      summary,
      validation,
      recommendations
    };
  }

  private generateBackupRecommendations(validation: BackupValidationResult): string[] {
    const recommendations = [];
    
    if (!validation.isValid) {
      recommendations.push('🚨 CRITICAL: Central Backup validation failed. Immediate attention required.');
    }
    
    if (validation.summary.missingProducts > 0) {
      recommendations.push(`📦 Found ${validation.summary.missingProducts} missing products. Run auto-repair to backup missing data.`);
    }
    
    if (validation.summary.statusMismatches > 0) {
      recommendations.push(`⚖️ Found ${validation.summary.statusMismatches} status mismatches. Run auto-repair to synchronize statuses.`);
    }
    
    if (validation.summary.corruptionIssues > 0) {
      recommendations.push(`💥 Found ${validation.summary.corruptionIssues} data corruption issues. Manual intervention required.`);
    }
    
    if (validation.issues.filter(i => i.autoFixed).length > 0) {
      recommendations.push('✅ Some issues were automatically fixed. Review the validation report for details.');
    }
    
    const unfixedIssues = validation.issues.filter(i => !i.autoFixed);
    if (unfixedIssues.length > 0) {
      recommendations.push(`⚠️ ${unfixedIssues.length} issues require manual intervention. Check individual issue details.`);
    }
    
    // General recommendations
    recommendations.push('🔄 Schedule regular backup validations to maintain data integrity.');
    recommendations.push('📊 Monitor backup size and performance metrics regularly.');
    recommendations.push('🔐 Implement backup retention policies for long-term storage.');
    
    return recommendations;
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    await Promise.all([
      this.backupPool.end(),
      this.pendingPool.end(),
      this.marketplacePool.end()
    ]);
  }
}

export default CentralBackupValidator;
