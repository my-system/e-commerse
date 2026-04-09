#!/usr/bin/env node

// Automated Database Setup Script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting LUXE Marketplace Database Setup...\n');

// Check if .env.local exists, if not create from example
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local from .env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ .env.local created successfully');
    console.log('⚠️  Please update your database credentials in .env.local\n');
  } else {
    console.error('❌ .env.example not found. Please create .env.local manually.');
    process.exit(1);
  }
}

// Validate environment variables
require('dotenv').config({ path: envLocalPath });

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or NEON_DATABASE_URL not found in .env.local');
  console.error('Please update your .env.local file with the correct database URL');
  process.exit(1);
}

console.log('✅ Database URL found in environment');

// Generate Prisma client
console.log('\n📦 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Push database schema
console.log('\n🗄️  Pushing database schema...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully');
} catch (error) {
  console.error('❌ Failed to push database schema:', error.message);
  console.log('💡 This might be due to existing data. Try running with --force flag');
  process.exit(1);
}

// Seed database if needed
console.log('\n🌱 Seeding database...');
try {
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.warn('⚠️  Database seeding failed (this might be expected):', error.message);
}

// Test database connection
console.log('\n🔍 Testing database connection...');
try {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  const result = await pool.query('SELECT NOW()');
  pool.end();
  
  console.log('✅ Database connection successful');
  console.log(`   Server time: ${result.rows[0].now}`);
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// Create admin user if not exists
console.log('\n👤 Creating admin user...');
try {
  execSync('node scripts/create-admin.js', { stdio: 'inherit' });
  console.log('✅ Admin user setup completed');
} catch (error) {
  console.warn('⚠️  Admin user creation failed:', error.message);
}

console.log('\n🎉 Database setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Visit: http://localhost:3000');
console.log('   3. Login with admin credentials');
console.log('   4. Check health: http://localhost:3000/api/health/database');
console.log('\n💡 Tip: Run this script whenever you clone the project or change database schema');
