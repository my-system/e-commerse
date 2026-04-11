import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update address
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fullName, phoneNumber, address, province, city, postalCode, isDefault } = body;

    // If setting as default, remove default from all other addresses for this user
    if (isDefault) {
      const existingAddress = await prisma.userAddress.findUnique({
        where: { id }
      });

      if (existingAddress) {
        await prisma.userAddress.updateMany({
          where: { userId: existingAddress.userId },
          data: { isDefault: false }
        });
      }
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(address && { address }),
        ...(province && { province }),
        ...(city && { city }),
        ...(postalCode && { postalCode }),
        ...(isDefault !== undefined && { isDefault })
      }
    });

    return NextResponse.json({
      success: true,
      address: updatedAddress
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.userAddress.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
