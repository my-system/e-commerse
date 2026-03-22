import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // In a real app, you would fetch the category data
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const categoryDescription = `Jelajahi koleksi ${categoryName} premium di LUXE. Temukan produk berkualitas dengan desain modern dan harga terbaik.`;
  
  return {
    title: `${categoryName} - LUXE | Toko Fashion Premium Indonesia`,
    description: categoryDescription,
    keywords: `${categoryName}, produk ${categoryName}, belanja ${categoryName}, toko online, indonesia, premium`,
    openGraph: {
      title: `${categoryName} - LUXE | Toko Fashion Premium Indonesia`,
      description: categoryDescription,
      url: `/category/${slug}`,
      images: [
        {
          url: `/api/placeholder/1200/630`,
          width: 1200,
          height: 630,
          alt: `${categoryName} Collection - LUXE`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - LUXE | Toko Fashion Premium Indonesia`,
      description: categoryDescription,
      images: [`/api/placeholder/1200/630`],
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
