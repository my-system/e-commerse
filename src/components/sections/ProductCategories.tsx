"use client";

import { categories } from '@/data/categories';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useIntersectionObserverMultiple } from '@/hooks/useIntersectionObserver';

export default function ProductCategories() {
  const { setRef } = useIntersectionObserverMultiple({ threshold: 0.1 });
  return (
    <section id="categories" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={setRef('section-header')}
          className="text-center mb-16 scroll-animate scroll-animate-fade-up"
          data-scroll-id="section-header"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jelajahi Kategori
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan produk yang sesuai dengan gaya dan kebutuhan Anda
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer bg-white scroll-animate scroll-animate-fade-up scroll-animate-scale"
              ref={setRef(`category-${index}`)}
              data-scroll-id={`category-${index}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Category Image */}
              <div className="relative h-72 overflow-hidden">
                <OptimizedImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                  priority={false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                
                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-white/90 text-sm mb-3">
                      {category.description}
                    </p>
                  )}
                  {category.subcategories && (
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 3).map((sub, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                          +{category.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hover Effect Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div 
          ref={setRef('view-all-button')}
          className="text-center mt-16 scroll-animate scroll-animate-fade-up"
          data-scroll-id="view-all-button"
        >
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Lihat Semua Kategori
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
