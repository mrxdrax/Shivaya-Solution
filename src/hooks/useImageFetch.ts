import { useState, useEffect } from 'react';
import { Product } from './useProducts';

// Default placeholder image if API fails or no results
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80';

// Cache to prevent repeated API calls for the same query
const imageCache: Record<string, string> = {};

/**
 * Extract relevant keywords from product description and attributes
 */
function extractKeywords(product: Product): string[] {
  const keywords: string[] = [];
  
  // Add name
  if (product.name) {
    keywords.push(...product.name.toLowerCase().split(/\s+/));
  }
  
  // Add category and subcategory
  if (product.category) {
    keywords.push(product.category.toLowerCase());
  }
  
  if (product.subcategory) {
    keywords.push(product.subcategory.toLowerCase());
  }
  
  // Add material
  if (product.material) {
    keywords.push(product.material.toLowerCase());
  }
  
  // Add series
  if (product.series) {
    keywords.push(product.series.toLowerCase());
  }
  
  // Add brand
  if (product.brand) {
    keywords.push(product.brand.toLowerCase());
  }
  
  // Extract keywords from description
  if (product.description) {
    // Extract key nouns and adjectives from description
    const descWords = product.description.toLowerCase().match(/\b(\w{3,})\b/g) || [];
    keywords.push(...descWords.slice(0, 5)); // Add up to 5 significant words
  }
  
  // Add features
  if (product.features && product.features.length > 0) {
    // Extract key terms from features
    product.features.forEach(feature => {
      const featureWords = feature.toLowerCase().match(/\b(\w{3,})\b/g) || [];
      keywords.push(...featureWords.slice(0, 2)); // Add up to 2 words from each feature
    });
  }
  
  // Filter out common stopwords and duplicates
  const stopwords = ['and', 'the', 'for', 'with', 'from', 'this', 'that', 'are', 'was', 'were', 'will', 'have', 'has', 'not', 'but'];
  return [...new Set(keywords)]
    .filter(word => !stopwords.includes(word))
    .slice(0, 8); // Limit to 8 most relevant keywords
}

/**
 * Create a relevant query for the Unsplash API
 */
function createImageQuery(product: Product): string {
  const keywords = extractKeywords(product);
  
  // Create a concise, targeted query based on product type
  let baseQuery = '';
  
  if (product.category.toLowerCase().includes('pen')) {
    baseQuery = 'metal pen,writing,stationery';
  } else if (product.category.toLowerCase().includes('kitchen')) {
    baseQuery = 'cookware,kitchen,utensil';
  } else if (product.category.toLowerCase().includes('household')) {
    baseQuery = 'household,home,appliance';
  } else if (product.category.toLowerCase().includes('crate')) {
    baseQuery = 'storage,crate,container,plastic';
  } else if (product.category.toLowerCase().includes('amenities')) {
    baseQuery = 'hotel,amenity,hospitality';
  } else {
    baseQuery = 'product,retail';
  }
  
  // Add the most specific keywords from our extracted list
  const specificQuery = keywords.slice(0, 3).join(',');
  
  return `${specificQuery},${baseQuery}`;
}

/**
 * Simple string hash function for creating a seed
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Custom hook to fetch a relevant image for a product
 */
export function useImageFetch(product: Product) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a unique cache key for this product
  const cacheKey = `${product.id}-${product.name}-${product.category}`;

  useEffect(() => {
    // Set a timeout to show default image if fetching takes too long
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Image fetch timeout, using default image');
        setImageUrl(DEFAULT_IMAGE);
        setIsLoading(false);
      }
    }, 3000); // 3 second timeout
    
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        
        // Check cache first
        if (imageCache[cacheKey]) {
          setImageUrl(imageCache[cacheKey]);
          setIsLoading(false);
          setError(null);
          clearTimeout(timeoutId);
          return;
        }
        
        // Create a query for Unsplash
        const query = createImageQuery(product);
        
        // Generate a unique seed for this product
        const seed = hashCode(cacheKey);
        
        // Try multiple sources to ensure we get an image
        try {
          // Approach 1: Unsplash Source API with direct URL
          const unsplashUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(query)}&sig=${seed}`;
          
          // Fetch with a timeout
          const controller = new AbortController();
          const fetchTimeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(unsplashUrl, { 
            signal: controller.signal,
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          
          clearTimeout(fetchTimeoutId);
          
          if (response.ok) {
            const finalUrl = response.url;
            imageCache[cacheKey] = finalUrl;
            setImageUrl(finalUrl);
            setIsLoading(false);
            setError(null);
            clearTimeout(timeoutId);
            return;
          }
        } catch (err) {
          console.warn('Unsplash fetch failed, trying alternative approach');
        }
        
        // Approach 2: Use a fixed set of category-specific images
        const fallbackImages = {
          'Metal Pens': [
            'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=800&h=600&q=80'
          ],
          'Kitchen World': [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&h=600&q=80'
          ],
          'Household Products': [
            'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1631871297972-3dbe4f8a2162?auto=format&fit=crop&w=800&h=600&q=80'
          ],
          'Industrial Plastic Crates': [
            'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1597106776019-b4ecc878c202?auto=format&fit=crop&w=800&h=600&q=80'
          ],
          'Other Products': [
            'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80',
            'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80'
          ]
        };
        
        // Select an image based on the product category and seed
        const categoryImages = fallbackImages[product.category as keyof typeof fallbackImages] || fallbackImages['Other Products'];
        const fallbackImage = categoryImages[seed % categoryImages.length];
        
        imageCache[cacheKey] = fallbackImage;
        setImageUrl(fallbackImage);
        setIsLoading(false);
        setError(null);
        clearTimeout(timeoutId);
        
      } catch (err) {
        console.error('Error fetching image:', err);
        setError('Failed to fetch image');
        setImageUrl(DEFAULT_IMAGE);
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };
    
    fetchImage();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [product.id, product.name, product.category, cacheKey, isLoading]);
  
  return { imageUrl, isLoading, error };
} 