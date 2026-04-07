@echo off
REM 🚀 Complete Vercel Deployment Script (Windows)
REM This script handles the entire deployment process

echo 🚀 Starting Vercel Deployment Process...
echo.

REM Check prerequisites
echo ℹ️  Checking prerequisites...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed
    echo ℹ️  Install with: npm i -g vercel
    exit /b 1
)

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not initialized
    echo ℹ️  Initialize with: git init
    exit /b 1
)

REM Check if .env.production exists
if not exist ".env.production" (
    echo ⚠️  .env.production not found
    echo ℹ️  Copy .env.production.template to .env.production and configure
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Pre-deployment validation
echo ℹ️  Running pre-deployment validation...
call npm run pre-deploy
if %errorlevel% neq 0 (
    echo ❌ Pre-deployment validation failed
    exit /b 1
)
echo ✅ Pre-deployment validation passed
echo.

REM Build the application
echo ℹ️  Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully
echo.

REM Deploy to Vercel
echo ℹ️  Deploying to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    exit /b 1
)
echo ✅ Deployment completed successfully
echo.

REM Post-deployment verification
echo ℹ️  Running post-deployment verification...
echo.

echo 🎉 Deployment process completed!
echo.
echo 📋 Next Steps:
echo 1. Visit your deployed application
echo 2. Test all functionality  
echo 3. Monitor Vercel dashboard for any issues
echo 4. Check database connections and API endpoints
echo.
echo 🔧 Useful Commands:
echo - View logs: vercel logs
echo - List deployments: vercel ls
echo - Open project: vercel open
echo - Inspect: vercel inspect
echo.
pause
