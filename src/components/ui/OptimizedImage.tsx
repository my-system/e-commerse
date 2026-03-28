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
