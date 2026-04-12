import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all addresses for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' } // Default addresses first
    });

    return NextResponse.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fullName, phoneNumber, address, province, city, postalCode, isDefault } = body;

    if (!userId || !fullName || !phoneNumber || !address || !province || !city || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      // Create user if doesn't exist (migration from localStorage)
      await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@temp.local`,
          name: fullName,
        }
      });
    }

    // If setting as default, remove default from all other addresses
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        fullName,
        phoneNumber,
        address,
        province,
        city,
        postalCode,
        isDefault
      }
    });

    return NextResponse.json({
      success: true,
      address: newAddress
    });
  } catch (error: any) {
    console.error('Error creating address:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create address' },
      { status: 500 }
    );
  }
}
