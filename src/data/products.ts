export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  featured?: boolean;
  variants?: {
    sizes?: ProductVariant[];
    colors?: ProductVariant[];
  };
  specifications?: Record<string, string>;
  material?: string;
  care?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
}

// Validasi dan sanitasi data produk
const validateProduct = (product: any): Product => {
  return {
    ...product,
    images: Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [`/api/placeholder/600/800/${product.title.toLowerCase().replace(/\s+/g, '-')}`]
  };
};

export const products: Product[] = [
  {
    id: "1",
    title: "Classic White T-Shirt",
    price: 299900,
    images: [
      "/api/placeholder/600/800/tshirt",
      "/api/placeholder/600/800/tshirt-2",
      "/api/placeholder/600/800/tshirt-3",
      "/api/placeholder/600/800/tshirt-4"
    ],
    category: "fashion",
    description: "Premium quality cotton t-shirt with perfect fit. Made from 100% organic cotton with a comfortable regular fit.",
    featured: true,
    variants: {
      sizes: [
        { id: "s", name: "Small", value: "S", inStock: true },
        { id: "m", name: "Medium", value: "M", inStock: true },
        { id: "l", name: "Large", value: "L", inStock: true },
        { id: "xl", name: "X-Large", value: "XL", inStock: false }
      ],
      colors: [
        { id: "white", name: "White", value: "#FFFFFF", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "gray", name: "Gray", value: "#808080", inStock: true }
      ]
    },
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular Fit",
      "Neckline": "Round Neck",
      "Sleeve": "Short Sleeve",
      "Care": "Machine washable"
    },
    material: "100% Organic Cotton",
    care: "Machine wash cold, tumble dry low",
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: "2", 
    title: "Denim Jacket",
    price: 899900,
    images: [
      "/api/placeholder/600/800/denim-jacket",
      "/api/placeholder/600/800/denim-jacket-2",
      "/api/placeholder/600/800/denim-jacket-3"
    ],
    category: "fashion",
    description: "Classic denim jacket with modern cut. Perfect layering piece for any season.",
    featured: true,
    variants: {
      sizes: [
        { id: "s", name: "Small", value: "S", inStock: true },
        { id: "m", name: "Medium", value: "M", inStock: true },
        { id: "l", name: "Large", value: "L", inStock: true }
      ],
      colors: [
        { id: "blue", name: "Classic Blue", value: "#1E3A8A", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true }
      ]
    },
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Regular Fit",
      "Closure": "Button Front",
      "Pockets": "4 Pockets",
      "Care": "Dry clean recommended"
    },
    material: "100% Cotton Denim",
    care: "Dry clean or hand wash cold",
    inStock: true,
    rating: 4.7,
    reviews: 89
  },
  {
    id: "3",
    title: "Leather Handbag",
    price: 1299000,
    images: [
      "/api/placeholder/600/800/leather-bag",
      "/api/placeholder/600/800/leather-bag-2",
      "/api/placeholder/600/800/leather-bag-3"
    ],
    category: "accessories",
    description: "Genuine leather handbag with elegant design. Perfect for both casual and formal occasions.",
    featured: true,
    variants: {
      colors: [
        { id: "brown", name: "Brown", value: "#8B4513", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "tan", name: "Tan", value: "#D2B48C", inStock: true }
      ]
    },
    specifications: {
      "Material": "Genuine Leather",
      "Dimensions": "30cm x 20cm x 10cm",
      "Closure": "Zipper",
      "Strap": "Adjustable",
      "Pockets": "2 Interior pockets"
    },
    material: "Genuine Leather",
    care: "Leather conditioner recommended",
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: "4",
    title: "Running Shoes",
    price: 799900,
    images: [
      "/api/placeholder/600/800/running-shoes",
      "/api/placeholder/600/800/running-shoes-2",
      "/api/placeholder/600/800/running-shoes-3"
    ],
    category: "shoes",
    description: "Comfortable running shoes for all terrains. Advanced cushioning technology for maximum comfort.",
    featured: true,
    variants: {
      sizes: [
        { id: "38", name: "EU 38", value: "38", inStock: true },
        { id: "39", name: "EU 39", value: "39", inStock: true },
        { id: "40", name: "EU 40", value: "40", inStock: true },
        { id: "41", name: "EU 41", value: "41", inStock: true },
        { id: "42", name: "EU 42", value: "42", inStock: true }
      ],
      colors: [
        { id: "white", name: "White", value: "#FFFFFF", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "blue", name: "Blue", value: "#0000FF", inStock: true }
      ]
    },
    specifications: {
      "Material": "Mesh Upper, Rubber Sole",
      "Technology": "Air Cushioning",
      "Weight": "280g",
      "Drop": "8mm",
      "Care": "Spot clean only"
    },
    material: "Mesh Upper, Rubber Sole",
    care: "Spot clean with damp cloth",
    inStock: true,
    rating: 4.6,
    reviews: 203
  },
  {
    id: "5",
    title: "Sunglasses",
    price: 499900,
    images: [
      "/api/placeholder/600/800/sunglasses",
      "/api/placeholder/600/800/sunglasses-2"
    ],
    category: "accessories",
    description: "UV protection sunglasses with stylish frame. 100% UV protection with polarized lenses.",
    featured: true,
    variants: {
      colors: [
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "tortoise", name: "Tortoise", value: "#8B4513", inStock: true },
        { id: "gold", name: "Gold", value: "#FFD700", inStock: true }
      ]
    },
    specifications: {
      "Lens": "Polarized UV400",
      "Frame": "Acetate",
      "Protection": "100% UV Protection",
      "Include": "Protective case",
      "Care": "Microfiber cloth included"
    },
    material: "Acetate Frame, Polycarbonate Lens",
    care: "Clean with microfiber cloth",
    inStock: true,
    rating: 4.4,
    reviews: 67
  },
  {
    id: "6",
    title: "Wool Sweater",
    price: 699900,
    images: [
      "/api/placeholder/600/800/wool-sweater",
      "/api/placeholder/600/800/wool-sweater-2"
    ],
    category: "fashion", 
    description: "Cozy wool sweater perfect for winter. Made from premium merino wool.",
    featured: true,
    variants: {
      sizes: [
        { id: "s", name: "Small", value: "S", inStock: true },
        { id: "m", name: "Medium", value: "M", inStock: true },
        { id: "l", name: "Large", value: "L", inStock: true }
      ],
      colors: [
        { id: "navy", name: "Navy", value: "#000080", inStock: true },
        { id: "gray", name: "Gray", value: "#808080", inStock: true },
        { id: "cream", name: "Cream", value: "#FFFDD0", inStock: true }
      ]
    },
    specifications: {
      "Material": "100% Merino Wool",
      "Fit": "Regular Fit",
      "Neckline": "Crew Neck",
      "Length": "Hip Length",
      "Care": "Dry clean only"
    },
    material: "100% Merino Wool",
    care: "Dry clean only",
    inStock: true,
    rating: 4.7,
    reviews: 94
  },
  {
    id: "7",
    title: "Canvas Backpack",
    price: 399900,
    images: [
      "/api/placeholder/600/800/backpack",
      "/api/placeholder/600/800/backpack-2"
    ],
    category: "accessories",
    description: "Durable canvas backpack for daily use. Multiple compartments for organization.",
    featured: true,
    variants: {
      colors: [
        { id: "khaki", name: "Khaki", value: "#C3B091", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "navy", name: "Navy", value: "#000080", inStock: true }
      ]
    },
    specifications: {
      "Material": "Canvas",
      "Dimensions": "45cm x 30cm x 15cm",
      "Compartments": "3 Compartments",
      "Laptop Sleeve": "Up to 15\"",
      "Care": "Spot clean"
    },
    material: "Heavy-duty Canvas",
    care: "Spot clean with damp cloth",
    inStock: true,
    rating: 4.3,
    reviews: 112
  },
  {
    id: "8",
    title: "Sports Watch",
    price: 1599000,
    images: [
      "/api/placeholder/600/800/sports-watch",
      "/api/placeholder/600/800/sports-watch-2"
    ],
    category: "accessories",
    description: "Multi-function sports watch with heart rate monitor. Track your fitness goals.",
    featured: true,
    variants: {
      colors: [
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "blue", name: "Blue", value: "#0000FF", inStock: true },
        { id: "red", name: "Red", value: "#FF0000", inStock: true }
      ]
    },
    specifications: {
      "Display": "1.4\" Color Display",
      "Battery": "7-day battery life",
      "Water Resistance": "5ATM",
      "Features": "Heart rate, GPS, Sleep tracking",
      "Compatibility": "iOS & Android"
    },
    material: "Silicone Strap, Aluminum Case",
    care: "Clean with soft cloth",
    inStock: true,
    rating: 4.5,
    reviews: 178
  },
  {
    id: "9",
    title: "Slim Fit Jeans",
    price: 599900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "fashion",
    description: "Modern slim fit jeans with stretch fabric. Comfortable and stylish.",
    featured: false,
    variants: {
      sizes: [
        { id: "28", name: "28", value: "28", inStock: true },
        { id: "30", name: "30", value: "30", inStock: true },
        { id: "32", name: "32", value: "32", inStock: true },
        { id: "34", name: "34", value: "34", inStock: true }
      ],
      colors: [
        { id: "blue", name: "Classic Blue", value: "#1E3A8A", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true }
      ]
    },
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Slim Fit",
      "Rise": "Mid Rise",
      "Closure": "Button Fly",
      "Care": "Machine wash cold"
    },
    material: "98% Cotton, 2% Elastane",
    care: "Machine wash cold, inside out",
    inStock: true,
    rating: 4.4,
    reviews: 145
  },
  {
    id: "10",
    title: "Casual Loafers",
    price: 699900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "shoes",
    description: "Comfortable loafers for everyday wear. Classic design with modern comfort.",
    featured: false,
    variants: {
      sizes: [
        { id: "38", name: "EU 38", value: "38", inStock: true },
        { id: "39", name: "EU 39", value: "39", inStock: true },
        { id: "40", name: "EU 40", value: "40", inStock: true },
        { id: "41", name: "EU 41", value: "41", inStock: true },
        { id: "42", name: "EU 42", value: "42", inStock: true }
      ],
      colors: [
        { id: "brown", name: "Brown", value: "#8B4513", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "tan", name: "Tan", value: "#D2B48C", inStock: true }
      ]
    },
    specifications: {
      "Material": "Genuine Leather",
      "Sole": "Rubber",
      "Closure": "Slip-on",
      "Lining": "Leather",
      "Care": "Leather polish recommended"
    },
    material: "Genuine Leather",
    care: "Leather conditioner and polish",
    inStock: true,
    rating: 4.6,
    reviews: 87
  },
  {
    id: "11",
    title: "Crossbody Bag",
    price: 449900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "bags",
    description: "Stylish crossbody bag for essentials. Perfect for hands-free convenience.",
    featured: false,
    variants: {
      colors: [
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "brown", name: "Brown", value: "#8B4513", inStock: true },
        { id: "red", name: "Red", value: "#FF0000", inStock: true }
      ]
    },
    specifications: {
      "Material": "Faux Leather",
      "Dimensions": "25cm x 15cm x 5cm",
      "Strap": "Adjustable",
      "Closure": "Magnetic",
      "Pockets": "1 Interior pocket"
    },
    material: "Faux Leather",
    care: "Wipe with damp cloth",
    inStock: true,
    rating: 4.2,
    reviews: 56
  },
  {
    id: "12",
    title: "Silver Necklace",
    price: 899900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "jewelry",
    description: "Elegant silver necklace with pendant. Timeless piece for any occasion.",
    featured: false,
    variants: {
      colors: [
        { id: "silver", name: "Silver", value: "#C0C0C0", inStock: true },
        { id: "gold", name: "Gold Plated", value: "#FFD700", inStock: true }
      ]
    },
    specifications: {
      "Material": "925 Sterling Silver",
      "Length": "45cm",
      "Pendant": "1.5cm",
      "Clasp": "Lobster Clasp",
      "Care": "Polish with silver cloth"
    },
    material: "925 Sterling Silver",
    care: "Polish with silver cleaning cloth",
    inStock: true,
    rating: 4.8,
    reviews: 93
  },
  {
    id: "13",
    title: "Wireless Earbuds",
    price: 1299000,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "electronics",
    description: "Premium wireless earbuds with noise cancellation. Superior sound quality.",
    featured: false,
    variants: {
      colors: [
        { id: "white", name: "White", value: "#FFFFFF", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true }
      ]
    },
    specifications: {
      "Connectivity": "Bluetooth 5.0",
      "Battery": "6 hours earbuds, 24 hours case",
      "Features": "Active Noise Cancellation",
      "Water Resistance": "IPX4",
      "Include": "Multiple ear tips"
    },
    material: "Plastic, Silicone",
    care: "Clean with dry cloth",
    inStock: true,
    rating: 4.5,
    reviews: 234
  },
  {
    id: "14",
    title: "Polo Shirt",
    price: 349900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "fashion",
    description: "Classic polo shirt with embroidered logo. Smart casual essential.",
    featured: false,
    variants: {
      sizes: [
        { id: "s", name: "Small", value: "S", inStock: true },
        { id: "m", name: "Medium", value: "M", inStock: true },
        { id: "l", name: "Large", value: "L", inStock: true },
        { id: "xl", name: "X-Large", value: "XL", inStock: true }
      ],
      colors: [
        { id: "white", name: "White", value: "#FFFFFF", inStock: true },
        { id: "navy", name: "Navy", value: "#000080", inStock: true },
        { id: "gray", name: "Gray", value: "#808080", inStock: true }
      ]
    },
    specifications: {
      "Material": "100% Cotton Piqué",
      "Fit": "Regular Fit",
      "Collar": "Ribbed Collar",
      "Sleeve": "Short Sleeve",
      "Care": "Machine wash warm"
    },
    material: "100% Cotton Piqué",
    care: "Machine wash warm, tumble dry low",
    inStock: true,
    rating: 4.3,
    reviews: 167
  },
  {
    id: "15",
    title: "High Top Sneakers",
    price: 899900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "shoes",
    description: "Trendy high top sneakers with platform sole. Fashion-forward comfort.",
    featured: false,
    variants: {
      sizes: [
        { id: "36", name: "EU 36", value: "36", inStock: true },
        { id: "37", name: "EU 37", value: "37", inStock: true },
        { id: "38", name: "EU 38", value: "38", inStock: true },
        { id: "39", name: "EU 39", value: "39", inStock: true },
        { id: "40", name: "EU 40", value: "40", inStock: true }
      ],
      colors: [
        { id: "white", name: "White", value: "#FFFFFF", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "pink", name: "Pink", value: "#FFC0CB", inStock: true }
      ]
    },
    specifications: {
      "Material": "Leather & Textile",
      "Sole": "Rubber",
      "Platform": "3cm",
      "Closure": "Lace-up",
      "Care": "Spot clean"
    },
    material: "Leather Upper, Textile Details",
    care: "Spot clean with damp cloth",
    inStock: true,
    rating: 4.4,
    reviews: 98
  },
  {
    id: "16",
    title: "Leather Wallet",
    price: 299900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "accessories",
    description: "Genuine leather bifold wallet. Classic design with modern functionality.",
    featured: false,
    variants: {
      colors: [
        { id: "brown", name: "Brown", value: "#8B4513", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true }
      ]
    },
    specifications: {
      "Material": "Genuine Leather",
      "Card Slots": "8 Card slots",
      "Bill Compartment": "2",
      "Coin Pocket": "1",
      "RFID": "RFID Blocking"
    },
    material: "Genuine Leather",
    care: "Leather conditioner recommended",
    inStock: true,
    rating: 4.6,
    reviews: 124
  },
  {
    id: "17",
    title: "Smart Watch",
    price: 2499000,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "electronics",
    description: "Advanced smartwatch with health tracking. Your wellness companion.",
    featured: false,
    variants: {
      colors: [
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "silver", name: "Silver", value: "#C0C0C0", inStock: true },
        { id: "rose", name: "Rose Gold", value: "#B76E79", inStock: true }
      ]
    },
    specifications: {
      "Display": "1.69\" AMOLED",
      "Battery": "14-day battery life",
      "Water Resistance": "5ATM",
      "Health": "Heart rate, SpO2, Stress",
      "GPS": "Built-in GPS"
    },
    material: "Aluminum, Silicone",
    care: "Clean with soft cloth",
    inStock: true,
    rating: 4.7,
    reviews: 189
  },
  {
    id: "18",
    title: "Tote Bag",
    price: 599900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "bags",
    description: "Spacious tote bag for work and shopping. Versatile and stylish.",
    featured: false,
    variants: {
      colors: [
        { id: "beige", name: "Beige", value: "#F5F5DC", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true },
        { id: "brown", name: "Brown", value: "#8B4513", inStock: true }
      ]
    },
    specifications: {
      "Material": "Canvas & Leather",
      "Dimensions": "40cm x 35cm x 10cm",
      "Compartments": "2 Main compartments",
      "Laptop Sleeve": "Up to 13\"",
      "Strap": "Leather handles"
    },
    material: "Canvas Body, Leather Trim",
    care: "Spot clean only",
    inStock: true,
    rating: 4.5,
    reviews: 78
  },
  {
    id: "19",
    title: "Gold Bracelet",
    price: 1999000,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "jewelry",
    description: "Elegant gold bracelet with classic design. Perfect for special occasions.",
    featured: false,
    variants: {
      colors: [
        { id: "gold", name: "Yellow Gold", value: "#FFD700", inStock: true },
        { id: "white", name: "White Gold", value: "#F8F8FF", inStock: true }
      ]
    },
    specifications: {
      "Material": "18K Gold Plated",
      "Length": "18cm",
      "Width": "5mm",
      "Clasp": "Box Clasp",
      "Care": "Polish with jewelry cloth"
    },
    material: "18K Gold Plated Brass",
    care: "Polish with jewelry cleaning cloth",
    inStock: true,
    rating: 4.9,
    reviews: 45
  },
  {
    id: "20",
    title: "Hoodie",
    price: 499900,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop"
    ],
    category: "fashion",
    description: "Comfortable hoodie with kangaroo pocket. Essential casual wear.",
    featured: false,
    variants: {
      sizes: [
        { id: "s", name: "Small", value: "S", inStock: true },
        { id: "m", name: "Medium", value: "M", inStock: true },
        { id: "l", name: "Large", value: "L", inStock: true },
        { id: "xl", name: "X-Large", value: "XL", inStock: true }
      ],
      colors: [
        { id: "gray", name: "Gray", value: "#808080", inStock: true },
        { id: "navy", name: "Navy", value: "#000080", inStock: true },
        { id: "black", name: "Black", value: "#000000", inStock: true }
      ]
    },
    specifications: {
      "Material": "80% Cotton, 20% Polyester",
      "Fit": "Regular Fit",
      "Hood": "Drawstring Hood",
      "Pockets": "Kangaroo Pocket",
      "Care": "Machine wash cold"
    },
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    inStock: true,
    rating: 4.4,
    reviews: 156
  }
];

// Export fungsi untuk mendapatkan produk yang valid
export const getValidProducts = (): Product[] => {
  return products.map(product => validateProduct(product));
};
