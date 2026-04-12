import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
});

async function deleteGuestAccounts() {
  try {
    // Find all guest accounts (email starts with "guest_")
    const guestAccounts = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'guest_'
        }
      }
    });

    console.log(`Found ${guestAccounts.length} guest accounts to delete\n`);

    if (guestAccounts.length === 0) {
      console.log('No guest accounts found.');
      return;
    }

    // Delete all guest accounts
    const deleteResult = await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'guest_'
        }
      }
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} guest accounts\n`);

    // Verify remaining admin accounts
    const remainingAdmins = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    });

    console.log('📊 Remaining Admin Accounts:');
    console.log('====================================');
    remainingAdmins.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log('------------------------------------');
    });

  } catch (error) {
    console.error('❌ Error deleting guest accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteGuestAccounts();
