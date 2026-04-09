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

### ðŸš€ Fitur

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

## ðŸ—ï¸ Struktur Halaman

1. **Navbar** - Sticky navigation dengan logo, menu, cart, dan user profile
2. **Hero Section** - Banner utama dengan CTA dan statistik
3. **Kategori Produk** - Grid kategori dengan hover effects
4. **Produk Unggulan** - Card produk dengan quick actions
5. **Promo Banner** - Section promo diskon dengan visual menarik
6. **Testimoni** - Customer reviews dan kepercayaan
7. **Footer** - Links lengkap, kontak, dan newsletter

## ðŸ› ï¸ Teknologi

- **Next.js 14/15** - React framework dengan App Router dan Server Components
- **TypeScript 5.0+** - Type safety dan developer experience
- **Tailwind CSS** - Utility-first CSS framework dengan custom design system
- **Prisma ORM 5.0+** - Database ORM dengan type-safe queries
- **Neon PostgreSQL** - Cloud database dengan performa tinggi
- **NextAuth.js** - Authentication dengan role-based access control
- **Lucide React** - Icon library modern
- **Framer Motion** - Animasi dan micro-interactions

## ðŸ“ Struktur Folder

```
src/
â”œâ”€â”€ app/                    # Next.js App Router
â”‚   â”œâ”€â”€ api/               # API routes
â”‚   â”œâ”€â”€ globals.css        # Global styles
â”‚   â”œâ”€â”€ layout.tsx         # Root layout
â”‚   â””â”€â”€ page.tsx           # Homepage
â”œâ”€â”€ components/            # React components
â”‚   â”œâ”€â”€ layout/           # Layout components (Navbar, Footer)
â”‚   â”œâ”€â”€ sections/         # Page sections
â”‚   â””â”€â”€ ui/               # UI components
â”œâ”€â”€ data/                 # Static data (products, categories, testimonials)
â””â”€â”€ lib/                  # Utility functions
```

## ðŸš€ Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Buka [http://localhost:3000](http://localhost:3000)** di browser

## ðŸ“¦ Data Structure

### Produk (Shopify-Ready)
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

### Kategori
```typescript
interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}
```

## ðŸŽ¨ Customization

- **Warna**: Edit kelas warna di Tailwind CSS
- **Font**: Modifikasi `src/app/layout.tsx`
- **Data**: Update file di `src/data/`
- **Components**: Tambah custom components di `src/components/`

## ðŸš€ Deployment

### Vercel (Recommended)
```bash
npm run build
```

Deploy ke [Vercel Platform](https://vercel.com/new) untuk hosting terbaik.

### Build Manual
```bash
npm run build
npm start
```

## ðŸ”§ Integrasi Shopify

Proyek ini sudah disiapkan untuk integrasi dengan Shopify:

1. **Install Shopify Storefront API**
   ```bash
   npm install @shopify/storefront-api-react
   ```

2. **Update product fetching** di components
3. **Setup Shopify context** untuk cart management
4. **Connect checkout** dengan Shopify

## ðŸ“± Responsiveness

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## ðŸŽ¯ Performance Features

- **Lazy Loading**: Images menggunakan Next.js Image component
- **Optimized Bundle**: Tree shaking dan code splitting
- **SEO**: Meta tags dan structured data
- **Cache**: Image caching dengan CDN

## ðŸ¤ Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## ðŸ“„ License

MIT License - see LICENSE file for details.

---

Built with â¤ï¸ using Next.js & Tailwind CSS
