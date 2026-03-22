import { Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-products' | 'no-search-results' | 'filter-no-results';
  onReset?: () => void;
  searchQuery?: string;
}

export default function EmptyState({ type, onReset, searchQuery }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-products':
        return {
          icon: Search,
          title: 'Belum Ada Produk',
          description: 'Maaf, belum ada produk yang tersedia saat ini. Silakan kembali lagi nanti.',
        };
      
      case 'no-search-results':
        return {
          icon: Search,
          title: 'Produk Tidak Ditemukan',
          description: `Tidak ada produk yang ditemukan untuk pencarian "${searchQuery}". Coba kata kunci lain.`,
        };
      
      case 'filter-no-results':
        return {
          icon: Search,
          title: 'Tidak Ada Produk',
          description: 'Tidak ada produk yang sesuai dengan filter yang dipilih. Coba ubah filter atau reset filter.',
        };
      
      default:
        return {
          icon: Search,
          title: 'Produk Tidak Ditemukan',
          description: 'Maaf, produk yang Anda cari tidak ditemukan.',
        };
    }
  };

  const { icon: Icon, title, description } = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        {description}
      </p>
      
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filter
        </button>
      )}
    </div>
  );
}
