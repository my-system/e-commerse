import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
});

async function checkUserRole() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'yusufdarwis097@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log('❌ User account not found in database');
      return;
    }

    console.log('✅ User Account Info:');
    console.log('====================================');
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.status}`);
    console.log(`Created: ${user.createdAt}`);
    console.log('====================================');

    if (user.role !== 'ADMIN') {
      console.log('⚠️  WARNING: Role is not ADMIN. Updating to ADMIN...');
      await prisma.user.update({
        where: { email: 'yusufdarwis097@gmail.com' },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Role updated to ADMIN');
    }

    if (user.status !== 'ACTIVE') {
      console.log('⚠️  WARNING: Status is not ACTIVE. Updating to ACTIVE...');
      await prisma.user.update({
        where: { email: 'yusufdarwis097@gmail.com' },
        data: { status: 'ACTIVE', emailVerified: new Date() }
      });
      console.log('✅ Status updated to ACTIVE');
    }

  } catch (error) {
    console.error('❌ Error checking user account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();
