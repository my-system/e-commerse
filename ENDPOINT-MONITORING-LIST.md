# 🌐 ENDPOINT MONITORING SISTEM 3-DATABASE
## URL yang Tersedia di Website Anda

### 🏠 **Base URL:** `http://localhost:3000`

---

## 🤖 **AI HEALTH CHECK & AUTO-REPAIR (Bahasa Indonesia)**

### **Primary AI Health Check**
```
GET  http://localhost:3000/api/ai-kesehatan
POST http://localhost:3000/api/ai-kesehatan
```
**Fungsi:** Pemeriksaan kesehatan AI dan auto-repair manual

### **Original AI Health Check (English)**
```
GET  http://localhost:3000/api/ai-health-check
POST http://localhost:3000/api/ai-health-check
```
**Fungsi:** AI health check dengan auto-repair

---

## 🛡️ **CENTRAL BACKUP VALIDATION**

### **Backup Validation (Bahasa Indonesia)**
```
GET  http://localhost:3000/api/validasi-backup
POST http://localhost:3000/api/validasi-backup
```
**Fungsi:** Validasi dan perbaikan Central Backup

### **Backup Validation (English)**
```
GET  http://localhost:3000/api/central-backup-validation
POST http://localhost:3000/api/central-backup-validation
```
**Fungsi:** Central backup validation system

---

## 🔄 **ENHANCED PRODUCT WORKFLOW**

### **Enhanced Approval (Bahasa Indonesia)**
```
POST http://localhost:3000/api/persetujuan-lanjut/[id]
```
**Fungsi:** Persetujuan produk dengan alur lengkap A→C→B→A cleanup

### **Enhanced Rejection (Bahasa Indonesia)**
```
POST http://localhost:3000/api/penolakan-lanjut/[id]
```
**Fungsi:** Penolakan produk dengan backup ke Database C

### **Enhanced Approval (English)**
```
POST http://localhost:3000/api/enhanced-approval/[id]
```
**Fungsi:** Enhanced product approval with health check

### **Enhanced Rejection (English)**
```
POST http://localhost:3000/api/enhanced-rejection/[id]
```
**Fungsi:** Enhanced product rejection workflow

---

## 📊 **DATABASE MONITORING**

### **Database Info**
```
GET http://localhost:3000/api/database/info
```
**Fungsi:** Informasi lengkap semua database

### **Database Stats**
```
GET http://localhost:3000/api/database/stats
```
**Fungsi:** Statistik dan performa database

### **Database Check**
```
GET http://localhost:3000/api/database-check
```
**Fungsi:** Pemeriksaan kesehatan database basic

---

## 📦 **PRODUCT MANAGEMENT**

### **Pending Products**
```
GET  http://localhost:3000/api/pending-products
```
**Fungsi:** Daftar produk di Database A (Pending)

### **Marketplace Products**
```
GET  http://localhost:3000/api/marketplace-products
```
**Fungsi:** Daftar produk di Database B (Marketplace)

### **Admin Pending Products**
```
GET  http://localhost:3000/api/admin/pending-products
```
**Fungsi:** View pending products untuk admin

---

## 🔧 **ADMIN WORKFLOW**

### **Admin Approval**
```
POST http://localhost:3000/api/admin/approve
POST http://localhost:3000/api/admin/approve-product/[id]
```
**Fungsi:** Admin approval workflow

---

## 🧪 **TESTING ENDPOINTS**

### **Test Products**
```
GET  http://localhost:3000/api/test-products
```
**Fungsi:** Test product management

### **Test Seller Products**
```
GET  http://localhost:3000/api/test-seller-products
POST http://localhost:3000/api/test-seller-products/[id]/approve
```
**Fungsi:** Test seller product workflow

---

## 💻 **TERMINAL MONITORING**

### **Script Monitoring (Bahasa Indonesia)**
```bash
# Jalankan di terminal
node monitor-sistem-indonesia.js cek
node monitor-sistem-indonesia.js cepat
node monitor-sistem-indonesia.js bantuan
```

### **Script Monitoring (English)**
```bash
# Jalankan di terminal
node enhanced-system-monitor.js check
node enhanced-system-monitor.js quick
node enhanced-system-monitor.js help
```

---

## 📋 **CONTOH PENGGUNAAN WEB API:**

### **1. Cek Kesehatan Sistem (Bahasa Indonesia)**
```javascript
// GET request
fetch('http://localhost:3000/api/ai-kesehatan')
  .then(response => response.json())
  .then(data => console.log(data));

// POST untuk auto-repair
fetch('http://localhost:3000/api/ai-kesehatan', {
  method: 'POST'
})
.then(response => response.json())
.then(data => console.log(data));
```

### **2. Setujui Produk dengan Enhanced Workflow**
```javascript
fetch('http://localhost:3000/api/persetujuan-lanjut/product-123', {
  method: 'POST'
})
.then(response => response.json())
.then(data => console.log(data));
```

### **3. Validasi Backup Database**
```javascript
fetch('http://localhost:3000/api/validasi-backup')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 🎯 **REKOMENDASI PENGGUNAAN:**

### **Untuk Production Monitoring:**
1. **AI Health Check**: `/api/ai-kesehatan` (Bahasa Indonesia)
2. **Database Stats**: `/api/database/stats`
3. **Terminal Script**: `node monitor-sistem-indonesia.js cek`

### **Untuk Development:**
1. **Enhanced Approval**: `/api/persetujuan-lanjut/[id]`
2. **Database Info**: `/api/database/info`
3. **Test Endpoints**: `/api/test-products`

### **Untuk Admin Dashboard:**
1. **Pending Products**: `/api/admin/pending-products`
2. **Admin Approval**: `/api/admin/approve-product/[id]`
3. **Marketplace Products**: `/api/marketplace-products`

---

## 🚀 **INTEGRATION FRONTEND:**

### **React Component Example:**
```jsx
// Komponen monitoring untuk dashboard
const SystemMonitor = () => {
  const [health, setHealth] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:3000/api/ai-kesehatan')
      .then(res => res.json())
      .then(data => setHealth(data));
  }, []);
  
  return (
    <div>
      <h3>🤖 Status Kesehatan Sistem</h3>
      {health && (
        <div>
          <p>Status: {health.data.kesehatan.status}</p>
          <p>Issues: {health.data.ringkasanAutoFix.totalMasalah}</p>
        </div>
      )}
    </div>
  );
};
```

---

**📍 Semua endpoint ini aktif dan dapat diakses melalui browser atau API client di `http://localhost:3000`**
