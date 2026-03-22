"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/data/categories';

interface CategoryItemProps {
  category: Category;
  isSubcategory?: boolean;
  onNavigate?: () => void;
}

export default function CategoryItem({
  category,
  isSubcategory = false,
  onNavigate,
}: CategoryItemProps) {
  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <Link
      href={`/category/${category.slug}`}
      onClick={handleClick}
      className={`
        block transition-all duration-200 rounded-lg
        ${isSubcategory 
          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-3 px-4 text-sm leading-relaxed' 
          : 'text-gray-900 hover:text-blue-600 hover:bg-blue-50 py-4 px-5 font-semibold text-base leading-tight'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {category.icon && !isSubcategory && (
          <span className="text-2xl flex-shrink-0">{category.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className={isSubcategory ? 'text-sm font-medium' : 'font-bold text-base'}>
            {category.name}
          </div>
          {category.description && !isSubcategory && (
            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
              {category.description}
            </div>
          )}
        </div>
        {!isSubcategory && (
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
    </Link>
  );
}
