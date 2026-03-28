"use client";

import { User } from 'lucide-react';

interface User {
  name: string;
  email: string;
  phone: string;
  role?: 'user' | 'admin';
}

interface AccountDropdownProps {
  user: User | null;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AccountDropdown({ user, isLoggedIn, onLogin, onLogout }: AccountDropdownProps) {
  // Di desktop, tidak perlu dropdown karena sidebar sudah fixed di kiri
  // Hanya tampilkan login button untuk user yang belum login
  
  if (!isLoggedIn) {
    return (
      <div className="relative">
        <button
          onClick={onLogin}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100"
          aria-label="Account"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Untuk user yang sudah login di desktop, tidak tampilkan apa-apa
  // karena navigasi sudah ada di sidebar kiri
  return null;
}
