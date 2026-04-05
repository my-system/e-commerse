import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10 hero-background-animate" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-8 border border-white/20 hero-animate-badge hero-glow-border">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Koleksi Terbaru 2024
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight hero-animate-headline">
            Temukan Gaya
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Terbaik Anda
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed hero-animate-subheadline">
            Koleksi fashion premium dengan kualitas terbaik. Tampil percaya diri dengan gaya yang timeless dan modern.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center hero-animate-buttons">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              Belanja Sekarang
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-300">
              Lihat Produk
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto hero-animate-stats">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70 text-sm">Produk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70 text-sm">Pelanggan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-white/70 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-1 h-16 bg-white/30 rounded-full mx-auto">
            <div className="w-1 h-8 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
