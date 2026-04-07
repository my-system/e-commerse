@echo off
REM Pre-deployment script for Vercel deployment (Windows)
echo 🚀 Starting pre-deployment setup...

REM Check if required environment variables are set
if "%PENDING_DATABASE_URL%"=="" (
    echo ❌ PENDING_DATABASE_URL is required
    exit /b 1
)

if "%MARKETPLACE_DATABASE_URL%"=="" (
    echo ❌ MARKETPLACE_DATABASE_URL is required
    exit /b 1
)

if "%NEXTAUTH_SECRET%"=="" (
    echo ❌ NEXTAUTH_SECRET is required
    exit /b 1
)

echo ✅ Environment variables validated

REM Generate Prisma client
echo 📦 Generating Prisma client...
npx prisma generate

REM Check database connection
echo 🔍 Checking database connections...
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

echo 🎯 Pre-deployment setup complete!
