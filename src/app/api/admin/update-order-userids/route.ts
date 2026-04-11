import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// POST - Update all order userIds to current logged-in user
export async function POST(request: NextRequest) {
  try {
    console.log('=== POST /api/admin/update-order-userids START ===');
    
    // Session validation - only admin should be able to do this
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      console.log('No session or user ID found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    console.log('Current user ID:', session.user.id);
    console.log('Current user email:', session.user.email);

    // Get all orders
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        status: true,
        total: true,
        createdAt: true
      }
    });

    console.log(`Found ${allOrders.length} orders in database`);
    console.log('Current user IDs:', allOrders.map(o => o.userId));

    // Target user ID (the current logged-in user)
    const targetUserId = session.user.id;
    
    // Update all orders to belong to the target user
    const updateResult = await prisma.order.updateMany({
      where: {
        userId: {
          not: targetUserId
        }
      },
      data: {
        userId: targetUserId
      }
    });

    console.log(`Updated ${updateResult.count} orders to userId: ${targetUserId}`);
    
    // Verify the update
    const updatedOrders = await prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        status: true,
        total: true,
        createdAt: true
      }
    });

    console.log('After update - All orders now have userId:', updatedOrders.map(o => o.userId));
    console.log('=== POST /api/admin/update-order-userids END ===');

    return NextResponse.json({
      success: true,
      message: `Updated ${updateResult.count} orders to belong to current user`,
      updatedCount: updateResult.count,
      targetUserId: targetUserId
    });
  } catch (error: any) {
    console.error('=== ERROR in POST /api/admin/update-order-userids ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order userIds', details: error.code },
      { status: 500 }
    );
  }
}
