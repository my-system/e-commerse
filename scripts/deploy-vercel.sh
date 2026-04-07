#!/bin/bash

# 🚀 Complete Vercel Deployment Script
# This script handles the entire deployment process

set -e  # Exit on any error

echo "🚀 Starting Vercel Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI is not installed"
        log_info "Install with: npm i -g vercel"
        exit 1
    fi
    
    # Check if git is initialized
    if [ ! -d ".git" ]; then
        log_error "Git repository not initialized"
        log_info "Initialize with: git init"
        exit 1
    fi
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        log_warning ".env.production not found"
        log_info "Copy .env.production.template to .env.production and configure"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Pre-deployment validation
validate_deployment() {
    log_info "Running pre-deployment validation..."
    
    # Run the pre-deploy script
    if npm run pre-deploy; then
        log_success "Pre-deployment validation passed"
    else
        log_error "Pre-deployment validation failed"
        exit 1
    fi
}

# Build the application
build_application() {
    log_info "Building application..."
    
    if npm run build; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    log_info "Deploying to Vercel..."
    
    if vercel --prod; then
        log_success "Deployment completed successfully"
    else
        log_error "Deployment failed"
        exit 1
    fi
}

# Post-deployment verification
verify_deployment() {
    log_info "Running post-deployment verification..."
    
    # Get the deployed URL
    DEPLOYED_URL=$(vercel ls --scope=vercel 2>/dev/null | grep "Production" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYED_URL" ]; then
        log_success "Application deployed to: $DEPLOYED_URL"
        
        # Wait a moment for the deployment to be ready
        log_info "Waiting for deployment to be ready..."
        sleep 10
        
        # Check if the site is accessible
        if curl -f -s -o /dev/null -w "%{http_code}" "https://$DEPLOYED_URL" | grep -q "200\|301\|302"; then
            log_success "Site is accessible and responding correctly"
        else
            log_warning "Site might not be fully ready yet, please check manually"
        fi
    else
        log_warning "Could not retrieve deployment URL"
    fi
}

# Main deployment flow
main() {
    echo "🎯 E-Commerce Shopify - Vercel Deployment"
    echo "================================================"
    
    check_prerequisites
    validate_deployment
    build_application
    deploy_to_vercel
    verify_deployment
    
    echo ""
    echo "🎉 Deployment process completed!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Visit your deployed application"
    echo "2. Test all functionality"
    echo "3. Monitor Vercel dashboard for any issues"
    echo "4. Check database connections and API endpoints"
    echo ""
    echo "🔧 Useful Commands:"
    echo "- View logs: vercel logs"
    echo "- List deployments: vercel ls"
    echo "- Open project: vercel open"
    echo "- Inspect: vercel inspect"
}

# Run main function
main "$@"
