# Tri-Database E-commerce System - Production

# Database URLs (Replace with your cloud database URLs)
PENDING_DATABASE_URL="postgresql://[USER]:[PASS]@[HOST]:[PORT]/ecommerce_pending"
MARKETPLACE_DATABASE_URL="postgresql://[USER]:[PASS]@[HOST]:[PORT]/ecommerce_marketplace"
BACKUP_DATABASE_URL="postgresql://[USER]:[PASS]@[HOST]:[PORT]/commercedb"

# Main Database URL
DATABASE_URL="postgresql://[USER]:[PASS]@[HOST]:[PORT]/ecommerce_marketplace"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret-key-here"

# Environment
NODE_ENV="production"

# File Upload (Optional - for cloud storage)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
