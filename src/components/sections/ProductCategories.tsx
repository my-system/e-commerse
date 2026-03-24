import { categories } from '@/data/categories';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function ProductCategories() {
  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Jelajahi Kategori
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan produk yang sesuai dengan gaya dan kebutuhan Anda
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Category Image */}
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                  priority={false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-white/90 text-sm">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300">
            Lihat Semua Kategori
          </button>
        </div>
      </div>
    </section>
  );
}
