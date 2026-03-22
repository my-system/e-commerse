# LUXE - E-commerce Homepage Modern

Homepage e-commerce modern yang dibangun dengan Next.js dan Tailwind CSS. Proyek ini dirancang sebagai fondasi untuk toko online yang akan diintegrasikan dengan Shopify.

## 🚀 Fitur

- **Design Modern & Profesional** - UI clean dan modern dengan micro-interactions
- **Fully Responsive** - Optimal di desktop, tablet, dan mobile
- **SEO Optimized** - Meta tags, Open Graph, dan struktur data yang baik
- **Shopify-Ready** - Struktur data yang siap untuk integrasi Shopify
- **Performance Optimized** - Lazy loading images dan optimasi performa

## 🏗️ Struktur Halaman

1. **Navbar** - Sticky navigation dengan logo, menu, cart, dan user profile
2. **Hero Section** - Banner utama dengan CTA dan statistik
3. **Kategori Produk** - Grid kategori dengan hover effects
4. **Produk Unggulan** - Card produk dengan quick actions
5. **Promo Banner** - Section promo diskon dengan visual menarik
6. **Testimoni** - Customer reviews dan kepercayaan
7. **Footer** - Links lengkap, kontak, dan newsletter

## 🛠️ Teknologi

- **Next.js 15** - React framework dengan App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Lucide React** - Icon library

## 📁 Struktur Folder

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── sections/         # Page sections
│   └── ui/               # UI components
├── data/                 # Static data (products, categories, testimonials)
└── lib/                  # Utility functions
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Buka [http://localhost:3000](http://localhost:3000)** di browser

## 📦 Data Structure

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

## 🎨 Customization

- **Warna**: Edit kelas warna di Tailwind CSS
- **Font**: Modifikasi `src/app/layout.tsx`
- **Data**: Update file di `src/data/`
- **Components**: Tambah custom components di `src/components/`

## 🚀 Deployment

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

## 🔧 Integrasi Shopify

Proyek ini sudah disiapkan untuk integrasi dengan Shopify:

1. **Install Shopify Storefront API**
   ```bash
   npm install @shopify/storefront-api-react
   ```

2. **Update product fetching** di components
3. **Setup Shopify context** untuk cart management
4. **Connect checkout** dengan Shopify

## 📱 Responsiveness

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Performance Features

- **Lazy Loading**: Images menggunakan Next.js Image component
- **Optimized Bundle**: Tree shaking dan code splitting
- **SEO**: Meta tags dan structured data
- **Cache**: Image caching dengan CDN

## 🤝 Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js & Tailwind CSS
