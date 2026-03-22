"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, ShoppingBag, Package, CreditCard, Truck, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  products?: any[];
}

interface ChatbotProps {
  className?: string;
}

export default function AIChatbot({ className = "" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addBotMessage("👋 Halo! Saya asisten virtual kamu. Ada yang bisa saya bantu?", 'greeting');
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const addBotMessage = (text: string, intent?: string, products?: any[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      intent,
      products
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const processUserMessage = async (userInput: string) => {
    const input = userInput.toLowerCase().trim();
    
    // Intent detection and response generation
    let response = '';
    let intent = '';
    let products: any[] = [];

    // Greeting
    if (input.match(/^(halo|hai|hello|hi|selamat|pagi|siang|sore|malam)/)) {
      response = "👋 Halo! Selamat datang di toko kami. Ada yang bisa saya bantu hari ini?";
      intent = 'greeting';
    }
    // Help
    else if (input.match(/^(bantu|help|bantuan|cara|bagaimana)/)) {
      response = "🤝 Saya bisa membantu kamu dengan:\n\n• 📦 Mencari produk\n• 🛍️ Rekomendasi produk\n• 📋 Info cara belanja\n• 🚚 Info pengiriman\n• 💳 Info pembayaran\n• 📞 Hubungi customer service\n\nApa yang kamu butuhkan?";
      intent = 'help';
    }
    // Product search
    else if (input.match(/^(cari|cariin|ada|tampilin|lihat)/) || input.includes('produk')) {
      response = "🔍 Baik, saya bantu cari produk. Kamu cari produk apa?\n\nContoh:\n• \"Cari kaos\"\n• \"Ada jaket?\"\n• \"Lihat sepatu\"\n• \"Produk fashion\"";
      intent = 'product_search';
    }
    // Categories
    else if (input.includes('kategori') || input.includes('jenis')) {
      response = "📂 Kami punya beberapa kategori produk:\n\n• 👕 **Fashion** - Pakaian, aksesoris\n• 👟 **Footwear** - Sepatu, sandal\n• 🎒 **Bags** - Tas, ransel\n• ⌚ **Accessories** - Jam, kacamata\n\nKategori mana yang kamu minati?";
      intent = 'categories';
    }
    // Shipping
    else if (input.includes('kirim') || input.includes('pengiriman') || input.includes('ongkir')) {
      response = "🚚 Info Pengiriman:\n\n• **Reguler** - 3-5 hari kerja (Rp 15.000)\n• **Express** - 1-2 hari kerja (Rp 25.000)\n• **Gratis Ongkir** untuk pembelian Rp 500.000+\n\nKami kirim ke seluruh Indonesia!";
      intent = 'shipping';
    }
    // Payment
    else if (input.includes('bayar') || input.includes('pembayaran') || input.includes('transfer')) {
      response = "💳 Metode Pembayaran:\n\n• 💳 Kartu Kredit (Visa, Mastercard)\n• 📱 E-Wallet (GoPay, OVO, Dana)\n• 🏦 Transfer Bank (BCA, Mandiri, BNI)\n• 💵 COD (Bayar di tempat)\n\nSemua pembayaran aman dan terenkripsi!";
      intent = 'payment';
    }
    // Order status
    else if (input.includes('pesanan') || input.includes('status') || input.includes('track')) {
      response = "📦 Cek Status Pesanan:\n\nUntuk cek status pesanan, kamu bisa:\n1. Masuk ke akun kamu\n2. Klik menu \"Pesanan Saya\"\n3. Lihat status dan tracking number\n\nAtau bilang nomor pesanan kamu, saya bantu cek!";
      intent = 'order_status';
    }
    // Return/refund
    else if (input.includes('kembali') || input.includes('refund') || input.includes('tukar')) {
      response = "🔄 Kebijakan Pengembalian:\n\n• 7 hari sejak barang diterima\n• Barang dalam kondisi baik\n• Label dan tag masih lengkap\n• Proses refund 3-5 hari kerja\n\nAda masalah dengan pesanan kamu?";
      intent = 'return';
    }
    // Contact
    else if (input.includes('hubungi') || input.includes('kontak') || input.includes('cs')) {
      response = "📞 Hubungi Kami:\n\n• 📧 Email: support@tokokamu.com\n• 📱 WhatsApp: 0812-3456-7890\n• 🕐 Jam: 09:00 - 21:00 WIB\n• 💬 Live chat: Senin - Sabtu\n\nKami siap membantu kamu!";
      intent = 'contact';
    }
    // Promotions
    else if (input.includes('promo') || input.includes('diskon') || input.includes('sale')) {
      response = "🎉 Promo Saat Ini:\n\n• 💰 **Flash Sale** - Diskon 50% selected items\n• 🚚 **Gratis Ongkir** - Min. belanja Rp 500.000\n• 🎁 **Bundle Deal** - Beli 2 gratis 1\n• 💳 **Cashback** - 10% untuk pembayaran E-Wallet\n\nPromo berlaku sampai akhir bulan!";
      intent = 'promotions';
    }
    // Size guide
    else if (input.includes('ukuran') || input.includes('size')) {
      response = "📏 Panduan Ukuran:\n\n**Baju/Kaos:**\n• S: Lebar 48cm, Panjang 68cm\n• M: Lebar 50cm, Panjang 70cm\n• L: Lebar 52cm, Panjang 72cm\n• XL: Lebar 54cm, Panjang 74cm\n\n**Celana:**\n• 28: Pinggang 72cm\n• 30: Pinggang 76cm\n• 32: Pinggang 80cm\n• 34: Pinggang 84cm\n\nButuh bantuan ukuran spesifik?";
      intent = 'size_guide';
    }
    // Default response
    else {
      response = "🤔 Maaf, saya belum paham. Coba tanya dengan kata lain ya!\n\nContoh pertanyaan:\n• \"Cari kaos\"\n• \"Ongkir berapa?\"\n• \"Ada promo?\"\n• \"Cara bayar\"\n• \"Hubungi CS\"\n\nAtau ketik \"help\" untuk bantuan lengkap!";
      intent = 'unknown';
    }

    // Simulate bot typing delay
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    addBotMessage(response, intent, products);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');
    addUserMessage(message);
    
    // Process the message
    await processUserMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    addBotMessage("👋 Halo! Saya asisten virtual kamu. Ada yang bisa saya bantu?", 'greeting');
  };

  // Quick action buttons
  const quickActions = [
    { icon: ShoppingBag, label: "Cari Produk", intent: "Cari produk" },
    { icon: Package, label: "Cek Pesanan", intent: "Cek status pesanan" },
    { icon: CreditCard, label: "Cara Bayar", intent: "Cara pembayaran" },
    { icon: Truck, label: "Info Ongkir", intent: "Info pengiriman" },
    { icon: HelpCircle, label: "Bantuan", intent: "Bantuan" },
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 group"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full animate-pulse"></span>
          <span className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Butuh bantuan?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-2xl w-96 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[600px]'
        }`}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[440px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="flex gap-2 overflow-x-auto">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          setInputValue(action.intent);
                          inputRef.current?.focus();
                        }}
                        className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-w-[60px] flex-shrink-0"
                      >
                        <action.icon className="h-4 w-4 text-gray-600" />
                        <span className="text-xs text-gray-600">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
