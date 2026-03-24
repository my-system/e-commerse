"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-[59] transition-opacity duration-300"
        style={{ top: '64px' }}
      />
      
      {/* Mega Menu */}
      <div
        ref={menuRef}
        className="fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-[60] transform transition-all duration-300 ease-out"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)'
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
            {categories.map((category) => {
              const subcategories = createSubcategoryObjects(category);
              
              return (
                <div key={category.id} className="space-y-5">
                  {/* Category Title with Icon */}
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-bold text-gray-900 text-xl leading-tight">
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* Subcategories */}
                  {subcategories.length > 0 && (
                    <div className="space-y-3">
                      {subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/category/${subcategory.slug}`}
                          onClick={onClose}
                          className="block text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-200 ease-in-out text-base leading-relaxed cursor-pointer group font-medium"
                        >
                          <span className="inline-flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            {subcategory.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Featured Section */}
            <div className="space-y-5 lg:col-span-1 xl:col-span-2">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <span className="text-2xl">⭐</span>
                <h3 className="font-bold text-gray-900 text-xl leading-tight">
                  Featured
                </h3>
              </div>
              <div className="space-y-3">
                <Link
                  href="/shop?sort=featured"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-200 ease-in-out text-base leading-relaxed cursor-pointer group font-medium"
                >
                  <span className="inline-flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    Produk Populer
                  </span>
                </Link>
                <Link
                  href="/shop?sort=newest"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-200 ease-in-out text-base leading-relaxed cursor-pointer group font-medium"
                >
                  <span className="inline-flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    Produk Terbaru
                  </span>
                </Link>
                <Link
                  href="/shop?sort=rating"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-200 ease-in-out text-base leading-relaxed cursor-pointer group font-medium"
                >
                  <span className="inline-flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    Rating Tertinggi
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
