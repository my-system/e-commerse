import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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
          // Find user by email - using raw query for now
          const user = await prisma.$queryRaw`
            SELECT * FROM users WHERE email = ${credentials.email}
          ` as any[];

          if (!user || user.length === 0) {
            throw new Error('No user found with this email');
          }

          const userData = user[0];

          // Check if user has password (credentials provider)
          if (!userData.password) {
            throw new Error('This account uses OAuth. Please sign in with Google');
          }

          // Check if user is active
          if (userData.status !== 'ACTIVE') {
            throw new Error('Account is not active. Please verify your email');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userData.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user object
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            status: userData.status,
            image: userData.image
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
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
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
    
    // Sign in callback
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // For Google OAuth, check if user exists or create new one
          const existingUser = await prisma.$queryRaw`
            SELECT * FROM users WHERE email = ${user.email}
          ` as any[];

          if (!existingUser || existingUser.length === 0) {
            // Create new user with Google OAuth
            await prisma.$queryRaw`
              INSERT INTO users (email, name, image, status, role, created_at, updated_at)
              VALUES (${user.email}, ${user.name}, ${user.image}, 'ACTIVE', 'USER', NOW(), NOW())
            `;
          } else {
            // Update existing user status to active if they sign in with Google
            await prisma.$queryRaw`
              UPDATE users 
              SET status = 'ACTIVE', image = ${user.image || existingUser[0].image}, updated_at = NOW()
              WHERE email = ${user.email}
            `;
          }
        } catch (error) {
          console.error('Google OAuth error:', error);
        }
      }
      
      return true;
    }
  },
  
  // Security settings
  secret: process.env.NEXTAUTH_SECRET,
  
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
