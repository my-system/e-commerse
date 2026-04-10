export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter kecuali huruf, angka, spasi, dan dash
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Hapus dash duplikat
    .replace(/^-+|-+$/g, ''); // Hapus dash di awal/akhir
}

export async function generateUniqueSlug(title: string, prisma: any): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  // Cek apakah slug sudah ada
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true }
    });
    
    if (!existing) {
      break;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
