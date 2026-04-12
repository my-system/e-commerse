import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Generate random guest email and password
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const guestEmail = `guest_${timestamp}_${random}@luxe-shop.com`;
    const guestPassword = `Guest${timestamp}${random}`;
    const guestName = `Guest User ${random}`;

    // Hash the password
    const hashedPassword = await bcrypt.hash(guestPassword, 12);

    // Check if guest email already exists (very unlikely but possible)
    const existingUser = await prisma.user.findUnique({
      where: { email: guestEmail }
    });

    if (existingUser) {
      // If exists, try again with different random number
      const newRandom = Math.floor(Math.random() * 10000);
      const newGuestEmail = `guest_${timestamp}_${newRandom}@luxe-shop.com`;
      const newGuestPassword = `Guest${timestamp}${newRandom}`;
      const newHashedPassword = await bcrypt.hash(newGuestPassword, 12);

      const user = await prisma.user.create({
        data: {
          email: newGuestEmail,
          password: newHashedPassword,
          name: `Guest User ${newRandom}`,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status
        },
        credentials: {
          email: newGuestEmail,
          password: newGuestPassword
        }
      });
    }

    // Create new guest user with ADMIN role for full access
    const user = await prisma.user.create({
      data: {
        email: guestEmail,
        password: hashedPassword,
        name: guestName,
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      },
      credentials: {
        email: guestEmail,
        password: guestPassword
      }
    });

  } catch (error: any) {
    console.error('Error creating guest account:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create guest account'
      },
      { status: 500 }
    );
  }
}
