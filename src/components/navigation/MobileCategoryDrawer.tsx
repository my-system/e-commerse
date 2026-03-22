"use client";

import { useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Category } from '@/data/categories';
import CategoryItem from './CategoryItem';

interface MobileCategoryDrawerProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCategoryDrawer({ categories, isOpen, onClose }: MobileCategoryDrawerProps) {
  // Close drawer on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Create subcategory objects for navigation
  const createSubcategoryObjects = (category: Category): Category[] => {
    if (!category.subcategories) return [];
    
    return category.subcategories.map((subcat, index) => ({
      id: `${category.id}-${index}`,
      name: subcat,
      slug: category.slug,
      image: category.image,
      description: category.description,
      icon: category.icon,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Kategori</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Main Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Kategori Utama
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onNavigate={onClose}
                />
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div className="space-y-6">
            {categories.map((category) => {
              const subcategories = createSubcategoryObjects(category);
              if (subcategories.length === 0) return null;

              return (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    {category.icon && <span>{category.icon}</span>}
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {subcategories.map((subcategory) => (
                      <CategoryItem
                        key={subcategory.id}
                        category={subcategory}
                        isSubcategory={true}
                        onNavigate={onClose}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-2">
            <a
              href="/shop"
              onClick={onClose}
              className="flex items-center justify-between w-full p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <span>Semua Produk</span>
              <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="/category"
              onClick={onClose}
              className="flex items-center justify-between w-full p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <span>Lihat Semua Kategori</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
