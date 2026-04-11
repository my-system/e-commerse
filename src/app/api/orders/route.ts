import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Get all orders for logged-in user
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/orders - Fetching orders for user');
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      console.log('No session or user ID found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    console.log('Fetching orders for user ID:', session.user.id);
    
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
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

    console.log('Orders fetched successfully:', orders.length);
    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders', details: error.code },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    // Get session to get the actual logged-in user ID
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { 
      userId, // Will be overridden by session userId
      fullName, 
      email, 
      phone, 
      address, 
      city, 
      province, 
      postalCode, 
      shippingMethod, 
      paymentMethod, 
      items,
      shippingCost,
      insuranceCost,
      tax,
      total
    } = body;

    // Use session userId instead of client-side userId
    const actualUserId = session.user.id;
    const actualEmail = session.user.email || email;

    // Validation
    if (!actualUserId || !fullName || !actualEmail || !phone || !address || !city || !province || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Data alamat tidak lengkap' },
        { status: 400 }
      );
    }

    if (!shippingMethod) {
      return NextResponse.json(
        { success: false, error: 'Metode pengiriman belum dipilih' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Metode pembayaran belum dipilih' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keranjang belanja kosong' },
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
          name: fullName,
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
    const calculatedShippingCost = shippingCost || shippingCosts[shippingMethod] || 20000;
    const calculatedInsuranceCost = insuranceCost || 0;
    const calculatedTax = tax || 0;
    const calculatedTotal = total || (items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) + calculatedShippingCost + calculatedInsuranceCost + calculatedTax);

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
          address: `${address}, ${city}, ${province} ${postalCode}`,
        }
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map(async (item: any) => {
          // Check if product exists in database
          const existingProduct = await tx.product.findUnique({
            where: { id: item.id }
          });

          if (!existingProduct) {
            // Create placeholder product if it doesn't exist
            await tx.product.create({
              data: {
                id: item.id,
                title: item.title,
                price: item.price,
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
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              size: item.size || null,
              color: item.color || null,
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
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
