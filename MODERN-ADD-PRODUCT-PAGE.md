# 🎨 MODERN SELLER ADD PRODUCT PAGE
## Dashboard E-Commerce Professional Design

### 🎯 **Overview**
Halaman Add Product yang modern dan profesional untuk dashboard seller dengan design mirip Shopify/Stripe admin panel.

---

## 🏗️ **STRUKTUR LAYOUT:**

### **1. Top Bar Navigation**
```jsx
<div className="bg-white border-b border-gray-200">
  <div className="flex items-center justify-between h-16">
    {/* Left: Navigation */}
    <Link href="/seller/products" className="flex items-center gap-2">
      <ArrowLeft className="h-4 w-4" />
      Back to Products
    </Link>
    
    {/* Center: Page Title */}
    <div>
      <h1 className="text-xl font-semibold text-gray-900">Add New Product</h1>
      <p className="text-sm text-gray-500">Add a new product to your store catalog</p>
    </div>
    
    {/* Right: Actions */}
    <div className="flex items-center gap-3">
      <Link href="/seller/products" className="px-4 py-2 border border-gray-300 rounded-lg">
        Cancel
      </Link>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Save Product
      </button>
    </div>
  </div>
</div>
```

### **2. Sidebar Navigation**
```jsx
<div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
  <nav className="space-y-2">
    <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
      <Package className="h-4 w-4" />
      Basic Info
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
      <DollarSign className="h-4 w-4" />
      Pricing
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
      <ImageIcon className="h-4 w-4" />
      Media
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
      <Palette className="h-4 w-4" />
      Variants
    </button>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
      <Settings className="h-4 w-4" />
      Settings
    </button>
  </nav>
</div>
```

### **3. Main Content Area**
```jsx
<div className="flex-1 p-8">
  <form className="space-y-8 max-w-4xl">
    {/* Form Sections */}
  </form>
</div>
```

---

## 📝 **FORM SECTIONS (LENGKAP):**

### **A. Basic Information**
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center gap-2 mb-6">
    <Package className="h-5 w-5 text-blue-600" />
    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Product Name */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Name *
      </label>
      <input
        type="text"
        name="title"
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Enter product name"
      />
    </div>
    
    {/* Auto-generated Slug */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
      <input
        type="text"
        name="slug"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
        placeholder="Auto-generated from product name"
        readOnly
      />
    </div>
    
    {/* Category */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category *
      </label>
      <select
        name="category"
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
    
    {/* Brand */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
      <input
        type="text"
        name="brand"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Enter brand name"
      />
    </div>
    
    {/* Description */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description *
      </label>
      <textarea
        name="description"
        rows={4}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Describe your product in detail..."
      />
    </div>
  </div>
</div>
```

### **B. Pricing & Stock**
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center gap-2 mb-6">
    <DollarSign className="h-5 w-5 text-green-600" />
    <h2 className="text-lg font-semibold text-gray-900">Pricing & Stock</h2>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Price */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Price (Rp) *
      </label>
      <input
        type="number"
        name="price"
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="0"
        min="0"
        step="0.01"
      />
    </div>
    
    {/* Discount Price */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Discount Price (Rp)
      </label>
      <input
        type="number"
        name="discount_price"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Optional"
        min="0"
        step="0.01"
      />
    </div>
    
    {/* Stock */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Stock Quantity
      </label>
      <input
        type="number"
        name="stock"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="0"
        min="0"
      />
    </div>
    
    {/* Auto-generated SKU */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
      <input
        type="text"
        name="sku"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
        placeholder="Auto-generated"
        readOnly
      />
    </div>
  </div>
</div>
```

### **C. Product Images (Drag & Drop)**
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center gap-2 mb-6">
    <ImageIcon className="h-5 w-5 text-purple-600" />
    <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
  </div>
  
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Upload Images *
    </label>
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <span className="text-lg font-medium text-gray-700 mb-2">
          Click to upload or drag and drop
        </span>
        <span className="text-sm text-gray-500">
          PNG, JPG, GIF up to 5MB each
        </span>
      </label>
    </div>
  </div>
  
  {/* Image Previews */}
  {imagePreviews.length > 0 && (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Image Previews</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
```

### **D. Product Variants**
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center gap-2 mb-6">
    <Palette className="h-5 w-5 text-orange-600" />
    <h2 className="text-lg font-semibold text-gray-900">Product Variants</h2>
  </div>
  
  {/* Sizes */}
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-md font-medium text-gray-800">Sizes</h3>
      <button
        type="button"
        onClick={() => addVariant('sizes')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add Size
      </button>
    </div>
    
    {formData.sizes.map((size, index) => (
      <div key={size.id} className="flex gap-3 mb-3">
        <input
          type="text"
          placeholder="Size name (e.g., M, L, XL)"
          value={size.name}
          onChange={(e) => updateVariant('sizes', index, 'name', e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Price adjustment"
          value={size.price || 0}
          onChange={(e) => updateVariant('sizes', index, 'price', parseFloat(e.target.value) || 0)}
          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => removeVariant('sizes', index)}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
  
  {/* Colors */}
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-md font-medium text-gray-800">Colors</h3>
      <button
        type="button"
        onClick={() => addVariant('colors')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add Color
      </button>
    </div>
    
    {formData.colors.map((color, index) => (
      <div key={color.id} className="flex gap-3 mb-3">
        <input
          type="text"
          placeholder="Color name (e.g., Red, Blue)"
          value={color.name}
          onChange={(e) => updateVariant('colors', index, 'name', e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Color code (e.g., #FF0000)"
          value={color.value}
          onChange={(e) => updateVariant('colors', index, 'value', e.target.value)}
          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => removeVariant('colors', index)}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
</div>
```

### **E. Status Settings**
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center gap-2 mb-6">
    <Settings className="h-5 w-5 text-gray-600" />
    <h2 className="text-lg font-semibold text-gray-900">Status Settings</h2>
  </div>
  
  <div className="space-y-4">
    {/* Product Status */}
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div>
        <label className="text-sm font-medium text-gray-900">Product Status</label>
        <p className="text-sm text-gray-500">Choose whether to publish or save as draft</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
          className={`px-4 py-2 rounded-lg transition-colors ${
            formData.status === 'draft'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <EyeOff className="h-4 w-4 inline mr-1" />
          Draft
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, status: 'active' }))}
          className={`px-4 py-2 rounded-lg transition-colors ${
            formData.status === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Eye className="h-4 w-4 inline mr-1" />
          Active
        </button>
      </div>
    </div>
    
    {/* Featured Product */}
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div>
        <label className="text-sm font-medium text-gray-900">Featured Product</label>
        <p className="text-sm text-gray-500">Display this product on the homepage</p>
      </div>
      <button
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          formData.featured ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            formData.featured ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  </div>
</div>
```

---

## 🎨 **DESIGN SYSTEM:**

### **Color Palette**
```css
/* Primary Colors */
--primary-blue: #2563eb;      /* Blue 600 */
--primary-green: #16a34a;    /* Green 600 */
--primary-purple: #9333ea;   /* Purple 600 */
--primary-orange: #ea580c;   /* Orange 600 */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Status Colors */
--success-green: #10b981;
--warning-yellow: #f59e0b;
--error-red: #ef4444;
```

### **Typography**
```css
/* Font Family */
--font-family: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.875rem;    /* 14px */
--text-sm: 1rem;        /* 16px */
--text-base: 1.125rem;  /* 18px */
--text-lg: 1.25rem;     /* 20px */
--text-xl: 1.5rem;      /* 24px */
--text-2xl: 1.875rem;   /* 30px */
```

### **Spacing & Sizing**
```css
/* Border Radius */
--radius-sm: 0.5rem;     /* 8px */
--radius-md: 0.75rem;    /* 12px */
--radius-lg: 1rem;       /* 16px */
--radius-xl: 1.25rem;    /* 20px */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

---

## ⚡ **INTERAKSI & UX:**

### **1. Auto-Generation Features**
```javascript
// Auto-generate slug from title
useEffect(() => {
  if (formData.title) {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  }
}, [formData.title]);

// Auto-generate SKU
useEffect(() => {
  if (formData.title && formData.category) {
    const sku = `${formData.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setFormData(prev => ({ ...prev, sku }));
  }
}, [formData.title, formData.category]);
```

### **2. Drag & Drop Upload**
```javascript
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  
  const files = Array.from(e.dataTransfer.files);
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      // Process image
    }
  });
};
```

### **3. Dynamic Variants**
```javascript
const addVariant = (type: 'sizes' | 'colors') => {
  const newVariant = {
    id: Date.now().toString(),
    name: '',
    price: 0,
    value: '',
    inStock: true
  };
  
  setFormData(prev => ({
    ...prev,
    [type]: [...prev[type], newVariant]
  }));
};
```

### **4. Form Validation**
```javascript
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Product name is required';
  }
  
  if (!formData.category) {
    newErrors.category = 'Category is required';
  }
  
  if (!formData.price || parseFloat(formData.price) <= 0) {
    newErrors.price = 'Price must be greater than 0';
  }
  
  if (!formData.description.trim()) {
    newErrors.description = 'Description is required';
  }
  
  if (formData.images.length === 0) {
    newErrors.images = 'At least one image is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 🔄 **DATA OUTPUT STRUCTURE:**

### **Complete Product Object**
```javascript
const newProduct = {
  // Basic Info
  title: formData.title,
  slug: formData.slug,
  description: formData.description,
  category: formData.category,
  brand: formData.brand,
  
  // Pricing & Stock
  price: parseFloat(formData.price),
  discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
  stock: parseInt(formData.stock) || 0,
  sku: formData.sku,
  
  // Media
  images: formData.images,
  
  // Variants
  sizes: formData.sizes,
  colors: formData.colors,
  
  // Status
  status: formData.status,
  featured: formData.featured,
  
  // Specifications
  material: formData.material,
  care: formData.care,
  specifications: {
    material: formData.material,
    care: formData.care,
    ...formData.specifications
  },
  
  // Metadata
  badges: [],
  sellerId: 'current-seller',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
```

---

## 📱 **RESPONSIVE DESIGN:**

### **Mobile (< 768px)**
```css
/* Layout Changes */
.sidebar {
  display: none; /* Hide sidebar on mobile */
}

.main-content {
  padding: 1rem; /* Reduced padding */
}

.form-grid {
  grid-template-columns: 1fr; /* Single column */
}

.image-preview-grid {
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
}
```

### **Tablet (768px - 1024px)**
```css
/* Layout Changes */
.sidebar {
  width: 200px; /* Reduced sidebar width */
}

.form-grid {
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
}

.image-preview-grid {
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
}
```

### **Desktop (> 1024px)**
```css
/* Full Layout */
.sidebar {
  width: 256px; /* Full sidebar width */
}

.form-grid {
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
}

.image-preview-grid {
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
}
```

---

## 🎯 **KEY FEATURES IMPLEMENTED:**

### **✅ Professional Dashboard Layout**
- Top bar with navigation
- Sidebar with section indicators
- Clean card-based sections

### **✅ Complete Form Fields**
- Basic information (name, category, description)
- Pricing & stock (price, discount, SKU)
- Media upload (drag & drop)
- Product variants (sizes, colors)
- Status settings (draft/active, featured)

### **✅ Modern UX Interactions**
- Auto-generation (slug, SKU)
- Drag & drop image upload
- Dynamic variant management
- Real-time validation
- Success notifications

### **✅ Professional Design**
- Clean color palette
- Consistent spacing
- Smooth transitions
- Hover states
- Focus indicators

### **✅ Responsive Design**
- Mobile-friendly layout
- Tablet optimization
- Desktop experience

---

## 🚀 **INTEGRATION READY:**

### **API Integration**
```javascript
// Save to database
const response = await fetch('/api/seller-products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProduct)
});

if (response.ok) {
  // Success handling
  setShowSuccess(true);
  setTimeout(() => {
    router.push('/seller/products');
  }, 2000);
}
```

### **3-Database System**
- ✅ Products go to Pending Database (Database A)
- ✅ Auto-generates detail page URLs
- ✅ Status tracking (pending → approved)
- ✅ Integration with approval workflow

---

## 🎉 **RESULT:**

**HALAMAN ADD PRODUCT MODERN & PROFESIONAL SELESAI!**

- ✅ **Dashboard Layout**: Sidebar + Top bar navigation
- ✅ **Complete Form**: Semua field yang dibutuhkan
- ✅ **Modern Design**: Clean, professional, mirip Shopify/Stripe
- ✅ **Smart Features**: Auto-generation, drag & drop, validation
- ✅ **Responsive**: Mobile, tablet, desktop compatible
- ✅ **Integration Ready**: 3-Database system compatible

**Seller sekarang memiliki halaman add product yang profesional dan modern! 🎨✨**
