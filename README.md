# LUXE - Modern E-commerce Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14%2F15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-informational)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-green)](https://neon.tech/)

## [Bahasa Indonesia] | [English](#english)

---

## Bahasa Indonesia

### Deskripsi Proyek

LUXE adalah marketplace e-commerce modern yang dibangun dengan arsitektur yang bersih dan teknologi terkini. Proyek ini menampilkan sistem approval seller, server components untuk performa optimal, dan integrasi database cloud yang robust.

### Fitur

- **Design Modern & Profesional** - UI clean dan modern dengan micro-interactions
- **Fully Responsive** - Optimal di desktop, tablet, dan mobile
- **SEO Optimized** - Meta tags, Open Graph, dan struktur data yang baik
- **Shopify-Ready** - Struktur data yang siap untuk integrasi Shopify
- **Performance Optimized** - Lazy loading images dan optimasi performa

### Fitur Unggulan

- **Server Components** - Performa optimal dengan Next.js 14/15 App Router
- **Sistem Approval Seller** - Workflow Pending/Approved untuk produk seller
- **Clean Architecture** - Struktur kode yang terorganisir dan scalable
- **Real-time Database** - Neon PostgreSQL dengan Prisma ORM
- **Authentication** - NextAuth.js dengan role-based access control
- **Admin Dashboard** - Management panel untuk produk dan users
- **Multi-database Support** - Pending, Marketplace, dan Backup databases

### Tech Stack

- **Next.js 14/15** - React framework dengan App Router dan Server Components
- **TypeScript 5.0+** - Type safety dan developer experience
- **Tailwind CSS** - Utility-first CSS framework dengan custom design system
- **Prisma ORM 5.0+** - Database ORM dengan type-safe queries
- **Neon PostgreSQL** - Cloud database dengan performa tinggi
- **NextAuth.js** - Authentication dengan role-based access control
- **Lucide React** - Icon library modern
- **Framer Motion** - Animasi dan micro-interactions

### Panduan Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/luxe-ecommerce.git
   cd luxe-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dengan konfigurasi Anda:
   ```env
   DATABASE_URL="postgresql://your-neon-db-url"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Setup database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Buka [http://localhost:3000](http://localhost:3000)** di browser

### Struktur Folder

```
luxe-ecommerce/
|
|--- scripts/                    # Utility scripts dan database migrations
|--- src/
|    |--- app/                   # Next.js App Router
|    |    |--- api/             # API routes (authentication, products, admin)
|    |    |--- (public)/        # Public pages (home, about, contact)
|    |    |--- admin/           # Admin dashboard pages
|    |    |--- product/         # Product detail pages
|    |    |--- globals.css      # Global styles
|    |    |--- layout.tsx       # Root layout
|    |    |--- page.tsx         # Homepage
|    |
|    |--- components/           # React components
|    |    |--- admin/           # Admin-specific components
|    |    |--- auth/             # Authentication components
|    |    |--- client/           # Client-side components
|    |    |--- layout/           # Layout components (Navbar, Footer)
|    |    |--- sections/         # Page sections (Hero, Featured, etc.)
|    |    |--- ui/               # Reusable UI components
|    |
|    |--- contexts/             # React contexts (Cart, Auth, etc.)
|    |--- data/                 # Static data (products, categories, testimonials)
|    |--- lib/                  # Utility functions dan configurations
|    |    |--- auth-simple.ts   # NextAuth configuration
|    |    |--- database.ts      # Database connection
|    |    |--- multi-database-service.ts # Multi-database operations
|    |
|--- prisma/                    # Prisma schema dan migrations
|    |--- schema.prisma         # Database schema
|    |--- migrations/           # Database migrations
|    |--- seed.ts              # Database seeding
|
|--- public/                     # Static assets
|--- .env.example               # Environment variables template
|--- .gitignore                 # Git ignore rules
|--- README.md                  # Project documentation
|--- package.json               # Dependencies dan scripts
|--- tsconfig.json              # TypeScript configuration
|--- tailwind.config.js         # Tailwind CSS configuration
```

### Struktur Halaman

1. **Navbar** - Sticky navigation dengan logo, menu, cart, dan user profile
2. **Hero Section** - Banner utama dengan CTA dan statistik
3. **Kategori Produk** - Grid kategori dengan hover effects
4. **Produk Unggulan** - Card produk dengan quick actions
5. **Promo Banner** - Section promo diskon dengan visual menarik
6. **Testimoni** - Customer reviews dan kepercayaan
7. **Footer** - Links lengkap, kontak, dan newsletter

### Data Structure

#### Produk (Shopify-Ready)
```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  featured?: boolean;
}
```

#### Kategori
```typescript
interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}
```

### Customization

- **Warna**: Edit kelas warna di Tailwind CSS
- **Font**: Modifikasi `src/app/layout.tsx`
- **Data**: Update file di `src/data/`
- **Components**: Tambah custom components di `src/components/`

### Deployment

#### Vercel (Recommended)
```bash
npm run build
```

Deploy ke [Vercel Platform](https://vercel.com/new) untuk hosting terbaik.

#### Build Manual
```bash
npm run build
npm start
```

### Integrasi Shopify

Proyek ini sudah disiapkan untuk integrasi dengan Shopify:

1. **Install Shopify Storefront API**
   ```bash
   npm install @shopify/storefront-api-react
   ```

2. **Update product fetching** di components
3. **Setup Shopify context** untuk cart management
4. **Connect checkout** dengan Shopify

### Responsiveness

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Performance Features

- **Lazy Loading**: Images menggunakan Next.js Image component
- **Optimized Bundle**: Tree shaking dan code splitting
- **SEO**: Meta tags dan structured data
- **Cache**: Image caching dengan CDN

### Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## English

### Project Description

LUXE is a modern e-commerce marketplace built with clean architecture and cutting-edge technology. This project features a seller approval system, server components for optimal performance, and robust cloud database integration.

### Features

- **Modern & Professional Design** - Clean UI with micro-interactions
- **Fully Responsive** - Optimized for desktop, tablet, and mobile
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Shopify-Ready** - Data structure ready for Shopify integration
- **Performance Optimized** - Lazy loading images and performance optimization

### Key Features

- **Server Components** - Optimal performance with Next.js 14/15 App Router
- **Seller Approval System** - Pending/Approved workflow for seller products
- **Clean Architecture** - Organized and scalable code structure
- **Real-time Database** - Neon PostgreSQL with Prisma ORM
- **Authentication** - NextAuth.js with role-based access control
- **Admin Dashboard** - Management panel for products and users
- **Multi-database Support** - Pending, Marketplace, and Backup databases

### Tech Stack

- **Next.js 14/15** - React framework with App Router and Server Components
- **TypeScript 5.0+** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Prisma ORM 5.0+** - Database ORM with type-safe queries
- **Neon PostgreSQL** - Cloud database with high performance
- **NextAuth.js** - Authentication with role-based access control
- **Lucide React** - Modern icon library
- **Framer Motion** - Animations and micro-interactions

### Installation Guide

1. **Clone repository**
   ```bash
   git clone https://github.com/username/luxe-ecommerce.git
   cd luxe-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://your-neon-db-url"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Setup database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Folder Structure

```
luxe-ecommerce/
|
|--- scripts/                    # Utility scripts and database migrations
|--- src/
|    |--- app/                   # Next.js App Router
|    |    |--- api/             # API routes (authentication, products, admin)
|    |    |--- (public)/        # Public pages (home, about, contact)
|    |    |--- admin/           # Admin dashboard pages
|    |    |--- product/         # Product detail pages
|    |    |--- globals.css      # Global styles
|    |    |--- layout.tsx       # Root layout
|    |    |--- page.tsx         # Homepage
|    |
|    |--- components/           # React components
|    |    |--- admin/           # Admin-specific components
|    |    |--- auth/             # Authentication components
|    |    |--- client/           # Client-side components
|    |    |--- layout/           # Layout components (Navbar, Footer)
|    |    |--- sections/         # Page sections (Hero, Featured, etc.)
|    |    |--- ui/               # Reusable UI components
|    |
|    |--- contexts/             # React contexts (Cart, Auth, etc.)
|    |--- data/                 # Static data (products, categories, testimonials)
|    |--- lib/                  # Utility functions and configurations
|    |    |--- auth-simple.ts   # NextAuth configuration
|    |    |--- database.ts      # Database connection
|    |    |--- multi-database-service.ts # Multi-database operations
|    |
|--- prisma/                    # Prisma schema and migrations
|    |--- schema.prisma         # Database schema
|    |--- migrations/           # Database migrations
|    |--- seed.ts              # Database seeding
|
|--- public/                     # Static assets
|--- .env.example               # Environment variables template
|--- .gitignore                 # Git ignore rules
|--- README.md                  # Project documentation
|--- package.json               # Dependencies and scripts
|--- tsconfig.json              # TypeScript configuration
|--- tailwind.config.js         # Tailwind CSS configuration
```

### Page Structure

1. **Navbar** - Sticky navigation with logo, menu, cart, and user profile
2. **Hero Section** - Main banner with CTA and statistics
3. **Product Categories** - Category grid with hover effects
4. **Featured Products** - Product cards with quick actions
5. **Promo Banner** - Discount section with attractive visuals
6. **Testimonials** - Customer reviews and trust
7. **Footer** - Complete links, contact, and newsletter

### Data Structure

#### Product (Shopify-Ready)
```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  featured?: boolean;
}
```

#### Category
```typescript
interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}
```

### Customization

- **Colors**: Edit color classes in Tailwind CSS
- **Fonts**: Modify `src/app/layout.tsx`
- **Data**: Update files in `src/data/`
- **Components**: Add custom components in `src/components/`

### Deployment

#### Vercel (Recommended)
```bash
npm run build
```

Deploy to [Vercel Platform](https://vercel.com/new) for best hosting.

#### Manual Build
```bash
npm run build
npm start
```

### Shopify Integration

This project is prepared for Shopify integration:

1. **Install Shopify Storefront API**
   ```bash
   npm install @shopify/storefront-api-react
   ```

2. **Update product fetching** in components
3. **Setup Shopify context** for cart management
4. **Connect checkout** with Shopify

### Responsiveness

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Performance Features

- **Lazy Loading**: Images using Next.js Image component
- **Optimized Bundle**: Tree shaking and code splitting
- **SEO**: Meta tags and structured data
- **Cache**: Image caching with CDN

### Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - see LICENSE file for details.

---

Built with :heart: using Next.js & Tailwind CSS
