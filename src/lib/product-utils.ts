import { Product } from '@/data/products';
import { FilterState } from '@/components/ui/FilterSidebar';

export interface SortConfig {
  field: keyof Product | 'rating';
  direction: 'asc' | 'desc';
}

export const sortOptions: Record<string, SortConfig> = {
  'featured': { field: 'featured', direction: 'desc' },
  'price-low': { field: 'price', direction: 'asc' },
  'price-high': { field: 'price', direction: 'desc' },
  'newest': { field: 'id', direction: 'desc' },
  'bestselling': { field: 'id', direction: 'desc' },
  'rating': { field: 'rating', direction: 'desc' },
};

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) {
        return false;
      }
    }

    // Price range filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }

    // Rating filter (simulated - in real app, product would have rating)
    if (filters.rating > 0) {
      // Simulated rating - in real app, this would come from product data
      const simulatedRating = 4.5; // Default rating for all products
      if (simulatedRating < filters.rating) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const config = sortOptions[sortBy];
  if (!config) return products;

  return [...products].sort((a, b) => {
    let aValue: any = a[config.field as keyof Product];
    let bValue: any = b[config.field as keyof Product];

    // Handle rating (simulated)
    if (config.field === 'rating') {
      aValue = 4.5; // Simulated rating
      bValue = 4.5; // Simulated rating
    }

    // Handle boolean values
    if (typeof aValue === 'boolean') {
      aValue = aValue ? 1 : 0;
      bValue = bValue ? 1 : 0;
    }

    // Handle string values
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (config.direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
}

export function paginateProducts(products: Product[], page: number, perPage: number): Product[] {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return products.slice(startIndex, endIndex);
}

export function getTotalPages(totalItems: number, perPage: number): number {
  return Math.ceil(totalItems / perPage);
}

export function generateMoreProducts(baseProducts: Product[], count: number): Product[] {
  const moreProducts: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const baseProduct = baseProducts[i % baseProducts.length];
    moreProducts.push({
      ...baseProduct,
      id: `${baseProduct.id}-more-${i}`,
      title: `${baseProduct.title} (Variant ${i + 1})`,
      price: baseProduct.price + (Math.random() * 500000 - 250000), // Random price variation
    });
  }
  
  return moreProducts;
}
