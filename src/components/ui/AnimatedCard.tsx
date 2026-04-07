"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'slide-up' | 'scale-up' | 'rotate-in' | 'flip-in' | 'float';
  hover?: boolean;
}

export default function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  animation = 'slide-up',
  hover = true
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
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
  }, []);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';
    
    if (!isVisible) {
      switch (animation) {
        case 'slide-up':
          return `${baseClasses} opacity-0 translate-y-12 ${delayClass}`;
        case 'scale-up':
          return `${baseClasses} opacity-0 scale-95 ${delayClass}`;
        case 'rotate-in':
          return `${baseClasses} opacity-0 rotate-6 ${delayClass}`;
        case 'flip-in':
          return `${baseClasses} opacity-0 rotateY-90 ${delayClass}`;
        case 'float':
          return `${baseClasses} opacity-0 translate-y-8 ${delayClass}`;
        default:
          return `${baseClasses} opacity-0 translate-y-12 ${delayClass}`;
      }
    } else {
      return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0 duration-700`;
    }
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    
    return isHovered 
      ? 'transform -translate-y-2 shadow-2xl scale-105 duration-300' 
      : 'transform translate-y-0 shadow-lg scale-100 duration-300';
  };

  return (
    <div 
      ref={ref} 
      className={`${className} ${getAnimationClasses()} ${getHoverClasses()} relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Shimmer effect on hover */}
      {hover && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
    </div>
  );
}
