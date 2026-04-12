import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { sanitizeString, sanitizeNumber, detectSqlInjection } from '@/lib/input-sanitizer';

const prisma = new PrismaClient();

// Validation schema for order
const orderSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').max(20),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  city: z.string().min(2, 'City must be at least 2 characters').max(100),
  province: z.string().min(2, 'Province must be at least 2 characters').max(100),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters').max(20),
  shippingMethod: z.enum(['regular', 'express', 'free']),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive().max(99),
    size: z.string().optional(),
    color: z.string().optional()
  })).min(1, 'At least one item is required'),
  shippingCost: z.number().min(0).optional(),
  insuranceCost: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  total: z.number().min(0).optional()
});

// GET - Get all orders for logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Sanitize userId
    const sanitizedUserId = sanitizeString(session.user.id);
    if (detectSqlInjection(sanitizedUserId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const orders = await prisma.order.findMany({
      where: { userId: sanitizedUserId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, ...orderData } = body;

    // Validate order data
    const validatedData = orderSchema.parse(orderData);

    // Sanitize inputs
    const sanitizedData = {
      fullName: sanitizeString(validatedData.fullName),
      phone: sanitizeString(validatedData.phone),
      address: sanitizeString(validatedData.address),
      city: sanitizeString(validatedData.city),
      province: sanitizeString(validatedData.province),
      postalCode: sanitizeString(validatedData.postalCode),
      shippingMethod: validatedData.shippingMethod,
      paymentMethod: sanitizeString(validatedData.paymentMethod),
      items: validatedData.items,
      shippingCost: sanitizeNumber(validatedData.shippingCost),
      insuranceCost: sanitizeNumber(validatedData.insuranceCost),
      tax: sanitizeNumber(validatedData.tax),
      total: sanitizeNumber(validatedData.total)
    };

    // Use session userId instead of client-side userId
    const actualUserId = sanitizeString(session.user.id);
    const actualEmail = session.user.email || '';

    // Check for SQL injection
    if (detectSqlInjection(actualUserId) || detectSqlInjection(actualEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: actualUserId }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: actualUserId,
          name: sanitizedData.fullName,
          email: actualEmail,
          password: '',
          role: 'USER',
          status: 'ACTIVE'
        }
      });
    }

    // Calculate costs
    const shippingCosts: { [key: string]: number } = {
      regular: 20000,
      express: 40000,
      free: 0
    };
    const calculatedShippingCost = sanitizedData.shippingCost || shippingCosts[sanitizedData.shippingMethod] || 20000;
    const calculatedInsuranceCost = sanitizedData.insuranceCost || 0;
    const calculatedTax = sanitizedData.tax || 0;
    const calculatedTotal = sanitizedData.total || (sanitizedData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + calculatedShippingCost + calculatedInsuranceCost + calculatedTax);

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId: actualUserId,
          status: 'PENDING',
          total: calculatedTotal,
          shipping: calculatedShippingCost,
          tax: calculatedTax,
          address: `${sanitizedData.address}, ${sanitizedData.city}, ${sanitizedData.province} ${sanitizedData.postalCode}`,
        }
      });

      // Create order items
      const orderItems = await Promise.all(
        sanitizedData.items.map(async (item) => {
          const sanitizedItemId = sanitizeString(item.id);
          
          // Check if product exists in database
          const existingProduct = await tx.product.findUnique({
            where: { id: sanitizedItemId }
          });

          if (!existingProduct) {
            // Create placeholder product if it doesn't exist
            await tx.product.create({
              data: {
                id: sanitizedItemId,
                title: sanitizeString(item.title),
                price: sanitizeNumber(item.price),
                category: 'Uncategorized',
                images: '[]',
                inStock: true,
                status: 'APPROVED'
              }
            });
          }

          // Create order item
          return tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: sanitizedItemId,
              quantity: Math.min(99, Math.max(1, sanitizeNumber(item.quantity))),
              price: sanitizeNumber(item.price),
              size: item.size ? sanitizeString(item.size) : null,
              color: item.color ? sanitizeString(item.color) : null,
            }
          });
        })
      );

      return { order, orderItems };
    });

    // Clear user's cart after successful order
    await prisma.cartItem.deleteMany({
      where: { userId: actualUserId }
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        total: result.order.total,
        shipping: result.order.shipping,
        tax: result.order.tax,
        status: result.order.status
      }
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
