import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
});

async function checkTesterAccount() {
  try {
    const tester = await prisma.user.findUnique({
      where: { email: 'akuntester@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!tester) {
      console.log('❌ Tester account not found in database');
      return;
    }

    console.log('✅ Tester Account Info:');
    console.log('====================================');
    console.log(`Email: ${tester.email}`);
    console.log(`Name: ${tester.name}`);
    console.log(`Role: ${tester.role}`);
    console.log(`Status: ${tester.status}`);
    console.log(`Created: ${tester.createdAt}`);
    console.log('====================================');

    if (tester.role !== 'ADMIN') {
      console.log('⚠️  WARNING: Role is not ADMIN. Updating to ADMIN...');
      await prisma.user.update({
        where: { email: 'akuntester@gmail.com' },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Role updated to ADMIN');
    }

    if (tester.status !== 'ACTIVE') {
      console.log('⚠️  WARNING: Status is not ACTIVE. Updating to ACTIVE...');
      await prisma.user.update({
        where: { email: 'akuntester@gmail.com' },
        data: { status: 'ACTIVE', emailVerified: new Date() }
      });
      console.log('✅ Status updated to ACTIVE');
    }

  } catch (error) {
    console.error('❌ Error checking tester account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTesterAccount();
