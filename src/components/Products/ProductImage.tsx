import React, { useState } from 'react';
import { Product } from '../../hooks/useProducts';
import { getProductImage, getCategoryImage } from '../../utils/imageUtils';

interface ProductImageProps {
  product: Product;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  showLoader?: boolean;
}

/**
 * ProductImage component that displays contextually relevant images for products
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
  
  // Get the appropriate image for this product
  const productImage = getProductImage(product);
  
  // Get category-based fallback image
  const fallbackImage = getCategoryImage(product.category);
  
  // Use fallback image if there's an error
  const finalImageUrl = imageFailed ? fallbackImage : productImage;
  
  // Alt text defaults to product name if not provided
  const imageAlt = alt || `${product.name} - ${product.category}${product.subcategory ? ` - ${product.subcategory}` : ''}`;
  
  return (
    <div className={`product-image-container relative ${className}`}>
      {/* Show category image immediately while actual image loads */}
      {!imageLoaded && !imageFailed && (
        <img
          src={fallbackImage}
          alt={imageAlt}
          width={width}
          height={height}
          className="w-full h-full object-cover absolute inset-0"
        />
      )}
      
      {/* Show loading spinner only if explicitly requested */}
      {!imageLoaded && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={finalImageUrl}
        alt={imageAlt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={(e) => {
          setImageFailed(true);
          // If image fails to load, use fallback
          if (e.currentTarget.src !== fallbackImage) {
            e.currentTarget.src = fallbackImage;
            setImageLoaded(true);
          }
        }}
      />
    </div>
  );
};

export default ProductImage; 