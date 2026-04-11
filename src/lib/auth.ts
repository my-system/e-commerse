import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id-here',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret-here',
    }),
    
    // Credentials Provider for Email & Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check if user has password (credentials provider)
          if (!user.password) {
            throw new Error('This account uses OAuth. Please sign in with Google');
          }

          // Check if user is active
          if (user.status !== 'ACTIVE') {
            throw new Error('Account is not active. Please verify your email');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            image: user.image
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          // Handle database connection errors gracefully
          if (error.code === 'P1001' || error.code === 'P1000') {
            throw new Error('Database connection failed. Please try again later.');
          }
          throw error;
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  
  callbacks: {
    // JWT callback
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    
    // Session callback
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      return session;
    },
    
    // Sign in callback
    async signIn({ user, account }) {
      // Let NextAuth PrismaAdapter handle user creation and account linkage
      return true;
    },
    
    // Redirect callback
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  
  // Security settings
  secret: process.env.NEXTAUTH_SECRET,
  
  // Rate limiting
  events: {
    signIn: async (message) => {
      console.log('User signed in:', message.user?.email);
    },
    signOut: async (message) => {
      console.log('User signed out:', message.session?.user?.email);
    },
  },
  
  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
};

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      status: string;
    };
  }

  interface User {
    role: string;
    status: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    status: string;
  }
}
