"use client";

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'slide-up';
}

export default function ScrollAnimation({ 
  children, 
  className = "", 
  delay = 0,
  duration = 800,
  threshold = 0.1,
  animation = 'fade-up'
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';
    
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return `${baseClasses} opacity-0 translate-y-8 ${delayClass}`;
        case 'fade-down':
          return `${baseClasses} opacity-0 -translate-y-8 ${delayClass}`;
        case 'fade-left':
          return `${baseClasses} opacity-0 translate-x-8 ${delayClass}`;
        case 'fade-right':
          return `${baseClasses} opacity-0 -translate-x-8 ${delayClass}`;
        case 'scale-up':
          return `${baseClasses} opacity-0 scale-95 ${delayClass}`;
        case 'slide-up':
          return `${baseClasses} opacity-0 translate-y-12 ${delayClass}`;
        default:
          return `${baseClasses} opacity-0 translate-y-8 ${delayClass}`;
      }
    } else {
      return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100 duration-[${duration}ms]`;
    }
  };

  return (
    <div ref={ref} className={`${className} ${getAnimationClasses()}`}>
      {children}
    </div>
  );
}
