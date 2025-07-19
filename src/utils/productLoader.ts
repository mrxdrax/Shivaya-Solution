// Static JSON file paths
const JSON_FILES = [
  '/data/products1.json',
  '/data/products2.json'
];

// --- CATEGORY & SUBCATEGORY STRUCTURE (PDF-accurate, editable image IDs) ---

export const CATEGORY_IMAGE_MAP = {
  'Metal Pens': 'cat_metal_pens',
  'Household Products': 'cat_household_products',
  'Kitchen World': 'cat_kitchen_world',
  'Plastic Crates': 'cat_plastic_crates',
  'Dustbins & Waste Bins': 'cat_dustbins',
  'Hotel Amenities': 'cat_hotel_amenities',
};

export const SUBCATEGORY_IMAGE_MAP = {
  // Metal Pens
  'Premium Ball Pens': 'sub_premium_ball_pens',
  'Promotional Pens': 'sub_promotional_pens',
  'Gift Sets': 'sub_gift_sets',
  'Stylus Pens': 'sub_stylus_pens',
  'Multi-function Pens': 'sub_multifunction_pens',
  'Customized Engraving Pens': 'sub_customized_engraving_pens',
  // Household Products
  'Lunch Boxes': 'sub_lunch_boxes',
  'Water Bottles': 'sub_water_bottles',
  'Storage Containers': 'sub_storage_containers',
  'Steelware': 'sub_steelware',
  'Plasticware': 'sub_plasticware',
  'Insulated Products': 'sub_insulated_products',
  // Kitchen World
  'Cookware Sets': 'sub_cookware_sets',
  'Gas Lighters': 'sub_gas_lighters',
  'Knives': 'sub_knives',
  'Tawa/Kadai': 'sub_tawa_kadai',
  'Pressure Cookers': 'sub_pressure_cookers',
  'Choppers & Peelers': 'sub_choppers_peelers',
  // Plastic Crates
  '300x200 Series': 'sub_300x200_series',
  '400x300 Series': 'sub_400x300_series',
  '500x325 Series': 'sub_500x325_series',
  '600x400 Series': 'sub_600x400_series',
  'Perforated Crates': 'sub_perforated_crates',
  'Custom & Partition Crates': 'sub_custom_partition_crates',
  'Fruit & Vegetable Crates': 'sub_fruit_vegetable_crates',
  // Dustbins & Waste Bins
  'Small Bins (10–40L)': 'sub_small_bins',
  'Medium Bins (40L)': 'sub_medium_bins',
  'Big Bins (50–200L)': 'sub_big_bins',
  'Extra Large (120L–1100L)': 'sub_extra_large_bins',
  'Plastic Stand Dustbins': 'sub_plastic_stand_dustbins',
  'Steel Dustbins': 'sub_steel_dustbins',
  // Hotel Amenities
  'Hotel Soaps': 'sub_hotel_soaps',
  '20ml Toiletries': 'sub_20ml_toiletries',
  'Dental Kits': 'sub_dental_kits',
  'Slippers': 'sub_slippers',
  'Shaving Kits': 'sub_shaving_kits',
  'Shoe Shiners': 'sub_shoe_shiners',
  'Glass Covers': 'sub_glass_covers',
  'Urinal Screens': 'sub_urinal_screens',
  'Guest Kits': 'sub_guest_kits',
  'Laundry Bags': 'sub_laundry_bags',
  'Toilet Seat Bands': 'sub_toilet_seat_bands',
};

// --- IMAGE URLS (editable by ID) ---
export const IMAGE_URLS: Record<string, string> = {
  // Main categories
  cat_metal_pens: 'https://images.pexels.com/photos/301703/pexels-photo-301703.jpeg',
  cat_household_products: 'https://images.pexels.com/photos/4226924/pexels-photo-4226924.jpeg',
  cat_kitchen_world: 'https://images.pexels.com/photos/4226792/pexels-photo-4226792.jpeg',
  cat_plastic_crates: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  cat_dustbins: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
  cat_hotel_amenities: 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg',
  // Metal Pens subcategories
  sub_premium_ball_pens: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  sub_promotional_pens: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  sub_gift_sets: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  sub_stylus_pens: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  sub_multifunction_pens: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  sub_customized_engraving_pens: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  // Household Products subcategories
  sub_lunch_boxes: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  sub_water_bottles: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  sub_storage_containers: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  sub_steelware: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  sub_plasticware: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  sub_insulated_products: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  // Kitchen World subcategories
  sub_cookware_sets: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  sub_gas_lighters: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  sub_knives: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  sub_tawa_kadai: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  sub_pressure_cookers: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  sub_choppers_peelers: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  // Plastic Crates subcategories
  sub_300x200_series: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  sub_400x300_series: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  sub_500x325_series: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  sub_600x400_series: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  sub_perforated_crates: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  sub_custom_partition_crates: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  sub_fruit_vegetable_crates: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  // Dustbins & Waste Bins subcategories
  sub_small_bins: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  sub_medium_bins: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  sub_big_bins: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  sub_extra_large_bins: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  sub_plastic_stand_dustbins: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  sub_steel_dustbins: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  // Hotel Amenities subcategories
  sub_hotel_soaps: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  sub_20ml_toiletries: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  sub_dental_kits: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  sub_slippers: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  sub_shaving_kits: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  sub_shoe_shiners: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  sub_glass_covers: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  sub_urinal_screens: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  sub_guest_kits: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  sub_laundry_bags: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  sub_toilet_seat_bands: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
};

const FALLBACK_BANNER = 'https://via.placeholder.com/800x400/FF6B35/FFFFFF?text=Shivaya+Solutions';
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Shivaya+Solutions';

// Replace any brand name with Shivaya Solutions
function replaceBrandNames(text: string): string {
  if (!text) return text;
  return text.replace(/(Saran Enterprises|ABC Exports|XYZ Industries|DEF Plastics|GHI Enterprises|JKL Stationery|MNO Cookware|PQR Gifts|RST Papers|UVW Kitchen|XYZ Industrial|ABC Furniture|LMN Electronics|OPQ Audio|RST Tech)/gi, 'Shivaya Solutions');
}

// Get category and subcategory from product
function categorizeProduct(product: any) {
  const category = product.category || 'Other';
  const subcategory = product.type || 'Other';
  
  const categoryConfig = CATEGORY_IMAGE_MAP[category];
  const banner = IMAGE_URLS[categoryConfig] || FALLBACK_BANNER;
  const image = SUBCATEGORY_IMAGE_MAP[subcategory] ? IMAGE_URLS[SUBCATEGORY_IMAGE_MAP[subcategory]] || FALLBACK_IMAGE : FALLBACK_IMAGE;
  
  return {
    category,
    subcategory,
    banner,
    image
  };
}

// Main loader function
export async function loadProducts() {
  try {
    // Fetch all JSON files
    const promises = JSON_FILES.map(file => 
      fetch(file)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file}`);
          }
          return response.json();
        })
        .catch(error => {
          console.warn(`Error loading ${file}:`, error);
          return [];
        })
    );

    const results = await Promise.all(promises);
    
    // Combine all products
    let allProducts: any[] = [];
    results.forEach(products => {
      if (Array.isArray(products)) {
        allProducts = allProducts.concat(products);
      }
    });

    // Process products: replace brand names and categorize
    const processedProducts = allProducts.map(product => {
      const processed = { ...product };
      
      // Replace brand names in all text fields
      processed.name = replaceBrandNames(processed.name);
      processed.description = replaceBrandNames(processed.description);
      
      // Categorize product
      const { category, subcategory, banner, image } = categorizeProduct(processed);
      processed._category = category;
      processed._subcategory = subcategory;
      processed._banner = banner;
      processed._image = image;
      
      return processed;
    });

    // Group by category and subcategory
    const grouped: Record<string, { banner: string; subcategories: Record<string, { image: string; products: any[] }> }> = {};
    
    processedProducts.forEach(product => {
      const cat = product._category;
      const sub = product._subcategory;
      
      if (!grouped[cat]) {
        grouped[cat] = { 
          banner: product._banner, 
          subcategories: {} 
        };
      }
      
      if (!grouped[cat].subcategories[sub]) {
        grouped[cat].subcategories[sub] = { 
          image: product._image, 
          products: [] 
        };
      }
      
      grouped[cat].subcategories[sub].products.push(product);
    });

    return grouped;
  } catch (error) {
    console.error('Error loading products:', error);
    return {};
  }
} 