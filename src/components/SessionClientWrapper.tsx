"use client";

import { SessionProvider } from "next-auth/react";

interface ClientSessionProvidersProps {
  children: React.ReactNode;
}

export default function ClientSessionProviders({ children }: ClientSessionProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
