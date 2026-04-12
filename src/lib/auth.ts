import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

export const authOptions: NextAuthOptions = {
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
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  
  callbacks: {
    // JWT callback
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
        token.picture = user.image;
      }
      return token;
    },
    
    // Session callback
    async session({ session, token, user }) {
      if (user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.role = user.role as string;
        session.user.status = user.status as string;
        session.user.image = user.image;
      } else if (token) {
        session.user.id = token.sub!;
        session.user.name = token.name || '';
        session.user.email = token.email || '';
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.image = token.picture || null;
      }
      return session;
    },
    
    // Sign in callback
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // For Google OAuth, automatically activate the user
        // Google already verifies the email
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (existingUser) {
            if (existingUser.status === 'INACTIVE') {
              // Activate the user
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { status: 'ACTIVE', emailVerified: new Date() }
              });
            }

            // Assign ADMIN role to specific email addresses
            const adminEmails = ['yusufdarwis097@gmail.com'];
            if (adminEmails.includes(user.email!)) {
              await prisma.user.update({
                where: { email: user.email! },
                data: { role: 'ADMIN' }
              });
            }

            // Set user role from database
            user.role = existingUser.role;
            user.status = existingUser.status;
          } else {
            // Create new user if not exists
            const adminEmails = ['yusufdarwis097@gmail.com'];
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || 'Google User',
                image: user.image,
                role: adminEmails.includes(user.email!) ? 'ADMIN' : 'USER',
                status: 'ACTIVE',
                emailVerified: new Date()
              }
            });
            user.role = newUser.role;
            user.status = newUser.status;
          }
        } catch (error) {
          console.error('Error activating user:', error);
        }
      }
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
  
  // Security events logging
  events: {
    signIn: async (message) => {
      console.log('User signed in:', {
        email: message.user?.email,
        role: message.user?.role,
        timestamp: new Date().toISOString()
      });
    },
    signOut: async (message) => {
      console.log('User signed out:', {
        email: message.session?.user?.email,
        timestamp: new Date().toISOString()
      });
    },
    createUser: async (message) => {
      console.log('User created:', {
        email: message.user?.email,
        role: message.user?.role,
        timestamp: new Date().toISOString()
      });
    }
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
