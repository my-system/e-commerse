import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semua Produk - LUXE | Toko Fashion Premium Indonesia',
  description: 'Jelajahi koleksi lengkap produk fashion premium dari LUXE. Temukan pakaian, sepatu, aksesoris modern dengan kualitas terbaik dan harga terjangkau.',
  keywords: 'produk fashion, pakaian, sepatu, aksesoris, toko online, indonesia, premium, modern, koleksi lengkap',
  openGraph: {
    title: 'Semua Produk - LUXE | Toko Fashion Premium Indonesia',
    description: 'Jelajahi koleksi lengkap produk fashion premium dari LUXE. Temukan pakaian, sepatu, aksesoris modern dengan kualitas terbaik.',
    url: '/shop',
    images: [
      {
        url: '/og-shop.jpg',
        width: 1200,
        height: 630,
        alt: 'Semua Produk LUXE - Toko Fashion Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Semua Produk - LUXE | Toko Fashion Premium Indonesia',
    description: 'Jelajahi koleksi lengkap produk fashion premium dari LUXE. Temukan pakaian, sepatu, aksesoris modern dengan kualitas terbaik.',
    images: ['/og-shop.jpg'],
  },
  alternates: {
    canonical: '/shop',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
