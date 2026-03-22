export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  subcategories?: string[];
  icon?: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Fashion",
    slug: "fashion",
    image: "/api/placeholder/300/400",
    description: "Pakaian dan aksesoris modern untuk gaya hidup Anda",
    subcategories: ["Pria", "Wanita", "Aksesoris"],
    icon: "👔"
  },
  {
    id: "2", 
    name: "Sepatu",
    slug: "shoes",
    image: "/api/placeholder/300/400",
    description: "Koleksi sepatu nyaman dan stylish untuk setiap kesempatan",
    subcategories: ["Sneakers", "Formal", "Sandal", "Olahraga"],
    icon: "👟"
  },
  {
    id: "3",
    name: "Aksesoris",
    slug: "accessories",
    image: "/api/placeholder/300/400", 
    description: "Aksesoris premium untuk melengkapi penampilan Anda",
    subcategories: ["Tas", "Jam Tangan", "Kacamata", "Topi"],
    icon: "👜"
  },
  {
    id: "4",
    name: "Tas",
    slug: "bags",
    image: "/api/placeholder/300/400",
    description: "Tas fungsional dan modis untuk kebutuhan sehari-hari",
    subcategories: ["Backpack", "Handbag", "Tas Laptop", "Tas Travel"],
    icon: "🎒"
  },
  {
    id: "5",
    name: "Perhiasan",
    slug: "jewelry",
    image: "/api/placeholder/300/400",
    description: "Perhiasan elegan untuk sentuhan kemewahan",
    subcategories: ["Kalung", "Gelang", "Cincin", "Anting"],
    icon: "💍"
  },
  {
    id: "6",
    name: "Elektronik",
    slug: "electronics",
    image: "/api/placeholder/300/400",
    description: "Gadget dan elektronik modern untuk gaya hidup digital",
    subcategories: ["Smartphone", "Laptop", "Tablet", "Aksesoris Elektronik"],
    icon: "📱"
  }
];
