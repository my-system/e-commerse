import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateOrderUserIds() {
  try {
    console.log('Starting order userId update...');
    
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
    const targetUserId = 'cmnrpfiep0000pbtichjjq326';
    
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
    console.log('Update completed successfully!');
    
  } catch (error) {
    console.error('Error updating order userIds:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateOrderUserIds()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
