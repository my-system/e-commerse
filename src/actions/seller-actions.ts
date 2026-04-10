'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/utils';
import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

// Zod schema for product validation
const productSchema = z.object({
  title: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name must not exceed 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  category: z.enum([
    'fashion', 'electronics', 'home', 'beauty', 'sports', 
    'books', 'toys', 'food', 'bags', 'shoes', 'jewelry', 
    'accessories', 'jaket', 'tas', 'sepatu'
  ]),
  price: z.number()
    .min(1, 'Price must be greater than 0')
    .max(999999999, 'Price is too high'),
  discount_price: z.number()
    .optional()
    .refine((val) => !val || val > 0, 'Discount price must be greater than 0'),
  stock: z.number()
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock quantity is too high'),
  brand: z.string()
    .optional()
    .refine((val) => !val || val.length <= 100, 'Brand name must not exceed 100 characters'),
  material: z.string()
    .optional()
    .refine((val) => !val || val.length <= 200, 'Material description must not exceed 200 characters'),
  care: z.string()
    .optional()
    .refine((val) => !val || val.length <= 500, 'Care instructions must not exceed 500 characters'),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one product image is required')
    .max(10, 'Maximum 10 images allowed'),
  sizes: z.array(z.object({
    name: z.string().min(1, 'Size name is required'),
    value: z.string().min(1, 'Size value is required'),
    inStock: z.boolean()
  })).optional(),
  colors: z.array(z.object({
    name: z.string().min(1, 'Color name is required'),
    value: z.string().min(1, 'Color value is required'),
    inStock: z.boolean()
  })).optional(),
  specs: z.record(z.string(), z.string())
    .optional()
});

export type ProductFormData = z.infer<typeof productSchema>;

export async function createProduct(formData: ProductFormData) {
  try {
    // Validate input data
    const validatedData = productSchema.parse(formData);
    
    // Generate unique slug
    const slug = await generateUniqueSlug(validatedData.title, prisma);
    
    // Create product with auto-generated slug and PENDING status
    const newProduct = await prisma.product.create({
      data: {
        title: validatedData.title,
        slug: slug,
        description: validatedData.description,
        category: validatedData.category,
        price: validatedData.price,
        inStock: validatedData.stock > 0,
        rating: 0,
        reviewCount: 0,
        images: JSON.stringify(validatedData.images),
        material: validatedData.material || null,
        care: validatedData.care || null,
        status: ProductStatus.PENDING, // Default to PENDING
        featured: false,
        sellerId: null, // Will be updated when auth is implemented
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Add sizes if provided
    if (validatedData.sizes && validatedData.sizes.length > 0) {
      await Promise.all(
        validatedData.sizes.map(size =>
          prisma.productSize.create({
            data: {
              name: size.name,
              value: size.value,
              inStock: size.inStock,
              productId: newProduct.id
            }
          })
        )
      );
    }

    // Add colors if provided
    if (validatedData.colors && validatedData.colors.length > 0) {
      await Promise.all(
        validatedData.colors.map(color =>
          prisma.productColor.create({
            data: {
              name: color.name,
              value: color.value,
              inStock: color.inStock,
              productId: newProduct.id
            }
          })
        )
      );
    }

    // Add specifications if provided
    if (validatedData.specs && Object.keys(validatedData.specs).length > 0) {
      await Promise.all(
        Object.entries(validatedData.specs).map(([key, value]) =>
          prisma.productSpec.create({
            data: {
              key,
              value,
              productId: newProduct.id
            }
          })
        )
      );
    }

    // Revalidate marketplace and seller pages
    revalidatePath('/marketplace');
    revalidatePath('/seller/products');

    return {
      success: true,
      product: newProduct,
      message: 'Product created successfully! Your product is now pending approval.'
    };

  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }

    if (error instanceof Error) {
      // Handle Prisma unique constraint error
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'A product with this slug already exists. Please try a different title.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to create product. Please try again.'
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred.'
    };
  }
}

export async function getCategories() {
  try {
    // This could be fetched from database in the future
    return [
      { id: 'fashion', name: 'Fashion' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'home', name: 'Home & Living' },
      { id: 'beauty', name: 'Beauty' },
      { id: 'sports', name: 'Sports' },
      { id: 'books', name: 'Books' },
      { id: 'toys', name: 'Toys' },
      { id: 'food', name: 'Food & Beverage' },
      { id: 'bags', name: 'Bags' },
      { id: 'shoes', name: 'Shoes' },
      { id: 'jewelry', name: 'Jewelry' },
      { id: 'accessories', name: 'Accessories' },
      { id: 'jaket', name: 'Jaket' },
      { id: 'tas', name: 'Tas' },
      { id: 'sepatu', name: 'Sepatu' }
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
