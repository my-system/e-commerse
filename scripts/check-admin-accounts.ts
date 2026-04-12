import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
});

async function checkAdminAccounts() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    console.log(`\n📊 Total Akun Admin di Database: ${adminUsers.length}\n`);
    console.log('====================================');
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('------------------------------------');
    });

  } catch (error) {
    console.error('❌ Error checking admin accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminAccounts();
