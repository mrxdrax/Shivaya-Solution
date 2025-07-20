import React from 'react';
import { useImageFetch } from '../../hooks/useImageFetch';

interface ProductImageProps {
  productName: string;
  category: string;
  subcategory?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  fallbackImage?: string;
  showLoader?: boolean;
}

/**
 * ProductImage component that dynamically fetches and displays contextually appropriate images
 * for products based on their name, category, and subcategory.
 */
const ProductImage: React.FC<ProductImageProps> = ({
  productName,
  category,
  subcategory,
  className = '',
  alt = '',
  width,
  height,
  fallbackImage,
  showLoader = true,
}) => {
  const { imageUrl, isLoading, error } = useImageFetch(productName, category, subcategory);
  
  // Default fallback image if none provided
  const defaultFallback = 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80';
  
  // Use fallback image if there's an error or if imageUrl is empty
  const finalImageUrl = error || !imageUrl ? (fallbackImage || defaultFallback) : imageUrl;
  
  // Alt text defaults to product name if not provided
  const imageAlt = alt || `${productName} - ${category}${subcategory ? ` - ${subcategory}` : ''}`;
  
  return (
    <div className={`product-image-container relative ${className}`}>
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={finalImageUrl}
        alt={imageAlt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => {
          // Image has loaded
        }}
        onError={(e) => {
          // If image fails to load, use fallback
          if (e.currentTarget.src !== fallbackImage && fallbackImage) {
            e.currentTarget.src = fallbackImage;
          } else if (e.currentTarget.src !== defaultFallback) {
            e.currentTarget.src = defaultFallback;
          }
        }}
      />
    </div>
  );
};

export default ProductImage; 