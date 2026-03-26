import { Product } from '@/data/products';

// New Filter Interface
export interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  rating: number | null; // null = no filter, 1-5 = range values
}

// Price preset options
export const pricePresets = [
  {
    label: '< 50rb',
    priceMin: 0,
    priceMax: 49999,
  },
  {
    label: '50rb – 1jt',
    priceMin: 50000,
    priceMax: 1000000,
  },
  {
    label: '1jt – 2jt',
    priceMin: 1000000,
    priceMax: 2000000,
  },
  {
    label: '> 2jt',
    priceMin: 2000000,
    priceMax: 999999999, // Large number for "infinity"
  },
];

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
  console.log('Filtering products with:', filters);
  
  return products.filter((product) => {
    // Category filter - single category
    if (filters.category) {
      if (product.category !== filters.category) {
        console.log(`Product ${product.title} category mismatch: ${product.category} !== ${filters.category}`);
        return false;
      }
    }

    // Price range filter
    if (product.price < filters.priceMin || product.price > filters.priceMax) {
      console.log(`Product ${product.title} price out of range: ${product.price} not in ${filters.priceMin}-${filters.priceMax}`);
      return false;
    }

    // Rating filter - range-based filtering
    if (filters.rating !== null && filters.rating > 0) {
      const productRating = product.rating || 0;
      
      // Range-based rating logic
      switch (filters.rating) {
        case 5: // ⭐⭐⭐⭐⭐ (5★ exactly)
          if (productRating !== 5) {
            console.log(`Product ${product.title} rating not 5: ${productRating} !== 5`);
            return false;
          }
          break;
        case 4: // ⭐⭐⭐⭐☆ (4.0 – 4.9)
          if (productRating < 4 || productRating >= 5) {
            console.log(`Product ${product.title} rating not in 4.0-4.9: ${productRating}`);
            return false;
          }
          break;
        case 3: // ⭐⭐⭐☆☆ (3.0 – 3.9)
          if (productRating < 3 || productRating >= 4) {
            console.log(`Product ${product.title} rating not in 3.0-3.9: ${productRating}`);
            return false;
          }
          break;
        case 2: // ⭐⭐☆☆☆ (2.0 – 2.9)
          if (productRating < 2 || productRating >= 3) {
            console.log(`Product ${product.title} rating not in 2.0-2.9: ${productRating}`);
            return false;
          }
          break;
        case 1: // ⭐☆☆☆☆ (1.0 – 1.9)
          if (productRating < 1 || productRating >= 2) {
            console.log(`Product ${product.title} rating not in 1.0-1.9: ${productRating}`);
            return false;
          }
          break;
        default:
          return true;
      }
    }

    console.log(`Product ${product.title} passed all filters`);
    return true;
  });
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const config = sortOptions[sortBy];
  if (!config) return products;

  // Create stable array with original indices
  const productsWithIndex = products.map((product, index) => ({
    ...product,
    originalIndex: index
  }));

  return productsWithIndex.sort((a, b) => {
    let aValue: any = a[config.field as keyof Product];
    let bValue: any = b[config.field as keyof Product];

    // Handle rating (use actual rating from product data)
    if (config.field === 'rating') {
      aValue = aValue || 0; // Default to 0 if no rating
      bValue = bValue || 0; // Default to 0 if no rating
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

    // Primary comparison
    let comparison = 0;
    if (config.direction === 'asc') {
      comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      comparison = aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }

    // If values are equal, use original index to maintain absolute stability
    if (comparison === 0) {
      return a.originalIndex - b.originalIndex;
    }

    return comparison;
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
    // Use consistent price variation based on index instead of random
    const priceVariation = (i % 10 - 5) * 10000; // Consistent variation from -50k to +50k
    
    moreProducts.push({
      ...baseProduct,
      id: `${baseProduct.id}-more-${i}`,
      title: `${baseProduct.title} (Variant ${i + 1})`,
      price: baseProduct.price + priceVariation,
    });
  }
  
  return moreProducts;
}
