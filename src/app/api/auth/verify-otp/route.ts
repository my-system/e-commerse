import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name, password } = await request.json();

    if (!email || !otp || !name || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.$queryRaw`
      SELECT * FROM verification_tokens 
      WHERE identifier = ${email} AND token = ${otp} AND expires > NOW()
    ` as any[];

    if (!verificationToken || verificationToken.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if user already exists (double check)
    const existingUser = await prisma.$queryRaw`
      SELECT * FROM users WHERE email = ${email}
    ` as any[];

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await prisma.$queryRaw`
      INSERT INTO users (email, name, password, role, status, email_verified, created_at, updated_at)
      VALUES (${email}, ${name}, ${hashedPassword}, 'USER', 'ACTIVE', NOW(), NOW(), NOW())
      RETURNING id, email, name, role, status, created_at
    ` as any[];

    // Delete verification token
    await prisma.$queryRaw`
      DELETE FROM verification_tokens WHERE identifier = ${email}
    `;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: newUser[0]
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
