// Update .env file for tri-database system
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = `# Tri-Database E-commerce System

# Database A: Pending (for seller submissions)
PENDING_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_pending"

# Database B: Marketplace (for approved products)  
MARKETPLACE_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"

# Database C: Backup (for all products backup)
BACKUP_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/commercedb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Other environment variables
NODE_ENV="development"
`;

// Write to .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file updated for TRI-DATABASE system');
console.log('📊 Database A: ecommerce_pending (seller submissions)');
console.log('📊 Database B: ecommerce_marketplace (approved products)');
console.log('📊 Database C: commercedb (backup & recovery)');
