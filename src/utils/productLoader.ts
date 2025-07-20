import { Product } from '../hooks/useProducts';

// --- CATEGORY & SUBCATEGORY STRUCTURE ---
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'Metal Pens': 'cat_metal_pens',
  'Household Products': 'cat_household_products',
  'Kitchen World': 'cat_kitchen_world',
  'Industrial Plastic Crates': 'cat_plastic_crates',
  'Hotel Amenities': 'cat_hotel_amenities',
  'Premium Cookware': 'cat_premium_cookware',
};

// --- IMAGE URLS ---
export const IMAGE_URLS: Record<string, string> = {
  // Main categories
  cat_metal_pens: 'https://images.pexels.com/photos/301703/pexels-photo-301703.jpeg',
  cat_household_products: 'https://images.pexels.com/photos/4226924/pexels-photo-4226924.jpeg',
  cat_kitchen_world: 'https://images.pexels.com/photos/4226792/pexels-photo-4226792.jpeg',
  cat_plastic_crates: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  cat_hotel_amenities: 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg',
  cat_premium_cookware: 'https://images.pexels.com/photos/6996168/pexels-photo-6996168.jpeg',
};

interface SubcategoryData {
  name: string;
  products: Product[];
  image?: string;
}

interface CategoryData {
  category: string;
  subcategories: SubcategoryData[];
  banner?: string;
}

// Main loader function
export async function loadProducts() {
  try {
    // Fetch the structured catalog
    const response = await fetch('/data/structured-catalog.json');
    if (!response.ok) {
      throw new Error('Failed to fetch product catalog');
    }
    const catalog = await response.json() as CategoryData[];
    
    // Process the catalog to add image URLs
    catalog.forEach((category: CategoryData) => {
      const categoryImageKey = CATEGORY_IMAGE_MAP[category.category];
      category.banner = categoryImageKey ? IMAGE_URLS[categoryImageKey] : undefined;
      
      category.subcategories.forEach((subcategory: SubcategoryData) => {
        subcategory.image = `https://source.unsplash.com/random/300x200/?${subcategory.name.toLowerCase().replace(/\s+/g, '')}`;
        
        subcategory.products.forEach((product: Product) => {
          if (!product.image) {
            product.image = `https://source.unsplash.com/random/300x200/?${product.name.toLowerCase().replace(/\s+/g, '')}`;
          }
        });
      });
    });
    
    return catalog;
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
} 