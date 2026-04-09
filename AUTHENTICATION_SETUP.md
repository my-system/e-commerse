# 🚀 Sistem Autentikasi LUXE - Setup Guide

## 📋 **Overview**

Sistem autentikasi LUXE telah berhasil diimplementasikan dengan fitur-fitur berikut:

✅ **NextAuth.js** - Framework autentikasi modern  
✅ **Credentials Provider** - Login dengan email & password  
✅ **Google OAuth** - Login dengan akun Google  
✅ **OTP Verification** - Verifikasi email dengan 6 digit code  
✅ **Rate Limiting** - Proteksi dari brute force attacks  
✅ **CSRF Protection** - Keamanan form submission  
✅ **Protected Routes** - Middleware untuk route protection  
✅ **UI/UX LUXE Theme** - Design konsisten dengan brand  

---

## 🔧 **Environment Variables Setup**

### **1. Copy .env.example ke .env.local**
```bash
cp .env.example .env.local
```

### **2. Generate NEXTAUTH_SECRET**
```bash
# Di terminal (Windows)
openssl rand -base64 32

# Atau gunakan online generator
# https://generate-secret.vercel.app/
```

### **3. Google OAuth Setup**

#### **A. Buat Google Cloud Project**
1. Kunjungi: https://console.cloud.google.com/
2. Buat project baru: "LUXE E-Commerce"
3. Enable "Google+ API" dan "Google Identity"

#### **B. Setup OAuth Credentials**
1. Menu: APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client IDs
3. Application type: "Web application"
4. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Copy **Client ID** dan **Client Secret**

### **4. Resend Email Service Setup**

#### **A. Buat Akun Resend**
1. Kunjungi: https://resend.com/
2. Sign up dan verify domain
3. Dapatkan **API Key**

#### **B. Setup Domain**
1. Add domain di Resend dashboard
2. Setup DNS records (TXT, CNAME)
3. Verify domain ownership

### **5. Update .env.local**
```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_Wb35tJcYmLKy@ep-jolly-pine-an0l6t3r-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Email Service (Resend)
RESEND_API_KEY="re_your_resend_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Environment
NODE_ENV="development"
```

---

## 🧪 **Testing Guide**

### **1. Start Development Server**
```bash
npm run dev
```

### **2. Test Registration Flow**
1. Buka: http://localhost:3000/register
2. Isi form:
   - Name: "Test User"
   - Email: test@example.com
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Create Account"
4. Check email untuk OTP (development: alert akan muncul)
5. Buka: http://localhost:3000/verify-otp
6. Masukkan 6 digit OTP
7. Account berhasil dibuat!

### **3. Test Login Flow**
1. Buka: http://localhost:3000/login
2. Login dengan credentials yang dibuat
3. Atau test Google OAuth
4. Success redirect ke dashboard

### **4. Test Protected Routes**
1. Coba akses: http://localhost:3000/profile
2. Should redirect ke login jika belum authenticated
3. Setelah login, harus bisa akses

### **5. Test Rate Limiting**
1. Coba login 6x dengan password salah
2. Ke-7 kali harus dapat error 429 (Too Many Requests)

---

## 🔒 **Security Features**

### **✅ Implemented Security:**
- **Password Hashing** dengan bcrypt (salt rounds: 12)
- **Rate Limiting** (5 requests per 15 minutes)
- **CSRF Protection** (NextAuth built-in)
- **Session Management** dengan JWT tokens
- **CSP Headers** untuk XSS protection
- **Email Verification** untuk account activation
- **Secure Password Requirements** (min 8 characters)

### **🛡️ Security Headers:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'...
```

---

## 📁 **File Structure**

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts     # NextAuth API
│   │       ├── send-otp/route.ts         # OTP sending
│   │       └── verify-otp/route.ts       # OTP verification
│   ├── login/page.tsx                   # Login page
│   ├── register/page.tsx                 # Register page
│   ├── verify-otp/page.tsx              # OTP verification
│   └── middleware.ts                   # Route protection
├── lib/
│   ├── auth-simple.ts                   # NextAuth config
│   └── auth.ts                        # Alternative config
├── components/
│   └── providers/
│       └── SessionProvider.tsx           # NextAuth provider
└── prisma/
    └── schema.prisma                   # Database schema
```

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. "User model not found"**
```bash
npx prisma generate
npx prisma db push
```

#### **2. "Google OAuth redirect error"**
- Check redirect URI di Google Console
- Pastikan NEXTAUTH_URL benar
- Clear browser cookies

#### **3. "OTP not sending"**
- Check RESEND_API_KEY
- Verify domain di Resend
- Check email spam folder

#### **4. "Rate limiting too strict"**
- Adjust `maxRequests` di middleware.ts
- Currently: 5 requests per 15 minutes

#### **5. "Session not persisting"**
- Check NEXTAUTH_SECRET
- Clear browser localStorage
- Check middleware configuration

---

## 🎯 **Next Steps**

### **Production Deployment:**
1. Update NEXTAUTH_URL ke production domain
2. Set NODE_ENV="production"
3. Configure production database
4. Setup production email domain
5. Add production redirect URIs ke Google

### **Enhancement Ideas:**
- [ ] Two-Factor Authentication (2FA)
- [ ] Social login (Facebook, Twitter)
- [ ] Password reset flow
- [ ] Account deletion flow
- [ ] Email change verification
- [ ] Session analytics

---

## 📞 **Support**

Jika mengalami masalah:
1. Check console logs untuk error details
2. Verify semua environment variables
3. Pastikan database connection aktif
4. Test API endpoints secara manual

**Sistem autentikasi LUXE siap digunakan!** 🎉
