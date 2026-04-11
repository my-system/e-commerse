import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('PUT /api/orders/[id] - Body:', body);
    console.log('Order ID:', id);

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    console.log('Order status updated:', order.id, order.status);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status
      }
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

// GET - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('GET /api/orders/[id] - Order ID:', id);
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    if (!order) {
      console.log('Order not found:', id);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Order fetched successfully:', order.id);
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order', details: error.code },
      { status: 500 }
    );
  }
}
