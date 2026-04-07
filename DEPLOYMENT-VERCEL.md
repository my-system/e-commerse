# E-Commerce Shopify - Vercel Deployment Guide

## 🚀 Deployment ke Vercel

### Prasyarat:
1. Akun Vercel (https://vercel.com)
2. GitHub repository (atau Git provider lainnya)
3. Database PostgreSQL (Vercel Postgres atau eksternal)

### 📋 Langkah 1: Siapkan Environment Variables

Buat file `.env.production` dengan konfigurasi berikut:

```bash
# Database Configuration
PENDING_DATABASE_URL="postgresql://username:password@host:port/database_name"
MARKETPLACE_DATABASE_URL="postgresql://username:password@host:port/database_name"
BACKUP_DATABASE_URL="postgresql://username:password@host:port/database_name"
DATABASE_URL="postgresql://username:password@host:port/database_name"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secret-random-string-at-least-32-characters-long"

# Environment
NODE_ENV="production"
```

### 📋 Langkah 2: Setup Database

#### Opsi A: Vercel Postgres (Recommended)
1. Di Vercel dashboard → Storage → Create Database
2. Pilih PostgreSQL
3. Copy connection string ke environment variables

#### Opsi B: External Database
1. Gunakan existing PostgreSQL (Supabase, Railway, etc.)
2. Update connection strings di environment variables

### 📋 Langkah 3: Deploy ke Vercel

#### Method 1: GitHub Integration (Recommended)
1. Push code ke GitHub repository
2. Di Vercel → Add New → Project
3. Import dari GitHub
4. Setup environment variables di Vercel dashboard
5. Deploy

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy project
vercel --prod
```

### 📋 Langkah 4: Post-Deployment Setup

1. **Database Migration** (jika menggunakan external database):
   ```bash
   # Run migration di production
   npx prisma migrate deploy
   ```

2. **Seed Data** (opsional):
   ```bash
   # Seed initial data
   npm run db:seed
   ```

3. **Verify Environment Variables**:
   - Check Vercel dashboard → Settings → Environment Variables
   - Pastikan semua variables terisi dengan benar

### 🔧 Konfigurasi Khusus

#### Build Configuration
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

#### Environment Variables Required
```
PENDING_DATABASE_URL=postgresql://...
MARKETPLACE_DATABASE_URL=postgresql://...
BACKUP_DATABASE_URL=postgresql://...
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=random-secret-string
NODE_ENV=production
```

### 🚨 Troubleshooting

#### Common Issues:
1. **Database Connection Error**
   - Pastikan connection string benar
   - Check firewall/whitelist IP Vercel

2. **Build Error**
   - Check `package.json` scripts
   - Verify Prisma schema

3. **Runtime Error**
   - Check environment variables
   - Verify API routes configuration

#### Debug Commands:
```bash
# Local production build test
npm run build
npm start

# Check database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate
```

### 📊 Monitoring

1. **Vercel Analytics**: Dashboard → Analytics
2. **Database Monitoring**: Vercel Postgres dashboard
3. **Logs**: Vercel → Functions → Logs

### 🔄 CI/CD Pipeline

Setiap push ke main branch akan:
1. Trigger automatic build
2. Run database migrations
3. Deploy ke production
4. Update environment variables

### 📱 Domain Customization

1. Di Vercel dashboard → Settings → Domains
2. Add custom domain
3. Update NEXTAUTH_URL ke custom domain
4. Configure DNS records

### 🛡️ Security Considerations

1. **Environment Variables**: Jangan commit ke Git
2. **Database**: Gunakan SSL connections
3. **API Rate Limiting**: Configure di Vercel
4. **CORS**: Setup untuk API endpoints

### 📈 Performance Optimization

1. **Database**: Connection pooling
2. **CDN**: Vercel Edge Network
3. **Images**: Vercel Image Optimization
4. **Caching**: Next.js static optimization

---

## 🎯 Quick Deploy Checklist:

- [ ] GitHub repository siap
- [ ] Environment variables di-set
- [ ] Database PostgreSQL siap
- [ ] `vercel.json` konfigurasi
- [ ] Build test lokal berhasil
- [ ] Deploy ke Vercel
- [ ] Post-deployment testing
- [ ] Domain configuration
- [ ] Monitoring setup

**Selamat deploy! 🎉**
