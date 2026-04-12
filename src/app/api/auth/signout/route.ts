import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint is called by AuthContext logout
    // The actual session clearing is handled by NextAuth
    // This is a placeholder for any additional cleanup needed
    
    return NextResponse.json({
      success: true,
      message: 'Signout successful'
    });
  } catch (error: any) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during signout' },
      { status: 500 }
    );
  }
}
