'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

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
  disableIntersectionObserver?: boolean;
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
  fallback = '/placeholder.jpg',
  disableIntersectionObserver = false
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src || fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src || fallback);
  }, [src, fallback]);

  const handleError = () => {
    setImageSrc(fallback);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority || disableIntersectionObserver}
        loading="eager"
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
        onError={handleError}
        onLoad={handleLoad}
        placeholder={placeholder}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}
