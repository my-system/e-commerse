"use client";

import { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  // Ensure we have at least one image, use placeholder if empty
  const safeImages = images && images.length > 0 
    ? images 
    : ['/placeholder.jpg'];

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <div
          className="relative w-full h-full cursor-zoom-in"
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={safeImages[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
          
          {/* Zoom Overlay */}
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${safeImages[selectedImage]})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: '200%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="h-4 w-4 text-gray-800" />
        </div>

        {/* Image Counter */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {selectedImage + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {safeImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImage === index
                  ? 'ring-2 ring-blue-600 ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if thumbnail fails to load
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-blue-600/20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
