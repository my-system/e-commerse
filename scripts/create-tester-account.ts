import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    }
  }
});

async function createTesterAccount() {
  try {
    const testerEmail = 'akuntester@gmail.com';
    const testerPassword = '12345678';
    
    const existingTester = await prisma.user.findUnique({
      where: { email: testerEmail }
    });

    if (!existingTester) {
      const hashedPassword = await bcrypt.hash(testerPassword, 12);
      await prisma.user.create({
        data: {
          email: testerEmail,
          name: 'Tester Account',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: new Date()
        }
      });
      console.log(`✅ Tester account created successfully!`);
      console.log(`Email: ${testerEmail}`);
      console.log(`Password: ${testerPassword}`);
      console.log(`Role: ADMIN`);
    } else {
      console.log(`✅ Tester account already exists: ${testerEmail}`);
    }
  } catch (error) {
    console.error('❌ Error creating tester account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTesterAccount();
