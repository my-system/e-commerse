# Admin Login Information

## Default Admin Account

**Email:** `admin@ecommerce.com`  
**Password:** `admin123`

## Cara Login Admin:

### Method 1: Direct Login
1. Buka aplikasi Anda yang sudah di-deploy
2. Masuk ke halaman login
3. Masukkan email dan password di atas
4. Anda akan langsung di-redirect ke admin dashboard

### Method 2: Create Admin Account (jika belum ada)
Jika login tidak berhasil, buka browser console (F12) dan jalankan:

```javascript
// Copy dan paste ini di console browser
function createAdminAccount() {
  const adminUser = {
    id: 'admin-001',
    name: 'Admin System',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    phone: '+6281234567890',
    role: 'admin',
    avatar: null,
    createdAt: new Date().toISOString()
  };

  const usersData = localStorage.getItem('luxe_users');
  const users = usersData ? JSON.parse(usersData) : [];

  const existingAdmin = users.find(u => u.email === adminUser.email);
  if (existingAdmin) {
    existingAdmin.role = 'admin';
    existingAdmin.password = adminUser.password;
    console.log('Admin account updated:', existingAdmin.email);
  } else {
    users.push(adminUser);
    console.log('Admin account created:', adminUser.email);
  }

  localStorage.setItem('luxe_users', JSON.stringify(users));
  
  const { password: _, ...userWithoutPassword } = adminUser;
  localStorage.setItem('luxe_user', JSON.stringify(userWithoutPassword));
  localStorage.setItem('luxe_remember_me', 'true');

  console.log('Admin account created and logged in!');
  window.location.reload();
}

createAdminAccount();
```

## Admin Dashboard Features

Setelah login sebagai admin, Anda bisa mengakses:

### Main Dashboard (`/admin`)
- Analytics dan statistics
- Overview pesanan dan produk
- Revenue charts

### Product Management (`/admin/products`)
- View all products
- Approve/reject pending products
- Edit dan delete products

### Marketplace (`/admin/marketplace/products`)
- Manage approved marketplace products
- Delete marketplace items
- View marketplace statistics

### User Management (`/admin/users`)
- View registered users
- Manage user roles
- User analytics

### Settings (`/admin/settings`)
- System configuration
- Database management
- Security settings

## Quick Access Links

Setelah login, gunakan link berikut:

- **Admin Dashboard**: `[your-domain]/admin`
- **Products**: `[your-domain]/admin/products`
- **Marketplace**: `[your-domain]/admin/marketplace/products`
- **Users**: `[your-domain]/admin/users`
- **Settings**: `[your-domain]/admin/settings`

## Security Notes

- Password default: `admin123` (ubah untuk production)
- Email default: `admin@ecommerce.com`
- Role: `admin` (full access)
- Data tersimpan di localStorage (untuk demo)

## Troubleshooting

### Jika tidak bisa login:
1. Clear browser cache dan localStorage
2. Run the create admin script di console
3. Refresh halaman
4. Coba login kembali

### Jika tidak di-redirect ke admin:
1. Check role user di localStorage
2. Pastikan role = 'admin'
3. Refresh halaman setelah login

---

**Selamat mengakses admin dashboard!**
