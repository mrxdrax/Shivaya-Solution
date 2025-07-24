import { Product } from '../hooks/useProducts';

// Maps for specific product types to relevant image collections
interface ImageMapping {
  [key: string]: string[];
}

// High-quality, categorized images for products
const PRODUCT_IMAGES: Record<string, ImageMapping> = {
  // Metal Pens category
  'Metal Pens': {
    'Executive': [
      'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Classic': [
      'https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Premium': [
      'https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1576103200868-2dd453dbcd9c?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
  },
  
  // Kitchen World category
  'Kitchen World': {
    'Pressure Cooker': [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1588068843273-4329bdbe4573?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Non-Stick': [
      'https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Hard Anodized': [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1596189181426-7f63a1737f0d?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Cookware Set': [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Idli Pot': [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&h=600&q=80',
    ],
  },
  
  // Household Products category
  'Household Products': {
    'Dustbin': [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Bucket': [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600695998647-e111ff1885eb?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Mug': [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf62?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1574177556859-1362f72ed6f9?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Water Bottle': [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Bathroom Set': [
      'https://images.unsplash.com/photo-1631871297972-3dbe4f8a2162?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1573771807433-2e5f2bafde9d?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1631871297972-3dbe4f8a2162?auto=format&fit=crop&w=800&h=600&q=80',
    ],
  },
  
  // Industrial Plastic Crates category
  'Industrial Plastic Crates': {
    'Plastic Crate': [
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1597106776019-b4ecc878c202?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Storage Bin': [
      'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Vented Crate': [
      'https://images.unsplash.com/photo-1597106776019-b4ecc878c202?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Industrial Container': [
      'https://images.unsplash.com/photo-1517320069935-987eaa76bc23?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1597106776019-b4ecc878c202?auto=format&fit=crop&w=800&h=600&q=80',
    ],
  },
  
  // Other Products category
  'Other Products': {
    'Premium Cookware': [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1592154016568-9a38dbd21308?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    'Hotel Amenities': [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1557801200-2f9769722036?auto=format&fit=crop&w=800&h=600&q=80',
    ],
  },
};

// Default placeholder image
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80';

/**
 * Simple string hash function for creating a stable random number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Find the most relevant subcategory for a product
 */
function findRelevantSubcategory(product: Product, categoryMappings: ImageMapping): string {
  // First try exact match on subcategory
  if (product.subcategory && categoryMappings[product.subcategory]) {
    return product.subcategory;
  }
  
  // Try series
  if (product.series && categoryMappings[product.series]) {
    return product.series;
  }
  
  // Check for partial matches in product name or description
  const searchableText = `${product.name} ${product.description} ${product.subcategory || ''} ${product.series || ''}`.toLowerCase();
  
  for (const subcategory of Object.keys(categoryMappings)) {
    if (subcategory === 'default') continue;
    
    if (searchableText.includes(subcategory.toLowerCase())) {
      return subcategory;
    }
  }
  
  // Try keywords for common product types
  const keywords: Record<string, string[]> = {
    'Pressure Cooker': ['pressure', 'cooker', 'steam', 'pressure cooker'],
    'Non-Stick': ['non-stick', 'nonstick', 'non stick', 'teflon', 'coating'],
    'Hard Anodized': ['hard anodized', 'anodized', 'hard-anodized'],
    'Cookware Set': ['cookware set', 'set', 'pots and pans', 'cooking set'],
    'Bucket': ['bucket', 'pail', 'container', 'water bucket'],
    'Mug': ['mug', 'cup', 'tumbler', 'drink'],
    'Water Bottle': ['bottle', 'water bottle', 'drink', 'beverage'],
    'Dustbin': ['dustbin', 'trash', 'garbage', 'waste', 'bin'],
    'Storage Bin': ['storage', 'bin', 'container', 'box'],
    'Plastic Crate': ['crate', 'plastic crate', 'container'],
  };
  
  for (const [subcategory, terms] of Object.entries(keywords)) {
    if (categoryMappings[subcategory] && terms.some(term => searchableText.includes(term))) {
      return subcategory;
    }
  }
  
  // Default to default subcategory
  return 'default';
}

/**
 * Get the most relevant image for a product
 */
export function getProductImage(product: Product): string {
  if (!product) return DEFAULT_IMAGE;
  
  try {
    // Get the category mappings
    const categoryMappings = PRODUCT_IMAGES[product.category] || PRODUCT_IMAGES['Other Products'];
    
    // Find the most relevant subcategory
    const relevantSubcategory = findRelevantSubcategory(product, categoryMappings);
    
    // Get the images for that subcategory
    const images = categoryMappings[relevantSubcategory] || categoryMappings.default || [DEFAULT_IMAGE];
    
    // Use the product ID or name to select a consistent image for this product
    const seed = hashString(product.id || product.name || '');
    const selectedImage = images[seed % images.length];
    
    return selectedImage;
  } catch (error) {
    console.error('Error selecting product image:', error);
    return DEFAULT_IMAGE;
  }
}

/**
 * Get a category image
 */
export function getCategoryImage(category: string): string {
  if (!category) return DEFAULT_IMAGE;
  
  try {
    const categoryMappings = PRODUCT_IMAGES[category] || PRODUCT_IMAGES['Other Products'];
    const defaultImages = categoryMappings.default || [DEFAULT_IMAGE];
    const seed = hashString(category);
    return defaultImages[seed % defaultImages.length];
  } catch (error) {
    return DEFAULT_IMAGE;
  }
}

/**
 * Get a subcategory image
 */
export function getSubcategoryImage(category: string, subcategory: string): string {
  if (!category || !subcategory) return DEFAULT_IMAGE;
  
  try {
    const categoryMappings = PRODUCT_IMAGES[category] || PRODUCT_IMAGES['Other Products'];
    
    // Try exact match first
    if (categoryMappings[subcategory]) {
      const images = categoryMappings[subcategory];
      const seed = hashString(subcategory);
      return images[seed % images.length];
    }
    
    // Fall back to default images for the category
    const defaultImages = categoryMappings.default || [DEFAULT_IMAGE];
    const seed = hashString(subcategory);
    return defaultImages[seed % defaultImages.length];
  } catch (error) {
    return DEFAULT_IMAGE;
  }
} 