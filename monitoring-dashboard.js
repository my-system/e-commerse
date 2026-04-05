// Real-time Monitoring Dashboard
const { Pool } = require('pg');

class MonitoringDashboard {
  constructor() {
    this.pendingPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_pending",
      ssl: false
    });
    
    this.marketplacePool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace", 
      ssl: false
    });
    
    this.metrics = {
      products: { uploaded: 0, approved: 0, rejected: 0, pending: 0 },
      performance: { apiResponseTime: 0, errorRate: 0 },
      users: { activeSellers: 0, activeCustomers: 0 },
      system: { databaseConnections: 0, uptime: 0 }
    };
  }

  async generateDashboard() {
    console.log('📊 GENERATING MONITORING DASHBOARD');
    console.log('===================================\n');
    
    await this.collectMetrics();
    this.displayDashboard();
    await this.checkAlerts();
    
    return this.metrics;
  }

  async collectMetrics() {
    // Product metrics
    await this.collectProductMetrics();
    
    // Performance metrics
    await this.collectPerformanceMetrics();
    
    // System metrics
    await this.collectSystemMetrics();
  }

  async collectProductMetrics() {
    try {
      // Pending database metrics
      const pendingClient = await this.pendingPool.connect();
      const pendingResult = await pendingClient.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
          DATE(created_at) as date
        FROM products 
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 7
      `);
      
      // Marketplace database metrics
      const marketplaceClient = await this.marketplacePool.connect();
      const marketplaceResult = await marketplaceClient.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          AVG(price) as avg_price,
          DATE(created_at) as date
        FROM products 
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 7
      `);
      
      // Calculate totals
      const pendingTotal = await pendingClient.query('SELECT COUNT(*) FROM products');
      const marketplaceTotal = await marketplaceClient.query('SELECT COUNT(*) FROM products');
      
      this.metrics.products = {
        pending: parseInt(pendingTotal.rows[0].count),
        approved: parseInt(marketplaceTotal.rows[0].count),
        uploaded: parseInt(pendingTotal.rows[0].count) + parseInt(marketplaceTotal.rows[0].count),
        rejected: 0, // Would need to track this properly
        dailyStats: {
          pending: pendingResult.rows,
          marketplace: marketplaceResult.rows
        }
      };
      
      pendingClient.release();
      marketplaceClient.release();
      
    } catch (error) {
      console.error('Error collecting product metrics:', error.message);
    }
  }

  async collectPerformanceMetrics() {
    try {
      // Test API response times
      const endpoints = [
        '/api/pending-products',
        '/api/admin/pending-products',
        '/api/marketplace-products'
      ];
      
      let totalTime = 0;
      let errors = 0;
      
      for (const endpoint of endpoints) {
        const start = Date.now();
        try {
          const response = await fetch(`http://localhost:3000${endpoint}`);
          totalTime += Date.now() - start;
          
          if (!response.ok) {
            errors++;
          }
        } catch (error) {
          errors++;
        }
      }
      
      this.metrics.performance = {
        apiResponseTime: Math.round(totalTime / endpoints.length),
        errorRate: (errors / endpoints.length) * 100
      };
      
    } catch (error) {
      console.error('Error collecting performance metrics:', error.message);
    }
  }

  async collectSystemMetrics() {
    try {
      // Database connection health
      const pendingHealth = await this.testDatabaseConnection(this.pendingPool);
      const marketplaceHealth = await this.testDatabaseConnection(this.marketplacePool);
      
      this.metrics.system = {
        databaseConnections: {
          pending: pendingHealth ? 'healthy' : 'unhealthy',
          marketplace: marketplaceHealth ? 'healthy' : 'unhealthy'
        },
        uptime: process.uptime()
      };
      
    } catch (error) {
      console.error('Error collecting system metrics:', error.message);
    }
  }

  async testDatabaseConnection(pool) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      return false;
    }
  }

  displayDashboard() {
    console.log('📈 SYSTEM METRICS');
    console.log('==================');
    
    // Product metrics
    console.log('\n📦 PRODUCT METRICS:');
    console.log('  🔄 Pending:', this.metrics.products.pending);
    console.log('  ✅ Approved:', this.metrics.products.approved);
    console.log('  📊 Total Uploaded:', this.metrics.products.uploaded);
    
    if (this.metrics.products.dailyStats?.pending.length > 0) {
      console.log('  📅 Last 7 Days:');
      this.metrics.products.dailyStats.pending.forEach(stat => {
        console.log(`    ${stat.date}: ${stat.total} uploaded`);
      });
    }
    
    // Performance metrics
    console.log('\n⚡ PERFORMANCE METRICS:');
    console.log(`  🕐 Avg API Response Time: ${this.metrics.performance.apiResponseTime}ms`);
    console.log(`  📊 Error Rate: ${this.metrics.performance.errorRate.toFixed(1)}%`);
    
    // System metrics
    console.log('\n🖥️  SYSTEM METRICS:');
    console.log(`  🗄️  Pending DB: ${this.metrics.system.databaseConnections.pending}`);
    console.log(`  🗄️  Marketplace DB: ${this.metrics.system.databaseConnections.marketplace}`);
    console.log(`  ⏰ Uptime: ${Math.floor(this.metrics.system.uptime / 3600)}h ${Math.floor((this.metrics.system.uptime % 3600) / 60)}m`);
  }

  async checkAlerts() {
    console.log('\n🚨 ALERTS & WARNINGS:');
    console.log('======================');
    
    const alerts = [];
    
    // Check for high error rate
    if (this.metrics.performance.errorRate > 10) {
      alerts.push({
        level: 'critical',
        message: `High error rate: ${this.metrics.performance.errorRate.toFixed(1)}%`,
        recommendation: 'Check API endpoints and database connections'
      });
    }
    
    // Check for slow response times
    if (this.metrics.performance.apiResponseTime > 1000) {
      alerts.push({
        level: 'warning',
        message: `Slow API response time: ${this.metrics.performance.apiResponseTime}ms`,
        recommendation: 'Optimize database queries or add caching'
      });
    }
    
    // Check database health
    if (this.metrics.system.databaseConnections.pending === 'unhealthy') {
      alerts.push({
        level: 'critical',
        message: 'Pending database connection failed',
        recommendation: 'Check database server and connection string'
      });
    }
    
    if (this.metrics.system.databaseConnections.marketplace === 'unhealthy') {
      alerts.push({
        level: 'critical',
        message: 'Marketplace database connection failed',
        recommendation: 'Check database server and connection string'
      });
    }
    
    // Check for too many pending products
    if (this.metrics.products.pending > 50) {
      alerts.push({
        level: 'warning',
        message: `High number of pending products: ${this.metrics.products.pending}`,
        recommendation: 'Consider increasing admin capacity or auto-approval rules'
      });
    }
    
    if (alerts.length === 0) {
      console.log('  ✅ No alerts - System running normally');
    } else {
      alerts.forEach(alert => {
        const icon = alert.level === 'critical' ? '🔴' : '🟡';
        console.log(`  ${icon} ${alert.message}`);
        console.log(`     💡 ${alert.recommendation}`);
      });
    }
    
    return alerts;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      alerts: await this.checkAlerts()
    };
    
    // Save report to file (in production, this would go to a monitoring system)
    const fs = require('fs');
    fs.writeFileSync('monitoring-report.json', JSON.stringify(report, null, 2));
    
    return report;
  }

  async cleanup() {
    await this.pendingPool.end();
    await this.marketplacePool.end();
  }
}

// Auto-monitoring function
async function startMonitoring() {
  const dashboard = new MonitoringDashboard();
  
  // Generate initial dashboard
  await dashboard.generateDashboard();
  
  // Set up continuous monitoring (every 5 minutes)
  setInterval(async () => {
    console.log('\n' + '='.repeat(50));
    console.log('🔄 SCHEDULED MONITORING CHECK');
    console.log('='.repeat(50));
    
    await dashboard.generateDashboard();
    await dashboard.generateReport();
  }, 5 * 60 * 1000); // 5 minutes
}

module.exports = { MonitoringDashboard, startMonitoring };

// Run immediately if called directly
if (require.main === module) {
  startMonitoring();
}
