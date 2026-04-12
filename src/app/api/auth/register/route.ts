import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create tester account on server start
async function ensureTesterAccount() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: 'akuntester@gmail.com' }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('12345678', 12);
      await prisma.user.create({
        data: {
          email: 'akuntester@gmail.com',
          name: 'Tester Account',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: new Date()
        }
      });
      console.log('Tester account created: akuntester@gmail.com / 12345678');
    }
  } catch (error) {
    console.error('Error creating tester account:', error);
  }
}

// Ensure tester account exists
ensureTesterAccount();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: new Date()
      }
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Registration successful'
    });

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
