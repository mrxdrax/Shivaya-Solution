import { useState, useEffect } from 'react';

interface ProductVariant {
  size?: string;
  color?: string;
  model?: string;
  name?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
  series?: string;
  material?: string;
  description: string;
  features?: string[];
  image?: string;
  variants?: string[] | ProductVariant[];
  sizes?: string[];
  colors?: string[];
  capacities?: string[];
  models?: { model_no: string; name: string }[];
  options?: { with_lid?: boolean; description: string }[];
  outer_dimension?: string;
  inner_dimension?: string;
  capacity_l?: number;
  packaging?: string;
  moq?: number;
  price_per_kg?: number;
  finish?: string;
}

interface SubcategoryData {
  name: string;
  products: Product[];
}

interface CategoryData {
  category: string;
  subcategories: SubcategoryData[];
}

// Helper function to generate a unique ID
const generateId = (category: string, subcategory: string, name: string, index: number): string => {
  const categoryPrefix = category.substring(0, 2).toUpperCase();
  const subcategoryPrefix = subcategory.substring(0, 2).toUpperCase();
  return `${categoryPrefix}-${subcategoryPrefix}-${index.toString().padStart(3, '0')}`;
};

// Create mock data for the categories
const createMockCatalog = (): CategoryData[] => {
  // Metal Pens Category
  const metalPensCategory: CategoryData = {
    category: 'Metal Pens',
    subcategories: [
      {
        name: 'Astral Series',
        products: Array.from({ length: 10 }, (_, i) => ({
          id: `MP-AS-${i + 1}`,
          name: `Astral Pen ${i + 1}`,
          category: 'Metal Pens',
          subcategory: 'Astral Series',
          brand: 'Dyna',
          series: 'Astral Series',
          material: 'Metal',
          description: `Premium Astral Series metal pen with elegant design and smooth writing experience.`,
          features: [
            'Smooth writing experience',
            'Premium metal construction',
            'Elegant design'
          ],
          image: `astral_pen_${i + 1}.jpg`
        }))
      },
      {
        name: 'Vertex Series',
        products: Array.from({ length: 8 }, (_, i) => ({
          id: `MP-VS-${i + 1}`,
          name: `Vertex Pen ${i + 1}`,
          category: 'Metal Pens',
          subcategory: 'Vertex Series',
          brand: 'Dyna',
          series: 'Vertex Series',
          material: 'Metal',
          description: `Premium Vertex Series metal pen with sophisticated design and smooth writing experience.`,
          features: [
            'Smooth writing experience',
            'Premium metal construction',
            'Sophisticated design'
          ],
          image: `vertex_pen_${i + 1}.jpg`
        }))
      },
      {
        name: 'Lumin Series',
        products: Array.from({ length: 6 }, (_, i) => ({
          id: `MP-LS-${i + 1}`,
          name: `Lumin Pen ${i + 1}`,
          category: 'Metal Pens',
          subcategory: 'Lumin Series',
          brand: 'Dyna',
          series: 'Lumin Series',
          material: 'Metal',
          description: `Premium Lumin Series metal pen with modern design and smooth writing experience.`,
          features: [
            'Smooth writing experience',
            'Premium metal construction',
            'Modern design'
          ],
          image: `lumin_pen_${i + 1}.jpg`
        }))
      }
    ]
  };

  // Kitchen World Category
  const kitchenWorldCategory: CategoryData = {
    category: 'Kitchen World',
    subcategories: [
      {
        name: 'Cookware',
        products: Array.from({ length: 5 }, (_, i) => ({
          id: `KW-CW-${i + 1}`,
          name: `Premium Cookware ${i + 1}`,
          category: 'Kitchen World',
          subcategory: 'Cookware',
          brand: 'OJAS',
          material: 'Stainless Steel',
          sizes: ['Small', 'Medium', 'Large'],
          description: `High-quality cookware for everyday cooking needs.`,
          features: [
            'Durable construction',
            'Even heat distribution',
            'Ergonomic handles'
          ],
          image: `cookware_${i + 1}.jpg`
        }))
      },
      {
        name: 'Pressure Cookers',
        products: Array.from({ length: 3 }, (_, i) => ({
          id: `KW-PC-${i + 1}`,
          name: `Pressure Cooker ${i + 1}`,
          category: 'Kitchen World',
          subcategory: 'Pressure Cookers',
          brand: 'OJAS',
          material: 'Stainless Steel',
          sizes: ['2L', '3L', '5L'],
          description: `Efficient pressure cookers for fast and healthy cooking.`,
          features: [
            'Safety mechanisms',
            'Quick cooking',
            'Energy efficient'
          ],
          image: `pressure_cooker_${i + 1}.jpg`
        }))
      },
      {
        name: 'Kitchen Tools',
        products: Array.from({ length: 8 }, (_, i) => ({
          id: `KW-KT-${i + 1}`,
          name: `Kitchen Tool ${i + 1}`,
          category: 'Kitchen World',
          subcategory: 'Kitchen Tools',
          brand: 'OJAS',
          material: 'Stainless Steel',
          description: `Essential kitchen tools for everyday cooking.`,
          features: [
            'Durable construction',
            'Easy to clean',
            'Ergonomic design'
          ],
          image: `kitchen_tool_${i + 1}.jpg`
        }))
      }
    ]
  };

  // Household Products Category
  const householdProductsCategory: CategoryData = {
    category: 'Household Products',
    subcategories: [
      {
        name: 'Storage Solutions',
        products: Array.from({ length: 6 }, (_, i) => ({
          id: `HP-SS-${i + 1}`,
          name: `Storage Container ${i + 1}`,
          category: 'Household Products',
          subcategory: 'Storage Solutions',
          variants: ['Small', 'Medium', 'Large'],
          features: [
            'Airtight seal',
            'Stackable design',
            'BPA-free material'
          ],
          description: `Versatile storage solutions for organizing your home.`,
          image: `storage_container_${i + 1}.jpg`
        }))
      },
      {
        name: 'Cleaning Tools',
        products: Array.from({ length: 4 }, (_, i) => ({
          id: `HP-CT-${i + 1}`,
          name: `Cleaning Tool ${i + 1}`,
          category: 'Household Products',
          subcategory: 'Cleaning Tools',
          variants: ['Standard', 'Premium'],
          features: [
            'Effective cleaning',
            'Ergonomic design',
            'Durable construction'
          ],
          description: `Efficient cleaning tools for a spotless home.`,
          image: `cleaning_tool_${i + 1}.jpg`
        }))
      }
    ]
  };

  // Industrial Plastic Crates Category
  const industrialPlasticCratesCategory: CategoryData = {
    category: 'Industrial Plastic Crates',
    subcategories: [
      {
        name: 'Standard Crates',
        products: Array.from({ length: 5 }, (_, i) => ({
          id: `IPC-SC-${i + 1}`,
          name: `Standard Crate ${i + 1}`,
          category: 'Industrial Plastic Crates',
          subcategory: 'Standard Crates',
          brand: 'Saran',
          outer_dimension: `${40 + i * 5}cm x ${30 + i * 5}cm x ${20 + i * 2}cm`,
          inner_dimension: `${38 + i * 5}cm x ${28 + i * 5}cm x ${18 + i * 2}cm`,
          capacity_l: 20 + i * 10,
          description: `Industrial plastic crate for storage and transport`,
          image: `standard_crate_${i + 1}.jpg`
        }))
      },
      {
        name: 'Stackable Crates',
        products: Array.from({ length: 3 }, (_, i) => ({
          id: `IPC-SC-${i + 1}`,
          name: `Stackable Crate ${i + 1}`,
          category: 'Industrial Plastic Crates',
          subcategory: 'Stackable Crates',
          brand: 'Saran',
          outer_dimension: `${50 + i * 5}cm x ${40 + i * 5}cm x ${30 + i * 2}cm`,
          inner_dimension: `${48 + i * 5}cm x ${38 + i * 5}cm x ${28 + i * 2}cm`,
          capacity_l: 50 + i * 15,
          description: `Stackable industrial plastic crate for efficient storage and transport`,
          image: `stackable_crate_${i + 1}.jpg`
        }))
      }
    ]
  };

  // Hotel Amenities Category
  const hotelAmenitiesCategory: CategoryData = {
    category: 'Hotel Amenities',
    subcategories: [
      {
        name: 'Bathroom Essentials',
        products: Array.from({ length: 6 }, (_, i) => ({
          id: `HA-BE-${i + 1}`,
          name: `Bathroom Essential ${i + 1}`,
          category: 'Hotel Amenities',
          subcategory: 'Bathroom Essentials',
          brand: 'Swiss Comforts',
          packaging: 'Individual packaging',
          moq: 1000,
          colors: ['White', 'Beige', 'Light Blue'],
          features: [
            'Premium quality',
            'Eco-friendly materials',
            'Elegant design'
          ],
          description: `Essential bathroom amenities for hotels and hospitality businesses.`,
          image: `bathroom_essential_${i + 1}.jpg`
        }))
      },
      {
        name: 'Room Accessories',
        products: Array.from({ length: 4 }, (_, i) => ({
          id: `HA-RA-${i + 1}`,
          name: `Room Accessory ${i + 1}`,
          category: 'Hotel Amenities',
          subcategory: 'Room Accessories',
          brand: 'Swiss Comforts',
          packaging: 'Bulk packaging',
          moq: 500,
          features: [
            'Durable construction',
            'Elegant design',
            'Premium quality'
          ],
          description: `Stylish room accessories for hotels and hospitality businesses.`,
          image: `room_accessory_${i + 1}.jpg`
        }))
      }
    ]
  };

  // Premium Cookware Category
  const premiumCookwareCategory: CategoryData = {
    category: 'Premium Cookware',
    subcategories: [
      {
        name: 'TriPro',
        products: [
          {
            id: 'PC-TP-1',
            name: 'Triply Kadai',
            category: 'Premium Cookware',
            subcategory: 'TriPro',
            brand: 'Bergner',
            series: 'TriPro',
            finish: 'Triply Stainless Steel',
            sizes: ['20 cm', '22 cm', '24 cm', '26 cm', '28 cm', '30 cm'],
            options: [
              { with_lid: true, description: 'Stainless steel kadai with triply construction, matching lid available.' },
              { with_lid: false, description: 'Stainless steel kadai with triply construction, without lid option.' }
            ],
            features: [
              'Tri-ply construction: even heat distribution, prevents hot spots',
              'Compatible with induction and gas stoves',
              'Premium handles and finishing',
              'Easy to clean, durable, and long-lasting material'
            ],
            description: 'Premium triply stainless steel kadai with even heat distribution and durable construction.',
            image: 'triply_kadai.jpg'
          },
          {
            id: 'PC-TP-2',
            name: 'Triply Sauce Pan',
            category: 'Premium Cookware',
            subcategory: 'TriPro',
            brand: 'Bergner',
            series: 'TriPro',
            finish: 'Triply Stainless Steel',
            sizes: ['Small', 'Medium'],
            features: [
              'Tri-ply construction: even heat distribution, prevents hot spots',
              'Compatible with induction and gas stoves',
              'Premium handles and finishing',
              'Easy to clean, durable, and long-lasting material'
            ],
            description: 'Premium triply stainless steel sauce pan with even heat distribution and durable construction.',
            image: 'triply_sauce_pan.jpg'
          },
          {
            id: 'PC-TP-3',
            name: 'Fry Pan',
            category: 'Premium Cookware',
            subcategory: 'TriPro',
            brand: 'Bergner',
            series: 'TriPro',
            finish: 'Triply Stainless Steel',
            sizes: ['Small', 'Medium', 'Big'],
            features: [
              'Tri-ply construction: even heat distribution, prevents hot spots',
              'Compatible with induction and gas stoves',
              'Premium handles and finishing',
              'Easy to clean, durable, and long-lasting material'
            ],
            description: 'Premium triply stainless steel fry pan with even heat distribution and durable construction.',
            image: 'triply_fry_pan.jpg'
          }
        ]
      }
    ]
  };

  return [
    metalPensCategory,
    kitchenWorldCategory,
    householdProductsCategory,
    industrialPlasticCratesCategory,
    hotelAmenitiesCategory,
    premiumCookwareCategory
  ];
};

export function useProducts() {
  const [catalog, setCatalog] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        
        // Since we're having issues with JSON imports, use mock data for now
        const mockCatalog = createMockCatalog();
        setCatalog(mockCatalog);
        setError(null);
      } catch (err) {
        console.error('Error loading product catalog:', err);
        setError('Failed to load product catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCatalog();
  }, []);
  
  // Get all categories
  const getCategories = () => catalog.map(cat => cat.category);
  
  // Get all subcategories for a specific category
  const getSubcategories = (category: string) => {
    const categoryData = catalog.find(cat => cat.category === category);
    return categoryData ? categoryData.subcategories.map(sub => sub.name) : [];
  };
  
  // Get all products for a specific subcategory
  const getProductsBySubcategory = (category: string, subcategory: string) => {
    const categoryData = catalog.find(cat => cat.category === category);
    if (!categoryData) return [];
    
    const subcategoryData = categoryData.subcategories.find(sub => sub.name === subcategory);
    return subcategoryData ? subcategoryData.products : [];
  };
  
  // Search products across all categories and subcategories
  const searchProducts = (query: string) => {
    const results: Array<{
      type: 'product' | 'category' | 'subcategory';
      id: string;
      name: string;
      category?: string;
      subcategory?: string;
      product?: Product;
      description?: string;
      image?: string;
    }> = [];
    
    const searchTerm = query.toLowerCase();
    
    // Search in categories
    catalog.forEach(categoryData => {
      // Add category if it matches search term
      if (categoryData.category.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'category',
          id: `cat-${categoryData.category}`,
          name: categoryData.category,
          description: `${categoryData.subcategories.length} subcategories available`,
          image: `https://source.unsplash.com/random/300x200/?${categoryData.category.toLowerCase().replace(/\s+/g, '')}`
        });
      }
      
      // Search in subcategories
      categoryData.subcategories.forEach(subcategoryData => {
        // Add subcategory if it matches search term
        if (subcategoryData.name.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'subcategory',
            id: `subcat-${categoryData.category}-${subcategoryData.name}`,
            name: subcategoryData.name,
            category: categoryData.category,
            description: `${subcategoryData.products.length} products available`,
            image: `https://source.unsplash.com/random/300x200/?${subcategoryData.name.toLowerCase().replace(/\s+/g, '')}`
          });
        }
        
        // Search in products
        const matchingProducts = subcategoryData.products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm)) ||
          (product.features && product.features.some(feature => feature.toLowerCase().includes(searchTerm)))
        );
        
        // Add matching products to results
        matchingProducts.forEach(product => {
          results.push({
            type: 'product',
            id: product.id,
            name: product.name,
            category: categoryData.category,
            subcategory: subcategoryData.name,
            product: product,
            description: product.description,
            image: product.image || `https://source.unsplash.com/random/300x200/?${product.name.toLowerCase().replace(/\s+/g, '')}`
          });
        });
      });
    });
    
    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExactMatch = a.name.toLowerCase() === searchTerm;
      const bExactMatch = b.name.toLowerCase() === searchTerm;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      const aStartsWith = a.name.toLowerCase().startsWith(searchTerm);
      const bStartsWith = b.name.toLowerCase().startsWith(searchTerm);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Sort by type (products first, then subcategories, then categories)
      const typeOrder = { product: 0, subcategory: 1, category: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
    
    return results;
  };
  
  return {
    catalog,
    loading,
    error,
    getCategories,
    getSubcategories,
    getProductsBySubcategory,
    searchProducts
  };
}
