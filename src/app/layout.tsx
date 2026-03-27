import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUXE - Toko Fashion Premium Indonesia",
  description: "Toko fashion online dengan koleksi premium berkualitas. Temukan pakaian, sepatu, dan aksesoris modern dengan desain timeless. Pengiriman cepat, harga terjangkau.",
  keywords: "fashion, pakaian, sepatu, aksesoris, toko online, indonesia, premium, modern",
  authors: [{ name: "LUXE Team" }],
  creator: "LUXE",
  publisher: "LUXE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://luxe.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LUXE',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://luxe.com',
    title: 'LUXE - Toko Fashion Premium Indonesia',
    description: 'Toko fashion online dengan koleksi premium berkualitas. Temukan pakaian, sepatu, dan aksesoris modern dengan desain timeless.',
    siteName: 'LUXE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LUXE - Toko Fashion Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXE - Toko Fashion Premium Indonesia',
    description: 'Toko fashion online dengan koleksi premium berkualitas. Temukan pakaian, sepatu, dan aksesoris modern dengan desain timeless.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <UserPreferencesProvider>
                  {children}
                </UserPreferencesProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
