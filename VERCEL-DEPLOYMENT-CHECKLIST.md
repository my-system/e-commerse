# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.production`
- [ ] Set `PENDING_DATABASE_URL` (PostgreSQL connection string)
- [ ] Set `MARKETPLACE_DATABASE_URL` (PostgreSQL connection string)
- [ ] Set `BACKUP_DATABASE_URL` (PostgreSQL connection string)
- [ ] Set `DATABASE_URL` (Main PostgreSQL connection string)
- [ ] Set `NEXTAUTH_SECRET` (32+ character random string)
- [ ] Set `NEXTAUTH_URL` (Your Vercel domain)

### 2. Database Setup
- [ ] Create PostgreSQL database (Vercel Postgres or external)
- [ ] Test database connections
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`

### 3. Code Preparation
- [ ] Run pre-deploy script: `npm run pre-deploy`
- [ ] Verify TypeScript compilation: `npm run type-check`
- [ ] Test build locally: `npm run build`
- [ ] Check all API routes work correctly

## 📋 Deployment Methods

### Method A: GitHub Integration (Recommended)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import from GitHub
   - Configure environment variables
   - Deploy

### Method B: Vercel CLI
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

## 🔧 Vercel Configuration

### Environment Variables (in Vercel Dashboard)
```
PENDING_DATABASE_URL=postgresql://...
MARKETPLACE_DATABASE_URL=postgresql://...
BACKUP_DATABASE_URL=postgresql://...
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-32-character-secret
NODE_ENV=production
```

### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🚨 Post-Deployment Tasks

### 1. Database Migration
```bash
# Run migrations on production database
npx prisma migrate deploy
```

### 2. Seed Data (Optional)
```bash
# Seed initial data if needed
npm run db:seed
```

### 3. Verify Deployment
- [ ] Check main page loads correctly
- [ ] Test user authentication
- [ ] Verify database connections
- [ ] Test API endpoints
- [ ] Check mobile responsiveness
- [ ] Verify animations work

## 🔍 Testing Checklist

### Core Features
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Admin dashboard
- [ ] Seller dashboard
- [ ] Product management
- [ ] Order management

### API Endpoints
- [ ] `/api/products` - Product listing
- [ ] `/api/products/[id]` - Product details
- [ ] `/api/marketplace-products` - Marketplace products
- [ ] `/api/auth/[...nextauth]` - Authentication
- [ ] Admin approval endpoints

### Performance
- [ ] Page load speed < 3 seconds
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] API response times < 500ms

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error
```
Error: Can't reach database server
```
**Solution**: 
- Check database connection strings
- Verify IP whitelisting
- Ensure SSL is enabled

#### 2. Build Error
```
Error: Module not found
```
**Solution**:
- Check `package.json` dependencies
- Run `npm install`
- Verify import paths

#### 3. Runtime Error
```
Error: Environment variable not set
```
**Solution**:
- Check Vercel dashboard environment variables
- Redeploy after adding variables
- Verify variable names exactly

#### 4. Prisma Error
```
Error: P1001: Can't reach database server
```
**Solution**:
- Update database URL in Vercel
- Check database provider settings
- Verify network access

## 📊 Monitoring & Analytics

### Vercel Dashboard
- **Analytics**: Track page views and performance
- **Logs**: Monitor function execution
- **Usage**: Check bandwidth and invocations

### Database Monitoring
- **Connection Pool**: Monitor active connections
- **Query Performance**: Check slow queries
- **Storage Usage**: Monitor database size

## 🔄 CI/CD Pipeline

### Automatic Deployment Setup
1. **GitHub Actions** (Optional)
   ```yaml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm install
         - name: Run tests
           run: npm test
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.ORG_ID }}
             vercel-project-id: ${{ secrets.PROJECT_ID }}
   ```

2. **Vercel Git Integration**
   - Connect GitHub repository
   - Enable automatic deployments
   - Configure deploy previews

## 🎯 Success Criteria

✅ **Deployment Successful**
- Application accessible at Vercel domain
- All pages load without errors
- Database connections working
- Authentication functional

✅ **Performance Optimized**
- Core Web Vitals passing
- Images optimized and loading quickly
- API responses under 500ms
- Mobile performance optimized

✅ **Production Ready**
- Environment variables configured
- Error monitoring in place
- Security headers configured
- HTTPS enforced

---

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Environment Variables**: https://vercel.com/docs/projects/environment-variables

---

**🎉 Ready for deployment! Follow this checklist for a smooth Vercel deployment.**
