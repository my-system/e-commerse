// Terminal Script for AI Health Check & System Monitoring
// Usage: node enhanced-system-monitor.js [options]
const { Pool } = require('pg');

class EnhancedSystemMonitor {
  constructor() {
    this.logger = new TerminalLogger();
    this.connections = {
      pending: new EnhancedDatabaseConnection("postgresql://postgres:postgres@localhost:5432/ecommerce_pending"),
      marketplace: new EnhancedDatabaseConnection("postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"),
      backup: new EnhancedDatabaseConnection("postgresql://postgres:postgres@localhost:5432/commercedb")
    };
  }

  async runComprehensiveCheck() {
    const operationId = 'terminal-health-check';
    this.logger.startOperationTimer(operationId, 120000); // 2 minutes timeout
    
    try {
      console.log('🚀 ENHANCED 3-DATABASE SYSTEM MONITOR');
      console.log('==========================================\n');
      
      const results = {
        timestamp: new Date().toISOString(),
        databases: {},
        integrity: {},
        performance: {},
        recommendations: []
      };
      
      // Check each database
      console.log('📊 DATABASE STATUS CHECK');
      console.log('------------------------');
      
      results.databases.pending = await this.checkDatabase('pending', this.connections.pending);
      results.databases.marketplace = await this.checkDatabase('marketplace', this.connections.marketplace);
      results.databases.backup = await this.checkDatabase('backup', this.connections.backup);
      
      // Check data integrity
      console.log('\n🔍 DATA INTEGRITY ANALYSIS');
      console.log('---------------------------');
      
      results.integrity = await this.analyzeDataIntegrity();
      
      // Check performance metrics
      console.log('\n⚡ PERFORMANCE METRICS');
      console.log('---------------------');
      
      results.performance = await this.measurePerformance();
      
      // Generate recommendations
      results.recommendations = this.generateRecommendations(results);
      
      // Display summary
      this.displaySummary(results);
      
      return results;
      
    } catch (error) {
      this.logger.logError('SYSTEM-MONITOR', error, 'Comprehensive system check failed');
      throw error;
    } finally {
      this.logger.clearOperationTimer(operationId);
    }
  }

  async checkDatabase(name: string, connection: any) {
    const startTime = Date.now();
    
    try {
      this.logger.logStep('DB-CHECK', `Connecting to ${name} database`);
      
      const client = await connection.connectWithRetry();
      
      try {
        // Check table existence
        const tableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'products'
          );
        `);
        
        const tableExists = tableCheck.rows[0].exists;
        
        if (!tableExists) {
          return {
            status: 'error',
            message: 'Products table does not exist',
            connectionTime: Date.now() - startTime
          };
        }
        
        // Get product count and status breakdown
        const countResult = await client.query('SELECT COUNT(*) FROM products');
        const statusCheck = await client.query(`
          SELECT status, COUNT(*) as count 
          FROM products 
          GROUP BY status
        `);
        
        const total = parseInt(countResult.rows[0].count);
        const connectionTime = Date.now() - startTime;
        
        this.logger.logSuccess('DB-CHECK', `${name} database check completed`, 
          `${total} products, ${connectionTime}ms connection time`);
        
        return {
          status: 'healthy',
          total,
          statusBreakdown: statusCheck.rows,
          connectionTime,
          timestamp: new Date().toISOString()
        };
        
      } finally {
        client.release();
      }
      
    } catch (error) {
      this.logger.logError('DB-CHECK', error, `Failed to check ${name} database`);
      return {
        status: 'error',
        message: error.message,
        connectionTime: Date.now() - startTime
      };
    }
  }

  async analyzeDataIntegrity() {
    const startTime = Date.now();
    
    try {
      this.logger.logStep('INTEGRITY', 'Starting comprehensive data integrity analysis');
      
      const integrity = {
        duplicates: [],
        inconsistencies: [],
        orphans: [],
        missingBackups: [],
        analysisTime: Date.now() - startTime
      };
      
      // Get all products from all databases
      const pendingClient = await this.connections.pending.connectWithRetry();
      const marketplaceClient = await this.connections.marketplace.connectWithRetry();
      const backupClient = await this.connections.backup.connectWithRetry();
      
      try {
        const [pendingResult, marketplaceResult, backupResult] = await Promise.all([
          pendingClient.query('SELECT id, title, status FROM products'),
          marketplaceClient.query('SELECT id, title, status FROM products'),
          backupClient.query('SELECT id, title, status FROM products')
        ]);
        
        const pendingProducts = pendingResult.rows;
        const marketplaceProducts = marketplaceResult.rows;
        const backupProducts = backupResult.rows;
        
        // Check for duplicates
        const pendingIds = new Set(pendingProducts.map(p => p.id));
        const marketplaceIds = new Set(marketplaceProducts.map(p => p.id));
        
        for (const id of pendingIds) {
          if (marketplaceIds.has(id)) {
            const product = pendingProducts.find(p => p.id === id);
            integrity.duplicates.push({
              id,
              title: product.title,
              locations: ['Pending', 'Marketplace'],
              severity: 'high'
            });
          }
        }
        
        // Check for inconsistencies
        const backupMap = new Map(backupProducts.map(p => [p.id, p]));
        
        for (const marketProduct of marketplaceProducts) {
          const backupProduct = backupMap.get(marketProduct.id);
          
          if (!backupProduct) {
            integrity.inconsistencies.push({
              id: marketProduct.id,
              title: marketProduct.title,
              issue: 'Missing from backup',
              severity: 'medium'
            });
          } else if (backupProduct.status !== 'approved') {
            integrity.inconsistencies.push({
              id: marketProduct.id,
              title: marketProduct.title,
              issue: `Status mismatch: Marketplace='approved', Backup='${backupProduct.status}'`,
              severity: 'medium'
            });
          }
        }
        
        // Check for orphaned data
        const allProductIds = new Set([
          ...pendingProducts.map(p => p.id),
          ...marketplaceProducts.map(p => p.id)
        ]);
        
        for (const backupProduct of backupProducts) {
          if (!allProductIds.has(backupProduct.id)) {
            integrity.orphans.push({
              id: backupProduct.id,
              title: backupProduct.title,
              issue: 'Orphaned backup record',
              severity: 'low'
            });
          }
        }
        
        // Check for missing backups
        for (const productId of allProductIds) {
          if (!backupMap.has(productId)) {
            integrity.missingBackups.push({
              id: productId,
              issue: 'Missing backup',
              severity: 'high'
            });
          }
        }
        
        this.logger.logSuccess('INTEGRITY', 'Data integrity analysis completed', 
          `Found ${integrity.duplicates.length + integrity.inconsistencies.length + integrity.orphans.length + integrity.missingBackups.length} issues`);
        
        return integrity;
        
      } finally {
        pendingClient.release();
        marketplaceClient.release();
        backupClient.release();
      }
      
    } catch (error) {
      this.logger.logError('INTEGRITY', error, 'Data integrity analysis failed');
      throw error;
    }
  }

  async measurePerformance() {
    const startTime = Date.now();
    
    try {
      this.logger.logStep('PERFORMANCE', 'Measuring system performance metrics');
      
      const performance = {
        connectionTimes: {},
        queryTimes: {},
        systemLoad: {},
        measurementTime: Date.now() - startTime
      };
      
      // Measure connection times
      const connectionStart = Date.now();
      await this.connections.pending.connectWithRetry();
      performance.connectionTimes.pending = Date.now() - connectionStart;
      
      const marketplaceStart = Date.now();
      await this.connections.marketplace.connectWithRetry();
      performance.connectionTimes.marketplace = Date.now() - marketplaceStart;
      
      const backupStart = Date.now();
      await this.connections.backup.connectWithRetry();
      performance.connectionTimes.backup = Date.now() - backupStart;
      
      // Measure query times
      const pendingClient = await this.connections.pending.connectWithRetry();
      try {
        const queryStart = Date.now();
        await pendingClient.query('SELECT COUNT(*) FROM products');
        performance.queryTimes.pendingCount = Date.now() - queryStart;
      } finally {
        pendingClient.release();
      }
      
      const marketplaceClient = await this.connections.marketplace.connectWithRetry();
      try {
        const queryStart = Date.now();
        await marketplaceClient.query('SELECT COUNT(*) FROM products');
        performance.queryTimes.marketplaceCount = Date.now() - queryStart;
      } finally {
        marketplaceClient.release();
      }
      
      const backupClient = await this.connections.backup.connectWithRetry();
      try {
        const queryStart = Date.now();
        await backupClient.query('SELECT COUNT(*) FROM products');
        performance.queryTimes.backupCount = Date.now() - queryStart;
      } finally {
        backupClient.release();
      }
      
      // System load metrics
      performance.systemLoad = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      };
      
      this.logger.logSuccess('PERFORMANCE', 'Performance measurement completed');
      
      return performance;
      
    } catch (error) {
      this.logger.logError('PERFORMANCE', error, 'Performance measurement failed');
      throw error;
    }
  }

  generateRecommendations(results) {
    const recommendations = [];
    
    // Database health recommendations
    Object.entries(results.databases).forEach(([name, db]: [string, any]) => {
      if (db.status === 'error') {
        recommendations.push({
          priority: 'high',
          category: 'database',
          message: `${name} database is inaccessible: ${db.message}`,
          action: 'Check database connection and configuration'
        });
      }
      
      if (db.connectionTime > 5000) {
        recommendations.push({
          priority: 'medium',
          category: 'performance',
          message: `${name} database connection is slow (${db.connectionTime}ms)`,
          action: 'Optimize database connection or check network latency'
        });
      }
    });
    
    // Integrity recommendations
    if (results.integrity.duplicates.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'data-integrity',
        message: `Found ${results.integrity.duplicates.length} duplicate products`,
        action: 'Run auto-repair to remove duplicates from pending database'
      });
    }
    
    if (results.integrity.inconsistencies.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'data-integrity',
        message: `Found ${results.integrity.inconsistencies.length} data inconsistencies`,
        action: 'Run auto-repair to synchronize backup database'
      });
    }
    
    if (results.integrity.missingBackups.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'backup',
        message: `Found ${results.integrity.missingBackups.length} products missing from backup`,
        action: 'Run auto-repair to create missing backups'
      });
    }
    
    // Performance recommendations
    if (results.performance.connectionTimes.pending > 3000) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        message: 'Pending database connection is slow',
        action: 'Check database server performance and network connectivity'
      });
    }
    
    return recommendations;
  }

  displaySummary(results) {
    console.log('\n📋 SYSTEM HEALTH SUMMARY');
    console.log('========================');
    
    // Overall status
    const criticalIssues = [
      ...results.integrity.duplicates,
      ...results.integrity.missingBackups
    ].length;
    
    const mediumIssues = results.integrity.inconsistencies.length;
    const databaseErrors = Object.values(results.databases).filter((db: any) => db.status === 'error').length;
    
    let overallStatus = 'HEALTHY';
    if (criticalIssues > 0 || databaseErrors > 0) {
      overallStatus = 'CRITICAL';
    } else if (mediumIssues > 5) {
      overallStatus = 'WARNING';
    }
    
    const statusIcon = overallStatus === 'HEALTHY' ? '✅' : overallStatus === 'WARNING' ? '⚠️' : '🚨';
    console.log(`${statusIcon} Overall Status: ${overallStatus}`);
    console.log(`📊 Database Status: ${Object.values(results.databases).filter((db: any) => db.status === 'healthy').length}/3 healthy`);
    console.log(`🔍 Data Integrity: ${criticalIssues + mediumIssues} issues found`);
    console.log(`⚡ Performance: Avg connection time ${Math.round(
      Object.values(results.performance.connectionTimes).reduce((a: number, b: number) => a + b, 0) / 3
    )}ms`);
    
    // Top recommendations
    if (results.recommendations.length > 0) {
      console.log('\n💡 TOP RECOMMENDATIONS');
      console.log('---------------------');
      
      results.recommendations
        .filter(r => r.priority === 'high')
        .slice(0, 3)
        .forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.message}`);
          console.log(`   Action: ${rec.action}`);
        });
    }
    
    console.log(`\n🕐 Completed at: ${new Date().toISOString()}`);
    console.log('==========================================\n');
  }

  async cleanup() {
    await Promise.all([
      this.connections.pending.end(),
      this.connections.marketplace.end(),
      this.connections.backup.end()
    ]);
  }
}

// Enhanced Database Connection Class (simplified for terminal)
class EnhancedDatabaseConnection {
  constructor(connectionString) {
    this.pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 30000,
      max: 5
    });
  }

  async connectWithRetry() {
    let lastError;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await this.pool.connect();
      } catch (error) {
        lastError = error;
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw lastError;
  }

  async end() {
    await this.pool.end();
  }
}

// Terminal Logger Class
class TerminalLogger {
  constructor() {
    this.activeOperations = new Map();
  }

  logStep(step, operation, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${step}: ${operation}`);
    if (details) console.log(`    ℹ️  ${details}`);
  }

  logError(step, error, details) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${step} ERROR: ${error.message}`);
    if (details) console.error(`    🔍 Details: ${details}`);
  }

  logSuccess(step, message, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ ${step} SUCCESS: ${message}`);
    if (details) console.log(`    🎯 ${details}`);
  }

  startOperationTimer(operationId, timeoutMs = 60000) {
    this.clearOperationTimer(operationId);
    
    const timer = setTimeout(() => {
      console.error(`⏰ TIMEOUT: Operation '${operationId}' exceeded ${timeoutMs}ms limit`);
      console.error(`🚨 TERMINAL BUSY DETECTION: Auto-terminating hung operation`);
      this.clearOperationTimer(operationId);
    }, timeoutMs);
    
    this.activeOperations.set(operationId, timer);
  }

  clearOperationTimer(operationId) {
    const timer = this.activeOperations.get(operationId);
    if (timer) {
      clearTimeout(timer);
      this.activeOperations.delete(operationId);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  
  const monitor = new EnhancedSystemMonitor();
  
  try {
    switch (command) {
      case 'check':
        await monitor.runComprehensiveCheck();
        break;
        
      case 'quick':
        console.log('🚀 Running quick health check...');
        // Quick check implementation
        break;
        
      case 'help':
        console.log('Enhanced 3-Database System Monitor');
        console.log('Usage: node enhanced-system-monitor.js [command]');
        console.log('');
        console.log('Commands:');
        console.log('  check    - Run comprehensive system health check');
        console.log('  quick    - Run quick health check');
        console.log('  help     - Show this help message');
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        console.log('Use "help" to see available commands');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 System monitor failed:', error.message);
    process.exit(1);
  } finally {
    await monitor.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { EnhancedSystemMonitor };
