// Script untuk membuat akun admin otomatis
// Jalankan ini di browser console (F12) saat berada di halaman web

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

  // Ambil users yang sudah ada
  const usersData = localStorage.getItem('luxe_users');
  const users = usersData ? JSON.parse(usersData) : [];

  // Cek apakah admin sudah ada
  const existingAdmin = users.find(u => u.email === adminUser.email);
  if (existingAdmin) {
    // Update role ke admin jika belum
    existingAdmin.role = 'admin';
    existingAdmin.password = adminUser.password;
    console.log('Admin account updated:', existingAdmin.email);
  } else {
    // Tambahkan admin baru
    users.push(adminUser);
    console.log('Admin account created:', adminUser.email);
  }

  // Simpan ke localStorage
  localStorage.setItem('luxe_users', JSON.stringify(users));
  
  // Auto login sebagai admin
  const { password: _, ...userWithoutPassword } = adminUser;
  localStorage.setItem('luxe_user', JSON.stringify(userWithoutPassword));
  localStorage.setItem('luxe_remember_me', 'true');

  console.log('✅ Admin account created and logged in successfully!');
  console.log('📧 Email: admin@ecommerce.com');
  console.log('🔑 Password: admin123');
  console.log('🔄 Refresh halaman untuk melihat perubahan');
  
  // Refresh halaman setelah 2 detik
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Jalankan fungsi
createAdminAccount();
