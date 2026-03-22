export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    comment: "Kualitas produk sangat bagus! Pengiriman cepat dan packing rapi. Pasti akan order lagi.",
    rating: 5,
    avatar: "/api/placeholder/50/50"
  },
  {
    id: "2", 
    name: "Michael Chen",
    comment: "Toko online terpercaya dengan produk berkualitas. Customer service sangat membantu.",
    rating: 5,
    avatar: "/api/placeholder/50/50"
  },
  {
    id: "3",
    name: "Amanda Putri",
    comment: "Sangat puas berbelanja di sini! Produk sesuai deskripsi dan harga terjangkau.",
    rating: 5,
    avatar: "/api/placeholder/50/50"
  },
  {
    id: "4",
    name: "David Wijaya", 
    comment: "Pengalaman berbelanja yang menyenangkan. Website mudah digunakan dan proses checkout cepat.",
    rating: 5,
    avatar: "/api/placeholder/50/50"
  }
];
