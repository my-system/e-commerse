import { testimonials } from '@/data/testimonials';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kepercayaan dan kepuasan pelanggan adalah prioritas utama kami
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-blue-600 opacity-20" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Comment */}
              <p className={`text-gray-700 mb-6 leading-relaxed ${
                index === 0 ? 'text-lg' : 'text-sm'
              }`}>
                {testimonial.comment}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Verified Customer
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-white/80">Kepuasan Pelanggan</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100K+</div>
              <div className="text-white/80">Pengiriman Sukses</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-white/80">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
