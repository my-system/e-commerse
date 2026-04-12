import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sanitizeString, sanitizeNumber, detectSqlInjection } from '@/lib/input-sanitizer';

const prisma = new PrismaClient();

// Validation schema for address
const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters').max(20),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  province: z.string().min(2, 'Province must be at least 2 characters').max(100),
  city: z.string().min(2, 'City must be at least 2 characters').max(100),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters').max(20),
  isDefault: z.boolean().optional().default(false)
});

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

    // Validate and sanitize userId
    const sanitizedUserId = sanitizeString(userId);
    if (detectSqlInjection(sanitizedUserId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const addresses = await prisma.userAddress.findMany({
      where: { userId: sanitizedUserId },
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
    const { userId, ...addressData } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate and sanitize userId
    const sanitizedUserId = sanitizeString(userId);
    if (detectSqlInjection(sanitizedUserId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Validate address data
    const validatedData = addressSchema.parse(addressData);

    // Sanitize address data
    const sanitizedData = {
      fullName: sanitizeString(validatedData.fullName),
      phoneNumber: sanitizeString(validatedData.phoneNumber),
      address: sanitizeString(validatedData.address),
      province: sanitizeString(validatedData.province),
      city: sanitizeString(validatedData.city),
      postalCode: sanitizeString(validatedData.postalCode),
      isDefault: validatedData.isDefault
    };

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: sanitizedUserId }
    });

    if (!existingUser) {
      // Create user if doesn't exist (migration from localStorage)
      await prisma.user.create({
        data: {
          id: sanitizedUserId,
          email: `${sanitizedUserId}@temp.local`,
          name: sanitizedData.fullName,
        }
      });
    }

    // If setting as default, remove default from all other addresses
    if (sanitizedData.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: sanitizedUserId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId: sanitizedUserId,
        ...sanitizedData
      }
    });

    return NextResponse.json({
      success: true,
      address: newAddress
    });
  } catch (error: any) {
    console.error('Error creating address:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create address' },
      { status: 500 }
    );
  }
}
