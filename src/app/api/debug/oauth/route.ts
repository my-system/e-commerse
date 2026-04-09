import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-simple';

export async function GET() {
  try {
    // Check NextAuth configuration
    const debug = {
      nextauth_version: '4.24.13',
      nextjs_version: '16.2.1',
      auth_options: {
        providers: authOptions.providers?.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type
        })),
        session: authOptions.session,
        callbacks: {
          jwt: !!authOptions.callbacks?.jwt,
          session: !!authOptions.callbacks?.session,
          signIn: !!authOptions.callbacks?.signIn
        },
        pages: authOptions.pages,
        secret: authOptions.secret ? 'SET' : 'NOT_SET'
      },
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
