import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Get all orders for logged-in user
export async function GET(request: NextRequest) {
  try {
    // Session validation
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }
    
    // Query database with proper includes
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
    
    // Transform data to match frontend format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      invoiceNumber: `INV-${order.id.slice(0, 8).toUpperCase()}`,
      status: order.status,
      total: order.total,
      shipping: order.shipping,
      tax: order.tax,
      address: order.address,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        product: item.product ? {
          id: item.product.id,
          title: item.product.title,
          images: item.product.images,
          price: item.product.price,
          category: item.product.category
        } : null
      }))
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
