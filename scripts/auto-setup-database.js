#!/usr/bin/env node

/**
 * Auto Database Setup Script
 * Automatically sets up database when connection fails
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
const FALLBACK_DB = 'file:./fallback.db';

class DatabaseAutoSetup {
  constructor() {
    this.prisma = null;
    this.isSetup = false;
    this.setupAttempts = 0;
    this.maxAttempts = 3;
  }

  async testConnection(databaseUrl) {
    try {
      const testClient = new PrismaClient({
        datasources: {
          db: { url: databaseUrl }
        }
      });
      
      // Test simple query
      await testClient.$queryRaw`SELECT 1`;
      await testClient.$disconnect();
      return true;
    } catch (error) {
      console.log(`❌ Connection test failed for: ${databaseUrl}`);
      console.log(`   Error: ${error.message}`);
      return false;
    }
  }

  async checkTablesExist(client) {
    try {
      const tables = await client.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      const requiredTables = ['products', 'users', 'orders', 'categories'];
      const existingTables = tables.map(t => t.table_name);
      
      return requiredTables.every(table => existingTables.includes(table));
    } catch (error) {
      console.log('❌ Could not check tables:', error.message);
      return false;
    }
  }

  async runMigrations(client) {
    try {
      console.log('📋 Running database migrations...');
      const { execSync } = require('child_process');
      
      // Run Prisma migrations
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Migrations completed');
    } catch (error) {
      console.log('❌ Migration failed:', error.message);
      throw error;
    }
  }

  async seedDefaultData(client) {
    try {
      console.log('🌱 Seeding default data...');
      
      // Seed categories
      await client.category.upsert({
        where: { name: 'Fashion' },
        update: { name: 'Fashion' },
        create: { name: 'Fashion', slug: 'fashion' }
      });
      
      await client.category.upsert({
        where: { name: 'Electronics' },
        update: { name: 'Electronics' },
        create: { name: 'Electronics', slug: 'electronics' }
      });
      
      await client.category.upsert({
        where: { name: 'Home & Living' },
        update: { name: 'Home & Living' },
        create: { name: 'Home & Living', slug: 'home-living' }
      });
      
      // Seed admin user
      await client.user.upsert({
        where: { email: 'yusufdarwis097@gmail.com' },
        update: { email: 'yusufdarwis097@gmail.com' },
        create: {
          email: 'yusufdarwis097@gmail.com',
          name: 'Yusuf Darwis Admin',
          role: 'ADMIN',
          password: '12345678'
        }
      });
      
      console.log('✅ Default data seeded successfully');
    } catch (error) {
      console.log('❌ Seeding failed:', error.message);
      throw error;
    }
  }

  async setupFallbackDatabase() {
    try {
      console.log('🔄 Setting up fallback database (SQLite)...');
      
      // Use SQLite fallback
      this.prisma = new PrismaClient({
        datasources: {
          db: { url: FALLBACK_DB }
        }
      });
      
      // Create fallback schema
      await this.runMigrations(this.prisma);
      await this.seedDefaultData(this.prisma);
      
      // Update .env for future use
      this.updateEnvFile(FALLBACK_DB);
      
      console.log('✅ Fallback database setup completed');
      this.isSetup = true;
      return this.prisma;
    } catch (error) {
      console.log('❌ Fallback setup failed:', error.message);
      throw new Error('All database setup attempts failed');
    }
  }

  updateEnvFile(databaseUrl) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      let envContent = '';
      
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }
      
      // Update or add DATABASE_URL
      const lines = envContent.split('\n');
      const updatedLines = lines.map(line => {
        if (line.startsWith('DATABASE_URL=')) {
          return `DATABASE_URL="${databaseUrl}"`;
        }
        return line;
      });
      
      // Add DATABASE_URL if not exists
      if (!updatedLines.some(line => line.startsWith('DATABASE_URL='))) {
        updatedLines.push(`DATABASE_URL="${databaseUrl}"`);
      }
      
      fs.writeFileSync(envPath, updatedLines.join('\n'));
      console.log('✅ Environment file updated');
    } catch (error) {
      console.log('❌ Could not update .env file:', error.message);
    }
  }

  async setupMainDatabase() {
    try {
      console.log('🔍 Setting up main database...');
      
      // Test primary database connection
      const isConnected = await this.testConnection(DATABASE_URL);
      
      if (!isConnected) {
        throw new Error('Primary database connection failed');
      }
      
      // Create Prisma client
      this.prisma = new PrismaClient({
        datasources: {
          db: { url: DATABASE_URL }
        }
      });
      
      // Check if setup needed
      const tablesExist = await this.checkTablesExist(this.prisma);
      
      if (!tablesExist) {
        console.log('📋 Database tables not found, setting up...');
        await this.runMigrations(this.prisma);
        await this.seedDefaultData(this.prisma);
      }
      
      console.log('✅ Main database setup completed');
      this.isSetup = true;
      return this.prisma;
    } catch (error) {
      console.log('❌ Main database setup failed:', error.message);
      return await this.setupFallbackDatabase();
    }
  }

  async getClient() {
    if (this.isSetup) {
      return this.prisma;
    }
    
    this.setupAttempts++;
    console.log(`🚀 Auto-setup attempt ${this.setupAttempts}/${this.maxAttempts}`);
    
    try {
      return await this.setupMainDatabase();
    } catch (error) {
      if (this.setupAttempts >= this.maxAttempts) {
        console.log('❌ Max setup attempts reached');
        throw new Error('Database auto-setup failed after maximum attempts');
      }
      
      // Retry with delay
      console.log('⏳ Retrying in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return this.getClient();
    }
  }
}

// Auto-setup function
async function autoSetupDatabase() {
  console.log('🚀 Starting automatic database setup...');
  console.log('📍 Working directory:', process.cwd());
  console.log('🔗 Database URL:', DATABASE_URL);
  
  const dbSetup = new DatabaseAutoSetup();
  
  try {
    const client = await dbSetup.getClient();
    console.log('🎉 Database auto-setup completed successfully!');
    console.log('📊 Database is ready for use');
    
    // Test basic operations
    const userCount = await client.user.count();
    const productCount = await client.product.count();
    
    console.log(`📈 Database stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);
    
    return client;
  } catch (error) {
    console.log('💥 Auto-setup failed:', error.message);
    console.log('🔧 Please check your database configuration');
    process.exit(1);
  }
}

// Run auto-setup if called directly
if (require.main === module) {
  autoSetupDatabase();
}

module.exports = { DatabaseAutoSetup, autoSetupDatabase };
