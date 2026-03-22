"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/data/categories';
import CategoryItem from './CategoryItem';
import CategoryColumn from './CategoryColumn';

interface MegaMenuProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 150); // 150ms delay
    timeoutRef.current = timeoutId;
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, onClose]);

  // Create subcategory objects for navigation
  const createSubcategoryObjects = (category: Category): Category[] => {
    if (!category.subcategories) return [];
    
    return category.subcategories.map((subcat, index) => ({
      id: `${category.id}-${index}`,
      name: subcat,
      slug: category.slug, // Use parent category slug for now
      image: category.image,
      description: category.description,
      icon: category.icon,
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed top-16 left-0 right-0 bg-white shadow-xl border border-gray-100 z-[60] transform transition-all duration-300 ease-out opacity-100 translate-y-0 rounded-b-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {categories.map((category) => {
            const subcategories = createSubcategoryObjects(category);
            
            return (
              <div key={category.id} className="space-y-4">
                {/* Category Title */}
                <h3 className="font-semibold text-gray-900 text-lg leading-tight transition-colors duration-200">
                  {category.name}
                </h3>
                
                {/* Subcategories */}
                {subcategories.length > 0 && (
                  <div className="space-y-3">
                    {subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/category/${subcategory.slug}`}
                        onClick={onClose}
                        className="block text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-200 ease-in-out text-sm leading-relaxed cursor-pointer group"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="w-0 group-hover:w-4 h-0.5 bg-blue-600 transition-all duration-200 ease-in-out"></span>
                          {subcategory.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
