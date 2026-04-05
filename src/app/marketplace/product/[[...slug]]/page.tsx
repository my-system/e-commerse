"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get the full slug from the URL
    const pathname = window.location.pathname;
    const slug = pathname.replace('/marketplace/product/', '');
    
    // Redirect to the correct format with slash
    router.replace(`/marketplace/product/${slug}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
