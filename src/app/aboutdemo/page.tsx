"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone, Shield, Zap, Users, Star } from 'lucide-react';

export default function AboutDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DEMO E-Commerce</span>
          </div>
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Turn every conversation into a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                success story
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of e-commerce with our modern marketplace platform. 
              Connect sellers with customers through innovative technology and seamless user experience.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
              >
                Book a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Contact Sales
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Preview Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Preview Our Modern Marketplace
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how our platform transforms the e-commerce experience with cutting-edge design and powerful features
              </p>
            </div>

            {/* Home Preview Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -10 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative">
                {/* Mockup Frame */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Browser Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 max-w-md mx-4">
                      <div className="bg-white rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200">
                        http://localhost:3000/aboutdemo
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                  </div>

                  {/* Website Preview Content */}
                  <div className="bg-gradient-to-b from-white to-gray-50 p-8">
                    {/* Navbar Mockup */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                          <div className="w-32 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
                          <div className="hidden md:flex space-x-6">
                            <div className="w-16 h-2 bg-gray-300 rounded"></div>
                            <div className="w-20 h-2 bg-gray-300 rounded"></div>
                            <div className="w-12 h-2 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        </div>
                      </div>
                    </div>

                    {/* Hero Section Mockup */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 mb-8">
                      <div className="text-center">
                        <div className="w-48 h-12 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                        <div className="w-96 h-4 bg-gray-200 rounded-lg mx-auto mb-6"></div>
                        <div className="flex space-x-4 justify-center">
                          <div className="w-32 h-10 bg-blue-600 rounded-lg"></div>
                          <div className="w-32 h-10 bg-white border-2 border-gray-300 rounded-lg"></div>
                        </div>
                      </div>
                    </div>

                    {/* Product Cards Mockup */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                          <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="w-16 h-4 bg-blue-600 rounded mb-4"></div>
                          <div className="w-20 h-8 bg-blue-600 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center"
                >
                  <Star className="w-10 h-10 text-white" />
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-2xl shadow-lg flex items-center justify-center"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Enterprise-grade security with triple database backup system"
                },
                {
                  icon: Users,
                  title: "Multi-Vendor Support",
                  description: "Connect multiple sellers with customers seamlessly"
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Optimized performance with modern tech stack"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2, 
                    ease: "easeOut" 
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of successful sellers on our platform
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
