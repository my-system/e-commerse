#!/bin/bash

# Pre-deployment script for Vercel deployment
echo "🚀 Starting pre-deployment setup..."

# Check if required environment variables are set
if [ -z "$PENDING_DATABASE_URL" ]; then
    echo "❌ PENDING_DATABASE_URL is required"
    exit 1
fi

if [ -z "$MARKETPLACE_DATABASE_URL" ]; then
    echo "❌ MARKETPLACE_DATABASE_URL is required"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET is required"
    exit 1
fi

echo "✅ Environment variables validated"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Check database connection
echo "🔍 Checking database connections..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database connection successful');
    prisma.\$disconnect();
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });
"

echo "🎯 Pre-deployment setup complete!"
