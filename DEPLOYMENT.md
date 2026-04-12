# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- A PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
- Environment variables configured
- Vercel account (for Vercel deployment) or server access (for self-hosted)

## Environment Variables

Copy `.env.example` to `.env.local` and update with your actual values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEON_DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth.js Configuration
NEXTAUTH_URL="https://your-production-domain.com"
NEXTAUTH_SECRET="your-super-secret-random-string-at-least-32-characters-long"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: Email Service (Resend)
RESEND_API_KEY="re_your_resend_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Production Environment
NODE_ENV="production"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Pre-Deployment Checklist

- [ ] Update `.env.local` with production database URL
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] Configure OAuth providers (Google, etc.) if needed
- [ ] Test database connection
- [ ] Run `npm run build` locally to verify build succeeds
- [ ] Remove any debug console.log statements from code

## Build for Production

### 1. Stop Development Server

If running, stop the dev server first (Ctrl+C) to release file locks:

```bash
# Stop the dev server (Ctrl+C)
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Build the Application

```bash
npm run build
```

This will:
- Generate Prisma client
- Build Next.js application
- Optimize assets
- Create production-ready `.next` folder

### 5. Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to verify the production build works correctly.

## Deployment Options

### Option 1: Vercel (Recommended)

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Deploy via Vercel Dashboard

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Configure environment variables in Vercel settings
4. Deploy

#### Vercel Environment Variables

In Vercel dashboard → Settings → Environment Variables:

- `DATABASE_URL`
- `NEON_DATABASE_URL`
- `NEXTAUTH_URL` (auto-set by Vercel, but verify)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` (if using Google OAuth)
- `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
- `RESEND_API_KEY` (if using email service)
- `RESEND_FROM_EMAIL` (if using email service)
- `NODE_ENV=production`

### Option 2: Self-Hosted (Node.js)

#### 1. Build Application

```bash
npm run build
```

#### 2. Start Production Server

```bash
npm start
```

The app will run on port 3000 by default.

#### 3. Use Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "ecommerce" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### 4. Configure Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. Configure SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Option 3: Docker

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Update next.config.ts

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... other config
}
```

#### 3. Build and Run Docker Image

```bash
# Build image
docker build -t ecommerce-app .

# Run container
docker run -p 3000:3000 --env-file .env.local ecommerce-app
```

## Post-Deployment

### 1. Verify Database Connection

Check if the application can connect to the production database.

### 2. Test Authentication

- Test login/logout functionality
- Test OAuth providers if configured
- Test session management

### 3. Test Core Features

- Product listing
- Product detail pages
- Cart functionality
- Checkout process
- User profile management
- Admin panel

### 4. Monitor Logs

Check application logs for any errors:

```bash
# PM2 logs
pm2 logs ecommerce

# Docker logs
docker logs <container-id>
```

### 5. Set Up Monitoring

Consider setting up:
- Error tracking (Sentry)
- Analytics (Google Analytics, Vercel Analytics)
- Uptime monitoring
- Performance monitoring

## Troubleshooting

### Build Fails with Prisma Lock Error

**Problem:** Prisma query engine file is locked.

**Solution:**
1. Stop the dev server (Ctrl+C)
2. Delete `node_modules/.prisma` folder
3. Run `npm run build` again

### Database Connection Error

**Problem:** Application cannot connect to database.

**Solution:**
1. Verify DATABASE_URL is correct
2. Check if database is accessible from deployment environment
3. Verify SSL mode is correct in connection string
4. Check firewall rules

### Images Not Loading

**Problem:** External images (Unsplash) not loading.

**Solution:**
1. Verify `next.config.ts` has correct image domains
2. Check if domains are allowed in production
3. Consider hosting images locally or using CDN

### NextAuth Session Issues

**Problem:** Users keep getting logged out.

**Solution:**
1. Verify NEXTAUTH_URL is set to production domain
2. Verify NEXTAUTH_SECRET is set and consistent
3. Check database session storage is working

## Security Checklist

- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Use HTTPS in production
- [ ] Set up proper CORS if needed
- [ ] Disable debug mode in production
- [ ] Set up rate limiting for API routes
- [ ] Use environment variables for all secrets
- [ ] Never commit .env files
- [ ] Regularly update dependencies
- [ ] Set up database backups
- [ ] Monitor for security vulnerabilities

## Performance Optimization

- Enable image optimization (already configured in next.config.ts)
- Use CDN for static assets
- Enable caching headers
- Optimize database queries
- Use server components where possible
- Lazy load components below the fold
- Minify CSS and JS (automatic in production build)

## Backup Strategy

### Database Backups

For Neon database:
- Enable automatic backups in Neon console
- Export regular backups using pg_dump

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Application Backups

- Keep source code in Git repository
- Document deployment process
- Keep environment variables secure
- Version control database schema changes (Prisma migrations)

## Support

For issues or questions:
- Check Next.js documentation: https://nextjs.org/docs
- Check Prisma documentation: https://www.prisma.io/docs
- Check NextAuth documentation: https://next-auth.js.org

## Notes

- This application uses Next.js 16 with the App Router
- Database: PostgreSQL via Prisma ORM
- Authentication: NextAuth.js
- Styling: Tailwind CSS v4
- State Management: React Context API
