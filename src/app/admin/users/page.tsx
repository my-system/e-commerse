"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Ban, 
  Shield, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Star, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  UserMinus, 
  Crown,
  Eye,
  EyeOff,
  MoreVertical,
  ChevronDown,
  UserCheck,
  UserX,
  Clock,
  Activity,
  Store
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  sellerInfo?: {
    storeName: string;
    storeDescription: string;
    totalProducts: number;
    totalRevenue: number;
    approvalStatus: 'approved' | 'pending' | 'rejected';
  };
}

interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  totalAdmins: number;
  totalSellers: number;
  totalBuyers: number;
  verifiedUsers: number;
  newUsersThisMonth: number;
  usersGrowth: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    pendingUsers: 0,
    totalAdmins: 0,
    totalSellers: 0,
    totalBuyers: 0,
    verifiedUsers: 0,
    newUsersThisMonth: 0,
    usersGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'seller' | 'buyer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended' | 'pending'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // Temporarily remove admin check for testing
      fetchUsers();
    }
  }, [isLoading]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter, verificationFilter]);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          name: 'Admin System',
          email: 'yusufdariws097@gmail.com',
          phone: '+6281234567890',
          role: 'admin',
          status: 'active',
          joinDate: '2023-01-15T10:30:00Z',
          lastLogin: '2024-01-15T14:30:00Z',
          totalOrders: 0,
          totalSpent: 0,
          averageRating: 0,
          reviewCount: 0,
          location: 'Jakarta, Indonesia',
          verified: true,
          emailVerified: true,
          phoneVerified: true
        },
        {
          id: '2',
          name: 'Toko Fashion Premium',
          email: 'fashion@premium.com',
          phone: '+6281234567891',
          role: 'seller',
          status: 'active',
          joinDate: '2023-02-20T11:15:00Z',
          lastLogin: '2024-01-14T16:45:00Z',
          totalOrders: 0,
          totalSpent: 0,
          averageRating: 4.8,
          reviewCount: 156,
          location: 'Bandung, Indonesia',
          verified: true,
          emailVerified: true,
          phoneVerified: true,
          sellerInfo: {
            storeName: 'Toko Fashion Premium',
            storeDescription: 'Premium fashion collection',
            totalProducts: 234,
            totalRevenue: 456789000,
            approvalStatus: 'approved'
          }
        },
        {
          id: '3',
          name: 'Ahmad Rizki',
          email: 'ahmad.rizki@email.com',
          phone: '+6281234567892',
          role: 'buyer',
          status: 'active',
          joinDate: '2023-03-10T09:20:00Z',
          lastLogin: '2024-01-15T10:15:00Z',
          totalOrders: 23,
          totalSpent: 4567000,
          averageRating: 4.5,
          reviewCount: 12,
          location: 'Surabaya, Indonesia',
          verified: true,
          emailVerified: true,
          phoneVerified: false
        },
        {
          id: '4',
          name: 'Electronics Store',
          email: 'electronics@store.com',
          phone: '+6281234567893',
          role: 'seller',
          status: 'pending',
          joinDate: '2023-04-05T13:45:00Z',
          lastLogin: '2024-01-12T11:30:00Z',
          totalOrders: 0,
          totalSpent: 0,
          averageRating: 0,
          reviewCount: 0,
          location: 'Jakarta, Indonesia',
          verified: false,
          emailVerified: true,
          phoneVerified: false,
          sellerInfo: {
            storeName: 'Electronics Store',
            storeDescription: 'Gadgets and electronics',
            totalProducts: 156,
            totalRevenue: 0,
            approvalStatus: 'pending'
          }
        },
        {
          id: '5',
          name: 'Siti Nurhaliza',
          email: 'siti.nur@email.com',
          phone: '+6281234567894',
          role: 'buyer',
          status: 'suspended',
          joinDate: '2023-05-12T15:30:00Z',
          lastLogin: '2024-01-08T09:45:00Z',
          totalOrders: 8,
          totalSpent: 1234000,
          averageRating: 3.2,
          reviewCount: 3,
          location: 'Yogyakarta, Indonesia',
          verified: true,
          emailVerified: true,
          phoneVerified: true
        },
        {
          id: '6',
          name: 'Beauty Boutique',
          email: 'beauty@boutique.com',
          phone: '+6281234567895',
          role: 'seller',
          status: 'active',
          joinDate: '2023-06-18T10:15:00Z',
          lastLogin: '2024-01-14T13:20:00Z',
          totalOrders: 0,
          totalSpent: 0,
          averageRating: 4.9,
          reviewCount: 89,
          location: 'Semarang, Indonesia',
          verified: true,
          emailVerified: true,
          phoneVerified: true,
          sellerInfo: {
            storeName: 'Beauty Boutique',
            storeDescription: 'Premium beauty products',
            totalProducts: 89,
            totalRevenue: 234567000,
            approvalStatus: 'approved'
          }
        },
        {
          id: '7',
          name: 'Budi Santoso',
          email: 'budi.santoso@email.com',
          phone: '+6281234567896',
          role: 'buyer',
          status: 'inactive',
          joinDate: '2023-07-22T14:10:00Z',
          lastLogin: '2023-12-20T16:30:00Z',
          totalOrders: 5,
          totalSpent: 890000,
          averageRating: 4.0,
          reviewCount: 2,
          location: 'Medan, Indonesia',
          verified: false,
          emailVerified: true,
          phoneVerified: false
        },
        {
          id: '8',
          name: 'Sports Equipment',
          email: 'sports@equipment.com',
          phone: '+6281234567897',
          role: 'seller',
          status: 'active',
          joinDate: '2023-08-30T12:45:00Z',
          lastLogin: '2024-01-15T09:10:00Z',
          totalOrders: 0,
          totalSpent: 0,
          averageRating: 4.6,
          reviewCount: 45,
          location: 'Denpasar, Indonesia',
          verified: true,
          emailVerified: true,
          phoneVerified: true,
          sellerInfo: {
            storeName: 'Sports Equipment',
            storeDescription: 'Sports and fitness gear',
            totalProducts: 145,
            totalRevenue: 198765000,
            approvalStatus: 'approved'
          }
        }
      ];

      setUsers(mockUsers);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Gagal memuat data users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filter by verification
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(user => 
        verificationFilter === 'verified' ? user.verified : !user.verified
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.sellerInfo?.storeName && user.sellerInfo.storeName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const stats: AdminUserStats = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      inactiveUsers: users.filter(user => user.status === 'inactive').length,
      suspendedUsers: users.filter(user => user.status === 'suspended').length,
      pendingUsers: users.filter(user => user.status === 'pending').length,
      totalAdmins: users.filter(user => user.role === 'admin').length,
      totalSellers: users.filter(user => user.role === 'seller').length,
      totalBuyers: users.filter(user => user.role === 'buyer').length,
      verifiedUsers: users.filter(user => user.verified).length,
      newUsersThisMonth: users.filter(user => {
        const joinDate = new Date(user.joinDate);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      }).length,
      usersGrowth: 12.5 // Mock growth percentage
    };
    setStats(stats);
  };

  const updateUserStatus = async (userId: string, newStatus: AdminUser['status']) => {
    try {
      setUpdatingStatus(userId);
      
      // Update local state
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      }));
      
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Gagal mengupdate status user');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const updateUserRole = async (userId: string, newRole: AdminUser['role']) => {
    try {
      setUpdatingRole(userId);
      
      // Update local state
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      }));
      
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Gagal mengupdate role user');
    } finally {
      setUpdatingRole(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Tidak Aktif';
      case 'suspended':
        return 'Disuspend';
      case 'pending':
        return 'Menunggu';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'seller':
        return <Store className="h-4 w-4 text-blue-500" />;
      case 'buyer':
        return <ShoppingBag className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'seller':
        return 'Seller';
      case 'buyer':
        return 'Buyer';
      default:
        return 'Unknown';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'seller':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'buyer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const bulkUpdateStatus = (status: AdminUser['status']) => {
    selectedUsers.forEach(userId => {
      updateUserStatus(userId, status);
    });
    setSelectedUsers([]);
  };

  const bulkUpdateRole = (role: AdminUser['role']) => {
    selectedUsers.forEach(userId => {
      updateUserRole(userId, role);
    });
    setSelectedUsers([]);
  };

  const exportUsers = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Location', 'Join Date', 'Last Login', 'Total Orders', 'Total Spent', 'Rating', 'Verified'],
      ...filteredUsers.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone,
        getRoleText(user.role),
        getStatusText(user.status),
        user.location,
        formatDate(user.joinDate),
        formatDateTime(user.lastLogin),
        user.totalOrders,
        formatCurrency(user.totalSpent),
        user.averageRating.toFixed(1),
        user.verified ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Temporarily remove access check for testing
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin User Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportUsers}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 ml-1">{stats.usersGrowth}%</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">Active Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% dari total
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">Verified Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.verifiedUsers}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}% terverifikasi
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">New This Month</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.newUsersThisMonth}</p>
                  <div className="flex items-center mt-2">
                    <UserPlus className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600 ml-1">Baru</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Role Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalAdmins}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sellers</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalSellers}</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Buyers</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalBuyers}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, email, phone, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-full lg:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="suspended">Disuspend</option>
                <option value="pending">Menunggu</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div className="w-full lg:w-48">
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Verifikasi</option>
                <option value="verified">Terverifikasi</option>
                <option value="unverified">Belum Terverifikasi</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <span className="text-sm text-blue-800">
                  {selectedUsers.length} user terpilih
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => bulkUpdateStatus('active')}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Aktifkan
                </button>
                <button
                  onClick={() => bulkUpdateStatus('suspended')}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Suspend
                </button>
                <div className="border-l border-blue-300 h-6 mx-2"></div>
                <button
                  onClick={() => bulkUpdateRole('buyer')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Jadikan Buyer
                </button>
                <button
                  onClick={() => bulkUpdateRole('seller')}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                >
                  Jadikan Seller
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || verificationFilter !== 'all' ? 'Tidak ada user yang cocok' : 'Belum ada user'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || verificationFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'User akan muncul di sini ketika mendaftar'
              }
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1 + (index * 0.05) }}
                      whileHover={{ backgroundColor: '#f9fafb', scale: 1.01 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.sellerInfo && (
                              <div className="text-xs text-gray-400">{user.sellerInfo.storeName}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{getRoleText(user.role)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1">{getStatusText(user.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.joinDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          {user.role === 'buyer' && (
                            <>
                              <div className="text-sm font-medium text-gray-900">{user.totalOrders} orders</div>
                              <div className="text-xs text-gray-500">{formatCurrency(user.totalSpent)}</div>
                            </>
                          )}
                          {user.role === 'seller' && user.sellerInfo && (
                            <>
                              <div className="text-sm font-medium text-gray-900">{user.sellerInfo.totalProducts} products</div>
                              <div className="text-xs text-gray-500">{formatCurrency(user.sellerInfo.totalRevenue)}</div>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <div className="text-sm text-gray-500">System Admin</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.verified && (
                            <div className="flex items-center">
                              <Shield className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-gray-600 ml-1">Verified</span>
                            </div>
                          )}
                          {user.emailVerified && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-gray-600 ml-1">Email</span>
                            </div>
                          )}
                          {user.phoneVerified && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-gray-600 ml-1">Phone</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const newStatus = user.status === 'active' ? 'suspended' : 'active';
                              updateUserStatus(user.id, newStatus);
                            }}
                            disabled={updatingStatus === user.id}
                            className={`px-2 py-1 rounded transition-colors text-xs disabled:opacity-50 ${
                              user.status === 'active' 
                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Aktifkan'}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => {
                                const newRole = user.role === 'buyer' ? 'seller' : 'buyer';
                                updateUserRole(user.id, newRole);
                              }}
                              disabled={updatingRole === user.id}
                              className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs disabled:opacity-50"
                            >
                              {user.role === 'buyer' ? 'Jadi Seller' : 'Jadi Buyer'}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
