"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'typewriter' | 'fade-in' | 'slide-in' | 'bounce' | 'glow';
  speed?: number;
}

export default function AnimatedText({ 
  children, 
  className = "", 
  delay = 0,
  duration = 1000,
  animation = 'fade-in',
  speed = 50
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const text = typeof children === 'string' ? children : '';

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

  useEffect(() => {
    if (isVisible && animation === 'typewriter' && typeof children === 'string') {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);
        return () => clearTimeout(timeout);
      }
    }
  }, [isVisible, currentIndex, text, speed, animation]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all';
    
    if (!isVisible) {
      switch (animation) {
        case 'fade-in':
          return `${baseClasses} opacity-0`;
        case 'slide-in':
          return `${baseClasses} opacity-0 transform -translate-x-4`;
        case 'bounce':
          return `${baseClasses} opacity-0 transform scale-0`;
        case 'glow':
          return `${baseClasses} opacity-0`;
        default:
          return `${baseClasses} opacity-0`;
      }
    } else {
      switch (animation) {
        case 'fade-in':
          return `${baseClasses} opacity-100 duration-[${duration}ms]`;
        case 'slide-in':
          return `${baseClasses} opacity-100 transform translate-x-0 duration-[${duration}ms]`;
        case 'bounce':
          return `${baseClasses} opacity-100 transform scale-100 duration-[${duration}ms] animate-bounce`;
        case 'glow':
          return `${baseClasses} opacity-100 duration-[${duration}ms] animate-pulse`;
        default:
          return `${baseClasses} opacity-100 duration-[${duration}ms]`;
      }
    }
  };

  const renderContent = () => {
    if (animation === 'typewriter' && typeof children === 'string') {
      return (
        <span>
          {displayText}
          {currentIndex < text.length && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      );
    }
    
    return children;
  };

  return (
    <div 
      ref={ref} 
      className={`${className} ${getAnimationClasses()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {renderContent()}
    </div>
  );
}
