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

  // Timeout untuk fallback jika gambar terlalu lama load
  useEffect(() => {
    if (!isInView || isLoaded || hasError) return;

    const timeout = setTimeout(() => {
      if (!isLoaded && !hasError) {
        setHasError(true);
      }
    }, 10000); // 10 detik timeout

    return () => clearTimeout(timeout);
  }, [isInView, isLoaded, hasError]);

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

  // Error fallback dengan SVG placeholder
  const ErrorFallback = () => {
    const svgWidth = width || 400;
    const svgHeight = height || 300;
    
    return (
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
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy=".3em" 
            fontFamily="Arial, sans-serif" 
            fontSize="14" 
            fill="#9ca3af"
          >
            {svgWidth}x{svgHeight}
          </text>
        </svg>
      </div>
    );
  };

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
