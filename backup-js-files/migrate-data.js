// Script untuk migrasi data dari localStorage ke database
const products = [
  {
    id: '1',
    title: 'Test Product 1',
    price: 299900,
    category: 'electronics',
    description: 'Test description with bullet points:\n• Feature 1\n• Feature 2\n• Feature 3',
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: '["/api/placeholder/600/800/test"]',
    material: 'Premium Material',
    care: 'Machine wash cold',
    status: 'pending',
    badges: '[]',
    sellerId: 'mock-seller-id',
    sizes: [
      { id: 's1', name: 'S', value: 'S', inStock: true },
      { id: 'm1', name: 'M', value: 'M', inStock: true },
      { id: 'l1', name: 'L', value: 'L', inStock: false }
    ],
    colors: [
      { id: 'c1', name: 'Black', value: '#000000', inStock: true },
      { id: 'c2', name: 'White', value: '#FFFFFF', inStock: true }
    ],
    specifications: {
      'Screen Size': '6.1 inches',
      'Battery': '3000mAh',
      'Camera': '48MP'
    }
  },
  {
    id: '2',
    title: 'Test Product 2',
    price: 499900,
    category: 'fashion',
    description: 'Another test product with features:\n• Premium quality fabric\n• Comfortable fit\n• Stylish design',
    featured: true,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: '["/api/placeholder/600/800/test2"]',
    material: 'Cotton',
    care: 'Machine wash',
    status: 'approved',
    badges: '["HOT"]',
    sellerId: 'mock-seller-id',
    sizes: [
      { id: 'xs2', name: 'XS', value: 'XS', inStock: true },
      { id: 's2', name: 'S', value: 'S', inStock: true },
      { id: 'm2', name: 'M', value: 'M', inStock: true },
      { id: 'l2', name: 'L', value: 'L', inStock: true },
      { id: 'xl2', name: 'XL', value: 'XL', inStock: false }
    ],
    colors: [
      { id: 'c3', name: 'Blue', value: '#0000FF', inStock: true },
      { id: 'c4', name: 'Red', value: '#FF0000', inStock: true }
    ],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular Fit',
      'Care': 'Machine wash cold'
    }
  },
  {
    id: '1774720951361',
    title: 'baju',
    price: 200000,
    category: 'fashion',
    description: 'baju',
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: '["/uploads/products/1774720882624-d3454a98d5m.jpeg","/uploads/products/1774720882627-i689toz0dn9.jpeg","/uploads/products/1774720882629-ech4hqgpu7.jpeg"]',
    status: 'approved',
    badges: '[]',
    sellerId: 'mock-seller-id',
    sizes: [],
    colors: [],
    specifications: {}
  }
];

console.log('Copy dan paste ini ke browser console di seller products page:');
console.log('fetch("/api/test-seller-products", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(' + JSON.stringify(products[0]) + ')});');
console.log('fetch("/api/test-seller-products", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(' + JSON.stringify(products[1]) + ')});');
console.log('fetch("/api/test-seller-products", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(' + JSON.stringify(products[2]) + ')});');
