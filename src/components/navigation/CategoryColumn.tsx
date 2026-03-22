"use client";

import { Category } from '@/data/categories';
import CategoryItem from './CategoryItem';

interface CategoryColumnProps {
  title?: string;
  categories: Category[];
  onNavigate?: () => void;
}

export default function CategoryColumn({
  title,
  categories,
  onNavigate,
}: CategoryColumnProps) {
  return (
    <div className="flex flex-col">
      {title && (
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 px-4">
          {title}
        </h3>
      )}
      
      <div className="space-y-1">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSubcategory={true}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
