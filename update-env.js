// Update .env file for multi-database system
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = `# Multi-Database E-commerce System

# Pending Database (for seller submissions)
PENDING_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_pending"

# Marketplace Database (for approved products)  
MARKETPLACE_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"

# Original database (backup/legacy)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/commercedb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Other environment variables
NODE_ENV="development"
`;

// Write to .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file updated for multi-database system');
console.log('📊 Database A: ecommerce_pending');
console.log('📊 Database B: ecommerce_marketplace');
console.log('📊 Database C: commercedb (backup)');
