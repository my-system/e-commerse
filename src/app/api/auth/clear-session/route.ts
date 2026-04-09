import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear NextAuth session cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('__Secure-next-auth.session-token');
    
    return response;
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}
