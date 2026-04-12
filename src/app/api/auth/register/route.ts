import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sanitizeString, sanitizeEmail, detectSqlInjection } from '@/lib/input-sanitizer';

const prisma = new PrismaClient();

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128)
});

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
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    const validatedData = registerSchema.parse({ name, email, password });

    // Sanitize inputs
    const sanitizedName = sanitizeString(validatedData.name);
    const sanitizedEmail = sanitizeEmail(validatedData.email);
    
    // Check for SQL injection
    if (detectSqlInjection(sanitizedName) || detectSqlInjection(sanitizedEmail) || detectSqlInjection(validatedData.password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid input' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
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
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
