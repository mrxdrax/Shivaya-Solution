import { useState, useEffect } from 'react';

// You should replace this with your actual Unsplash API key
// For production, this should be stored in an environment variable
const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key';

// Default placeholder image if API fails or no results
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80';

interface ImageFetchOptions {
  orientation?: 'landscape' | 'portrait' | 'squarish';
  quality?: 'regular' | 'full' | 'raw' | 'small' | 'thumb';
  cacheDuration?: number; // in milliseconds, how long to cache results
}

// Cache to prevent repeated API calls for the same query
const imageCache: Record<string, { url: string; timestamp: number }> = {};

/**
 * Custom hook to fetch contextually relevant images from Unsplash API
 * @param productName - Name of the product
 * @param category - Category of the product
 * @param subcategory - Subcategory of the product (optional)
 * @param options - Additional options for image fetching
 * @returns Object containing the image URL, loading state, and error state
 */
export function useImageFetch(
  productName: string,
  category: string,
  subcategory?: string,
  options: ImageFetchOptions = {}
) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Default options
  const {
    orientation = 'landscape',
    quality = 'regular',
    cacheDuration = 24 * 60 * 60 * 1000, // 24 hours by default
  } = options;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        
        // Construct search query using product details
        const searchQuery = `${productName} ${subcategory || ''} ${category}`.trim();
        const cacheKey = `${searchQuery}-${orientation}-${quality}`;
        
        // Check cache first
        const now = Date.now();
        if (imageCache[cacheKey] && now - imageCache[cacheKey].timestamp < cacheDuration) {
          setImageUrl(imageCache[cacheKey].url);
          setIsLoading(false);
          return;
        }
        
        // For development/demo purposes, use a deterministic URL based on the search query
        // This avoids the need for an actual API key during development
        const devModeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(searchQuery)}&w=800&h=600`;
        
        // In production, you would use the actual Unsplash API:
        /*
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&orientation=${orientation}&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch image from Unsplash');
        }
        
        const data = await response.json();
        const imageUrl = data.results && data.results.length > 0 
          ? data.results[0].urls[quality] 
          : DEFAULT_IMAGE;
        */
        
        // Store in cache
        imageCache[cacheKey] = { url: devModeUrl, timestamp: now };
        setImageUrl(devModeUrl);
        setError(null);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError('Failed to fetch image');
        setImageUrl(DEFAULT_IMAGE);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [productName, category, subcategory, orientation, quality, cacheDuration]);
  
  return { imageUrl, isLoading, error };
}

/**
 * Utility function to get an image URL without using a hook
 * Useful for components that need an image URL but don't want to use a hook
 * @param productName - Name of the product
 * @param category - Category of the product
 * @param subcategory - Subcategory of the product (optional)
 * @returns A URL string for the image
 */
export function getImageUrl(productName: string, category: string, subcategory?: string): string {
  const searchQuery = `${productName} ${subcategory || ''} ${category}`.trim();
  return `https://source.unsplash.com/featured/?${encodeURIComponent(searchQuery)}&w=800&h=600`;
} 