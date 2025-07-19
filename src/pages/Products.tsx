import React, { useEffect, useState, useMemo } from 'react';
import { loadProducts } from '../utils/productLoader';
import { Search, ArrowLeft, Package, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
  [key: string]: any;
}

interface Subcategory {
  image: string;
  products: Product[];
}

interface Category {
  banner: string;
  subcategories: Record<string, Subcategory>;
}

type Catalog = Record<string, Category>;

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Products: React.FC = () => {
  const [catalog, setCatalog] = useState<Catalog>({});
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState<'category' | 'subcategory' | 'product'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      try {
        const data = await loadProducts();
        setCatalog(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    
    const query = debouncedSearch.toLowerCase();
    const results: Array<{
      type: 'category' | 'subcategory' | 'product';
      label: string;
      category?: string;
      subcategory?: string;
      product?: Product;
    }> = [];

    Object.entries(catalog).forEach(([category, { banner, subcategories }]) => {
      // Search categories
      if (category.toLowerCase().includes(query)) {
        results.push({ type: 'category', label: category, category });
      }

      // Search subcategories
      Object.entries(subcategories).forEach(([subcategory, { image, products }]) => {
        if (subcategory.toLowerCase().includes(query)) {
          results.push({ 
            type: 'subcategory', 
            label: `${subcategory} (${category})`, 
            category, 
            subcategory 
          });
        }

        // Search products
        products.forEach(product => {
          if (
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
          ) {
            results.push({
              type: 'product',
              label: `${product.name} (${subcategory}, ${category})`,
              category,
              subcategory,
              product
            });
          }
        });
      });
    });

    return results.slice(0, 10);
  }, [debouncedSearch, catalog]);

  // Navigation functions
  const goToCategory = (category: string) => {
    setSelectedCategory(category);
    setLayer('subcategory');
    setSelectedSubcategory(null);
  };

  const goToSubcategory = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setLayer('product');
  };

  const goBack = () => {
    if (layer === 'product') {
      setLayer('subcategory');
      setSelectedSubcategory(null);
    } else if (layer === 'subcategory') {
      setLayer('category');
      setSelectedCategory(null);
    }
  };

  const handleSearchResult = (result: any) => {
    if (result.type === 'category') {
      goToCategory(result.category);
    } else if (result.type === 'subcategory') {
      setSelectedCategory(result.category);
      goToSubcategory(result.subcategory);
    } else if (result.type === 'product') {
      setSelectedCategory(result.category);
      setSelectedSubcategory(result.subcategory);
      setLayer('product');
    }
    setSearchOpen(false);
    setSearch('');
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Categories', onClick: () => { setLayer('category'); setSelectedCategory(null); setSelectedSubcategory(null); } },
  ];
  if (selectedCategory) breadcrumbs.push({ label: selectedCategory, onClick: () => { setLayer('subcategory'); setSelectedSubcategory(null); } });
  if (selectedSubcategory) breadcrumbs.push({ label: selectedSubcategory, onClick: () => setLayer('product') });

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-brand-cream dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading product catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-brand-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Product Catalog
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore our comprehensive range of quality products
            </p>
          </div>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-brand-warm-orange hover:text-white transition-all duration-300 search-icon"
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="mb-8 search-container">
            <input
              autoFocus
              type="text"
              placeholder="Search products, categories, or subcategories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field text-lg"
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-brand-warm-orange/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{result.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{result.type}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 mb-8">
          {layer !== 'category' && (
            <button
              onClick={goBack}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-brand-warm-orange hover:text-white transition-all duration-300 mr-2 back-button"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <button
                onClick={crumb.onClick}
                className="breadcrumb-item"
              >
                {crumb.label}
              </button>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </span>
          ))}
        </div>

        {/* Category Layer */}
        {layer === 'category' && (
          <div className="grid-responsive">
            {Object.entries(catalog).map(([category, { banner }]) => (
              <div
                key={category}
                onClick={() => goToCategory(category)}
                className="category-card scale-hover"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={banner}
                    alt={`${category} banner`}
                    className="category-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Shivaya+Solutions';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    {category}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subcategory Layer */}
        {layer === 'subcategory' && selectedCategory && (
          <div className="grid-responsive">
            {Object.entries(catalog[selectedCategory].subcategories).map(([subcategory, { image, products }]) => (
              <div
                key={subcategory}
                onClick={() => goToSubcategory(subcategory)}
                className="category-card scale-hover"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={`${subcategory} image`}
                    className="category-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Shivaya+Solutions';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                    {subcategory}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Layer */}
        {layer === 'product' && selectedCategory && selectedSubcategory && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedSubcategory}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {catalog[selectedCategory].subcategories[selectedSubcategory].products.length} products available
              </p>
            </div>
            
            {catalog[selectedCategory].subcategories[selectedSubcategory].products.length > 0 ? (
              <div className="grid-responsive">
                {catalog[selectedCategory].subcategories[selectedSubcategory].products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card p-6"
                  >
                    <div className="product-info">
                      <h3 className="product-title">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="product-description">
                          {product.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        {product.quantity && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Available: {product.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle className="empty-state-icon mx-auto" />
                <h3 className="text-xl font-semibold mb-2">No products available</h3>
                <p>This category is currently empty. Please check back later.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State for Categories */}
        {layer === 'category' && Object.keys(catalog).length === 0 && (
          <div className="empty-state">
            <Package className="empty-state-icon mx-auto" />
            <h3 className="text-xl font-semibold mb-2">No categories available</h3>
            <p>Product catalog is currently empty. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;