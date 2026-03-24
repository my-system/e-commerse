'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  fallback?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  placeholder = 'blur',
  fallback = '/placeholder.jpg'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer untuk lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Mulai load saat 10% terlihat
        rootMargin: '50px' // Mulai load 50px sebelum masuk viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized src untuk mobile
  const getOptimizedSrc = (originalSrc: string) => {
    // Jika sudah optimized (dari API placeholder), gunakan langsung
    if (originalSrc.includes('/api/placeholder/')) {
      return originalSrc;
    }

    // Untuk gambar eksternal, kita bisa tambahkan parameter optimasi
    // Ini tergantung pada layanan gambar yang digunakan
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  // Skeleton loading component
  const Skeleton = () => (
    <div 
      className={cn(
        'animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200',
        className
      )}
      style={{
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full opacity-50"></div>
      </div>
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div 
      className={cn(
        'bg-gray-100 flex items-center justify-center',
        className
      )}
      style={{
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586 1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs text-gray-500">Gambar tidak tersedia</p>
      </div>
    </div>
  );

  // Jika ada error
  if (hasError) {
    return <ErrorFallback />;
  }

  // Jika belum in-view dan bukan priority, tampilkan skeleton
  if (!isInView) {
    return <Skeleton />;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Actual image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          width: width || '100%',
          height: height || 'auto',
        }}
      />
      
      {/* Loading indicator untuk mobile */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
