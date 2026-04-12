"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('USER' | 'SELLER' | 'ADMIN')[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoggedIn = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role as 'USER' | 'SELLER' | 'ADMIN')) {
      router.push('/access-denied');
      return;
    }
  }, [user, isLoggedIn, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn || (user && !allowedRoles.includes(user.role as 'USER' | 'SELLER' | 'ADMIN'))) {
    return null;
  }

  return <>{children}</>;
}
