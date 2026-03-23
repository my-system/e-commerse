"use client";

import { useState, useEffect } from 'react';
import { Star, Award, Truck, Shield, Mail, MapPin, Phone, Users, Package, TrendingUp, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/MobileNavigation';

interface Stat {
  value: string;
  label: string;
  icon: any;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
}

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats: Stat[] = [
    {
      value: '1000+',
      label: 'Pelanggan Puas',
      icon: Users
    },
    {
      value: '500+',
      label: 'Produk Berkualitas',
      icon: Package
    },
    {
      value: '4.8',
      label: 'Rating Rata-rata',
      icon: Star
    },
    {
      value: '100%',
      label: 'Kepuasan Terjamin',
      icon: Heart
    }
  ];

  const features: Feature[] = [
    {
      icon: Award,
      title: 'Produk Berkualitas',
      description: 'Kami hanya menjual produk dengan kualitas terbaik yang telah melalui proses quality control ketat.'
    },
    {
      icon: Truck,
      title: 'Pengiriman Cepat',
      description: 'Pengiriman cepat ke seluruh Indonesia dengan tracking real-time dan packing aman.'
    },
    {
      icon: Shield,
      title: 'Garansi Kepuasan',
      description: 'Jaminan uang kembali jika produk tidak sesuai dengan deskripsi atau cacat.'
    },
    {
      icon: TrendingUp,
      title: 'Harga Terjangkau',
      description: 'Harga kompetitif dengan kualitas premium, memberikan nilai terbaik untuk uang Anda.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Tentang Kami
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kami menghadirkan produk berkualitas dengan desain modern dan harga terbaik untuk kebutuhan Anda.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Trusted by 1000+ Customers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>
        </section>

        {/* Story Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Cerita Kami
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Kami adalah toko e-commerce yang berfokus pada produk fashion dan lifestyle modern. Sejak awal, kami berkomitmen untuk menghadirkan produk berkualitas tinggi dengan harga terjangkau dan pelayanan terbaik bagi pelanggan.
                  </p>
                  <p>
                    Didirikan pada tahun 2020, LUXE telah tumbuh menjadi salah satu tujuan belanja online terpercaya di Indonesia. Kami memahami bahwa setiap pelanggan mencari produk yang tidak hanya stylish tetapi juga nyaman dan tahan lama.
                  </p>
                  <p>
                    Tim kami terdiri dari para profesional yang berpengalaman di industri fashion dan e-commerce, siap membantu Anda menemukan produk yang sempurna untuk setiap kesempatan.
                  </p>
                </div>
              </div>
              
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                    alt="About LUXE"
                    className="rounded-2xl shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-3">
                      <Award className="h-8 w-8" />
                      <div>
                        <p className="text-2xl font-bold">4+</p>
                        <p className="text-sm">Tahun Pengalaman</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mengapa Memilih Kami?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Kami berkomitmen memberikan pengalaman belanja terbaik dengan keunggulan-keunggulan berikut:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Dibuat dengan Angka
              </h2>
              <p className="text-xl text-gray-600">
                Statistik kami berbicara tentang komitmen dan kualitas
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center group"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hubungi Kami
              </h2>
              <p className="text-xl text-gray-600">
                Kami siap membantu Anda dengan pertanyaan atau bantuan yang dibutuhkan
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-4">Kirimkan email untuk pertanyaan umum</p>
                <a 
                  href="mailto:support@luxe.com"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  support@luxe.com
                </a>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Telepon</h3>
                <p className="text-gray-600 mb-4">Hubungi kami untuk bantuan cepat</p>
                <a 
                  href="tel:+6281234567890"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  +62 812-3456-7890
                </a>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Alamat</h3>
                <p className="text-gray-600 mb-4">Kunjungi kantor kami</p>
                <p className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  Jakarta, Indonesia
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Belanja?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Temukan produk berkualitas dengan harga terbaik hanya di LUXE
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                Mulai Belanja
              </a>
              <a
                href="/account"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Buat Akun
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileNavigation>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
            <div className="relative px-4 text-center">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Tentang Kami
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Kami menghadirkan produk berkualitas dengan desain modern dan harga terbaik untuk kebutuhan Anda.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Trusted by 1000+ Customers</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-white">
            <div className="px-4">
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Cerita Kami
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Kami adalah toko e-commerce yang berfokus pada produk fashion dan lifestyle modern. Sejak awal, kami berkomitmen untuk menghadirkan produk berkualitas tinggi dengan harga terjangkau dan pelayanan terbaik bagi pelanggan.
                  </p>
                  <p>
                    Didirikan pada tahun 2020, LUXE telah tumbuh menjadi salah satu tujuan belanja online terpercaya di Indonesia. Kami memahami bahwa setiap pelanggan mencari produk yang tidak hanya stylish tetapi juga nyaman dan tahan lama.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gray-50">
            <div className="px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Mengapa Memilih Kami?
                </h2>
                <p className="text-lg text-gray-600">
                  Kami berkomitmen memberikan pengalaman belanja terbaik
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white">
            <div className="px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Dibuat dengan Angka
                </h2>
                <p className="text-lg text-gray-600">
                  Statistik kami berbicara tentang komitmen dan kualitas
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="text-center group"
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 font-medium text-sm">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16 bg-gray-50">
            <div className="px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Hubungi Kami
                </h2>
                <p className="text-lg text-gray-600">
                  Kami siap membantu Anda dengan pertanyaan atau bantuan
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 mb-4 text-sm">Kirimkan email untuk pertanyaan umum</p>
                  <a 
                    href="mailto:support@luxe.com"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    support@luxe.com
                  </a>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Telepon</h3>
                  <p className="text-gray-600 mb-4 text-sm">Hubungi kami untuk bantuan cepat</p>
                  <a 
                    href="tel:+6281234567890"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="px-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Siap Memulai Belanja?
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Temukan produk berkualitas dengan harga terbaik hanya di LUXE
              </p>
              <div className="flex flex-col gap-4 justify-center">
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  Mulai Belanja
                </a>
                <a
                  href="/account"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  Buat Akun
                </a>
              </div>
            </div>
          </section>
        </MobileNavigation>
      </div>
    </div>
  );
}
