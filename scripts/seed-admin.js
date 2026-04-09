import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('Creating admin user...');

    // Hash password
    const hashedPassword = await bcrypt.hash('12345678', 12);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'yusufdarwis097@gmail.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating role and password...');
      
      // Update existing user to admin
      await prisma.user.update({
        where: { email: 'yusufdarwis097@gmail.com' },
        data: {
          role: 'ADMIN',
          status: 'ACTIVE',
          password: hashedPassword
        }
      });
      
      console.log('Admin user updated successfully!');
    } else {
      // Create new admin user
      const admin = await prisma.user.create({
        data: {
          name: 'Yusuf Darwis Admin',
          email: 'yusufdarwis097@gmail.com',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });

      console.log('Admin user created successfully!');
      console.log('Email:', admin.email);
      console.log('Password: 12345678');
      console.log('Role:', admin.role);
    }

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
