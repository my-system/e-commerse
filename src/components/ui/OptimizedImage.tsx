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
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer untuk lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    // Untuk mobile, langsung set in view untuk menghindari masalah
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe container instead of img
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fallback timeout jika observer gagal
    const fallbackTimeout = setTimeout(() => {
      if (!isInView) {
        console.log('IntersectionObserver fallback triggered');
        setIsInView(true);
      }
    }, 2000); // Reduced timeout for mobile

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, [priority, isInView]);

  // Loading timeout fallback
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('Loading timeout triggered, using fallback');
        setHasError(true);
      }, 3000); // Reduced timeout for mobile
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isInView, isLoaded, hasError]);

  // Optimized src dengan fallback
  const getOptimizedSrc = (originalSrc: string) => {
    console.log('Loading image:', originalSrc);
    
    // Validasi src
    if (!originalSrc || typeof originalSrc !== 'string') {
      console.log('Invalid src, using fallback:', fallback);
      return fallback;
    }

    // Jika sudah fallback, gunakan langsung
    if (originalSrc === fallback) {
      return originalSrc;
    }

    // API placeholder
    if (originalSrc.includes('/api/placeholder/')) {
      return originalSrc;
    }

    // Unsplash images - tambahkan parameter untuk reliability
    if (originalSrc.includes('unsplash.com')) {
      return originalSrc;
    }

    // Local images
    if (originalSrc.startsWith('/')) {
      return originalSrc;
    }

    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(currentSrc);

  // Handle image load success
  const handleLoad = () => {
    console.log('Image loaded successfully:', optimizedSrc);
    setIsLoaded(true);
    setHasError(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  // Handle image load error dengan retry
  const handleError = () => {
    console.log('Image failed to load:', optimizedSrc);
    
    // Jika ini adalah fallback yang gagal, jangan retry lagi
    if (currentSrc === fallback || retryCount >= 2) {
      console.log('Using fallback image');
      setCurrentSrc(fallback);
      setHasError(true);
      return;
    }

    // Retry dengan fallback
    if (retryCount < 2) {
      console.log(`Retrying with fallback (${retryCount + 1}/2)`);
      setRetryCount(prev => prev + 1);
      setCurrentSrc(fallback);
    }
  };

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
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
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
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          width: width || '100%',
          height: height || '100%',
          minHeight: '200px', // Ensure minimum height for mobile
        }}
      />
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
