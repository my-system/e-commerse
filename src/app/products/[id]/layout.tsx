import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // In a real app, you would fetch the product data
  // For now, we'll generate dynamic metadata
  const productTitle = `Product ${id}`;
  const productDescription = `Detail produk ${productTitle} - Temukan kualitas terbaik dengan harga terjangkau di LUXE`;
  
  return {
    title: `${productTitle} - LUXE | Toko Fashion Premium Indonesia`,
    description: productDescription,
    keywords: `${productTitle}, fashion, premium, indonesia, belanja online`,
    openGraph: {
      title: `${productTitle} - LUXE | Toko Fashion Premium Indonesia`,
      description: productDescription,
      url: `/products/${id}`,
      images: [
        {
          url: `/api/placeholder/1200/630`,
          width: 1200,
          height: 630,
          alt: productTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productTitle} - LUXE | Toko Fashion Premium Indonesia`,
      description: productDescription,
      images: [`/api/placeholder/1200/630`],
    },
    alternates: {
      canonical: `/products/${id}`,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
