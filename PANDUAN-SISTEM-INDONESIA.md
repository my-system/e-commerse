# Panduan Lengkap Sistem Sinkronisasi 3-Database
## AI Auto-Detect & Self-Healing dalam Bahasa Indonesia

### 🎯 Gambaran Umum

Sistem ini mengimplementasikan arsitektur sinkronisasi 3-database yang kuat dengan kemampuan deteksi otomatis dan perbaikan mandiri yang didukung AI untuk platform e-commerce dalam Bahasa Indonesia.

### 📊 Struktur Database

#### Database A (Pending) - `ecommerce_pending`
- **Fungsi**: Menyimpan produk baru yang menunggu persetujuan admin
- **Status**: `pending` untuk semua produk baru
- **Alur**: Produk masuk → Admin review → Disetujui/Ditolak

#### Database B (Marketplace) - `ecommerce_marketplace`  
- **Fungsi**: Menyimpan produk yang disetujui dan tayang di marketplace
- **Status**: `approved` untuk semua produk
- **Alur**: Produk disetujui → Tayang di marketplace → Bisa di-update

#### Database C (Central Backup) - `commercedb`
- **Fungsi**: Sumber kebenaran tunggal untuk semua riwayat produk
- **Status**: `pending`, `approved`, atau `rejected`
- **Alur**: Menyimpan semua perubahan dan riwayat produk

### 🔄 Alur Kerja Sistem

#### Alur Persetujuan Produk (Action 'Approve')
```
LANGKAH 1: Validasi produk di Database A (Pending)
LANGKAH 2: Backup produk ke Database C dengan status 'approved'
LANGKAH 3: Masukkan produk ke Database B (Marketplace) dengan status 'approved'  
LANGKAH 4: Hapus produk dari Database A (Pending)
LANGKAH 5: Validasi final sinkronisasi lengkap
```

#### Alur Penolakan Produk (Action 'Reject')
```
LANGKAH 1: Validasi produk di Database A (Pending)
LANGKAH 2: Update status ke 'rejected' di Database A
LANGKAH 3: Backup produk ke Database C dengan status 'rejected'
LANGKAH 4: Hapus dari Database A (opsional cleanup)
```

### 🤖 Fitur AI Auto-Detect & Repair

#### Kemampuan Deteksi AI
1. **Deteksi Duplikat**: Mencegah ID produk yang sama ada di Database A dan B secara bersamaan
2. **Deteksi Ketidakkonsistenan Data**: Jika produk di Database B tapi status di Database C bukan 'approved'
3. **Deteksi Data Yatim**: Jika proses terputus (misal: masuk ke B tapi gagal hapus di A)
4. **Validasi Integritas Backup**: Memastikan setiap perubahan di A atau B terdokumentasi di C

#### Mekanisme Auto-Repair
- **Perbaikan Duplikat Otomatis**: Menghapus duplikat dari database pending
- **Sinkronisasi Status**: Memperbaiki ketidakcocokan status secara otomatis
- **Pemulihan Data Yatim**: Mengembalikan produk marketplace yang hilang
- **Pembuatan Backup Hilang**: Membuat entri backup untuk produk yang hilang

### 📡 Endpoint API (Bahasa Indonesia)

#### Manajemen Produk
```bash
# Setujui produk dengan alur kerja tingkat lanjut
POST /api/persetujuan-lanjut/[id]

# Tolak produk dengan alur kerja tingkat lanjut  
POST /api/penolakan-lanjut/[id]
```

#### AI Health Check & Auto-Repair
```bash
# Cek kesehatan sistem AI
GET /api/ai-kesehatan

# Jalankan auto-repair manual
POST /api/ai-kesehatan
```

#### Validasi Central Backup
```bash
# Validasi backup database
GET /api/validasi-backup

# Jalankan perbaikan backup manual
POST /api/validasi-backup
```

### 💻 Perintah Terminal (Bahasa Indonesia)

```bash
# Jalankan pemeriksaan kesehatan komprehensif
node monitor-sistem-indonesia.js cek

# Jalankan pemeriksaan kesehatan cepat
node monitor-sistem-indonesia.js cepat

# Tampilkan bantuan
node monitor-sistem-indonesia.js bantuan
```

### 🛡️ Penanganan Error & Timeout

#### Logika Retry Koneksi
- **Maksimal Retry**: 3 percobaan per koneksi database
- **Exponential Backoff**: Delay 1s, 2s, 4s antara retry
- **Timeout Koneksi**: 30 detik per percobaan koneksi
- **Timeout Operasi**: 60 detik untuk operasi reguler, 120 detik untuk health check

#### Deteksi Terminal Sibuk
- **Auto-Timeout Detection**: Otomatis mendeteksi operasi yang hang
- **Operation Tracking**: Melacak operasi aktif dengan ID unik
- **Graceful Termination**: Auto-terminate operasi yang melebihi batas waktu

### 📋 Contoh Penggunaan

#### 1. Menyetujui Produk
```typescript
import EnhancedSynchronizationService from '@/lib/enhanced-database-sync';

const syncService = new EnhancedSynchronizationService();

const result = await syncService.approveProduct('product-123');

if (result.success) {
  console.log('Produk berhasil disetujui');
  console.log('Langkah yang diselesaikan:', result.steps);
} else {
  console.error('Persetujuan gagal:', result.error);
}
```

#### 2. Menjalankan AI Health Check
```typescript
const healthResult = await syncService.runHealthCheck();

console.log('Status Sistem:', healthResult.status);
console.log('Masalah Ditemukan:', healthResult.issues.length);
console.log('Auto-Fixed:', healthResult.issues.filter(i => i.autoFixed).length);
```

#### 3. Memvalidasi Central Backup
```typescript
import CentralBackupValidator from '@/lib/central-backup-validator';

const validator = new CentralBackupValidator();
const report = await validator.generateBackupReport();

console.log('Integritas Backup:', report.summary.backupIntegrity);
console.log('Total Produk:', report.summary.totalProducts);
console.log('Rekomendasi:', report.recommendations);
```

### 🔧 Konfigurasi

#### Variabel Lingkungan
```bash
# String Koneksi Database
PENDING_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_pending"
MARKETPLACE_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_marketplace"
BACKUP_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/commercedb"

# Konfigurasi Sistem
NODE_ENV="production" # Mengaktifkan auto health checks
```

### 🚨 Skenario Error & Pemulihan

#### Skenario 1: Gangguan Jaringan Saat Persetujuan
**Deteksi**: AI monitor mendeteksi produk di marketplace tapi missing dari backup
**Auto-Repair**: Otomatis membuat entri backup yang hilang
**Pemulihan Manual**: Jalankan `POST /api/ai-kesehatan` untuk perbaikan manual

#### Skenario 2: Kegagalan Koneksi Database
**Deteksi**: Logika retry koneksi dengan exponential backoff
**Pemulihan**: Retry otomatis dengan fallback ke status error
**Pemulihan Manual**: Periksa konektivitas database dan restart layanan

#### Skenario 3: Produk Duplikat
**Deteksi**: AI monitor menemukan ID produk sama di pending dan marketplace
**Auto-Repair**: Menghapus duplikat dari database pending
**Pemulihan Manual**: Review log deteksi duplikat

### 📊 Monitoring & Logging

#### Level Log
- **INFO**: Progress operasi langkah demi langkah
- **SUCCESS**: Operasi selesai dengan detail
- **ERROR**: Operasi gagal dengan stack trace
- **TIMEOUT**: Operasi hang di-terminate otomatis

#### Metrik Kunci
- Waktu koneksi per database
- Tingkat sukses/gagal operasi
- Tingkat sukses auto-repair
- Skor integritas data

### 🚀 Memulai Sistem

#### 1. Instalasi
```bash
# Pastikan dependencies terinstal
npm install pg @types/pg

# Verifikasi koneksi database
node monitor-sistem-indonesia.js cek
```

#### 2. Setup Awal
```bash
# Jalankan health check awal
node monitor-sistem-indonesia.js cek

# Validasi central backup
curl http://localhost:3000/api/validasi-backup
```

#### 3. Test Alur Kerja
```bash
# Test persetujuan produk
curl -X POST http://localhost:3000/api/persetujuan-lanjut/test-product-id

# Jalankan AI health check
curl http://localhost:3000/api/ai-kesehatan
```

### 📞 Pemecahan Masalah

#### Masalah Umum
1. **Connection Timeouts**: Periksa status server database dan konektivitas jaringan
2. **Permission Errors**: Verifikasi user database memiliki permission yang dibutuhkan
3. **Missing Tables**: Pastikan tabel products ada di semua database
4. **Hung Operations**: Periksa log terminal untuk pesan timeout

#### Mode Debug
```typescript
// Aktifkan logging detail
process.env.DEBUG = 'true';

// Jalankan dengan timeout yang diperpanjang
const syncService = new EnhancedSynchronizationService();
syncService.operationTimeout = 300000; // 5 menit
```

### 🔒 Praktik Terbaik

#### Untuk Produksi
1. **Aktifkan Auto Health Checks**: Set `NODE_ENV=production`
2. **Monitor Logs**: Siapkan agregasi log untuk monitoring sistem
3. **Validasi Reguler**: Jadwalkan validasi backup periodik
4. **Connection Pooling**: Konfigurasi ukuran pool yang tepat

#### Optimasi Performa
1. **Reuse Koneksi**: Gunakan connection pooling secara efektif
2. **Operasi Batch**: Proses multiple produk jika memungkinkan
3. **Operasi Async**: Gunakan Promise.all untuk operasi database paralel
4. **Penyetelan Timeout**: Sesuaikan timeout berdasarkan performa sistem

### 📖 Format Response API

#### Sukses Response
```json
{
  "sukses": true,
  "pesan": "Operasi berhasil diselesaikan",
  "data": {
    // detail hasil operasi
  },
  "timestamp": "2026-04-05T02:07:00.000Z"
}
```

#### Error Response
```json
{
  "sukses": false,
  "pesan": "Operasi gagal",
  "error": "Detail pesan error",
  "timestamp": "2026-04-05T02:07:00.000Z"
}
```

### 🔄 Status Operasi

#### Status Sistem
- **SEHAT**: Semua sistem berfungsi normal
- **PERINGATAN**: Ada masalah minor yang perlu perhatian
- **KRITIS**: Ada masalah serius yang memerlukan intervensi segera

#### Tingkat Keparahan Masalah
- **Rendah**: Masalah minor tidak mempengaruhi fungsi
- **Sedang**: Masalah yang bisa mempengaruhi performa
- **Tinggi**: Masalah yang bisa menyebabkan data inconsistency
- **Kritis**: Masalah yang bisa menyebabkan system failure

---

**Catatan Penting**: Sistem ini dirancang untuk ketersediaan tinggi dan integritas data. Selalu testing di environment development sebelum deploy ke production. Semua log dan pesan error dalam Bahasa Indonesia untuk memudahkan monitoring dan troubleshooting.
