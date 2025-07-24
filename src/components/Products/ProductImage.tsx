import React, { useState } from 'react';
import { useImageFetch } from '../../hooks/useImageFetch';
import { Product } from '../../hooks/useProducts';

interface ProductImageProps {
  product: Product;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  showLoader?: boolean;
}

/**
 * Get a placeholder image based on category
 */
function getPlaceholderImage(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('kitchen')) {
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80';
  }
  
  if (lowerCategory.includes('pen')) {
    return 'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80';
  }
  
  if (lowerCategory.includes('plastic') || lowerCategory.includes('crate')) {
    return 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80';
  }
  
  if (lowerCategory.includes('household')) {
    return 'https://images.unsplash.com/photo-1631871297972-3dbe4f8a2162?auto=format&fit=crop&w=800&h=600&q=80';
  }
  
  // Default placeholder
  return 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80';
}

/**
 * ProductImage component that dynamically displays contextually appropriate images
 * for products based on their attributes.
 */
const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = '',
  alt = '',
  width,
  height,
  showLoader = true,
}) => {
  // Track image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Use our custom hook to fetch a relevant image
  const { imageUrl, isLoading, error } = useImageFetch(product);
  
  // Get placeholder image based on category
  const placeholderImage = getPlaceholderImage(product.category);
  
  // Use fallback image if there's an error or if imageUrl is empty
  const finalImageUrl = error || !imageUrl || imageFailed ? placeholderImage : imageUrl;
  
  // Alt text defaults to product name if not provided
  const imageAlt = alt || `${product.name} - ${product.category}${product.subcategory ? ` - ${product.subcategory}` : ''}`;
  
  return (
    <div className={`product-image-container relative ${className}`}>
      {/* Show placeholder image immediately while actual image loads */}
      {!imageLoaded && !imageFailed && (
        <img
          src={placeholderImage}
          alt={imageAlt}
          width={width}
          height={height}
          className="w-full h-full object-cover absolute inset-0"
        />
      )}
      
      {/* Show loading spinner only if explicitly requested */}
      {isLoading && showLoader && !imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-brand-warm-orange rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={finalImageUrl}
        alt={imageAlt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ opacity: imageLoaded ? 1 : 0 }}
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={(e) => {
          setImageFailed(true);
          // If image fails to load, use fallback
          if (e.currentTarget.src !== placeholderImage) {
            e.currentTarget.src = placeholderImage;
            setImageLoaded(true);
          }
        }}
      />
    </div>
  );
};

export default ProductImage; 