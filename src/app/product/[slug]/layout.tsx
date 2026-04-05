import { Metadata } from 'next';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Fetch product data untuk metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.product) {
        const product = data.product;
        
        return {
          title: `${product.title} | Toko Online`,
          description: product.description 
            ? product.description.substring(0, 160) 
            : `Beli ${product.title} berkualitas dengan harga terbaik. Pengiriman cepat, garansi 30 hari.`,
          keywords: [
            product.title,
            product.category,
            'belanja online',
            'toko online',
            'harga murah',
            'kualitas terbaik',
            ...(product.specifications ? Object.values(product.specifications).map(String) : [])
          ].filter(Boolean).join(', '),
          openGraph: {
            title: product.title,
            description: product.description 
              ? product.description.substring(0, 160) 
              : `Beli ${product.title} berkualitas dengan harga terbaik.`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/product/${slug}`,
            siteName: 'Toko Online',
            images: product.images && product.images.length > 0 ? [
              {
                url: product.images[0],
                width: 1200,
                height: 630,
                alt: product.title,
              }
            ] : [],
            locale: 'id_ID',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description 
              ? product.description.substring(0, 160) 
              : `Beli ${product.title} berkualitas dengan harga terbaik.`,
            images: product.images && product.images.length > 0 ? [product.images[0]] : [],
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
          alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/product/${slug}`,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: 'Produk Tidak Ditemukan | Toko Online',
    description: 'Produk yang Anda cari tidak tersedia.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return children;
}
