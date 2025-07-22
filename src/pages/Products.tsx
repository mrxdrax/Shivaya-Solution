import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { useProducts, Product } from '../hooks/useProducts';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProductImage from '../components/Products/ProductImage';

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Helper function to create URL-friendly slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to find category, subcategory or product by slug
const findBySlug = (items: any[], slug: string): any | undefined => {
  return items.find(item => createSlug(item.name || item.category) === slug);
};

const Products: React.FC = () => {
  const { catalog, loading, error, searchProducts } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const { categorySlug, subcategorySlug, productSlug } = useParams<{
    categorySlug?: string;
    subcategorySlug?: string;
    productSlug?: string;
  }>();

  const [layer, setLayer] = useState<'category' | 'subcategory' | 'product'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Set up navigation based on URL params
  useEffect(() => {
    if (loading || error || !catalog.length) return;

    if (categorySlug) {
      const category = catalog.find(cat => createSlug(cat.category) === categorySlug);
      if (category) {
        setSelectedCategory(category.category);
        setLayer('subcategory');

        if (subcategorySlug) {
          const subcategory = category.subcategories.find(sub => createSlug(sub.name) === subcategorySlug);
          if (subcategory) {
            setSelectedSubcategory(subcategory.name);
            setLayer('product');

            if (productSlug) {
              const product = subcategory.products.find(prod => createSlug(prod.name) === productSlug);
              if (product) {
                setSelectedProduct(product);
              }
            }
          }
        }
      }
    }
  }, [catalog, categorySlug, subcategorySlug, productSlug, loading, error]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    
    return searchProducts(debouncedSearch).slice(0, 15);
  }, [debouncedSearch, searchProducts]);

  // Navigation functions
  const goToCategory = (category: string) => {
    setSelectedCategory(category);
    setLayer('subcategory');
    setSelectedSubcategory(null);
    setSelectedProduct(null);
    navigate(`/products/${createSlug(category)}`);
  };

  const goToSubcategory = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setLayer('product');
    setSelectedProduct(null);
    navigate(`/products/${createSlug(selectedCategory as string)}/${createSlug(subcategory)}`);
  };

  const goToProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/products/${createSlug(selectedCategory as string)}/${createSlug(selectedSubcategory as string)}/${createSlug(product.name)}`);
  };

  const goBack = () => {
    if (layer === 'product' && selectedProduct) {
      setSelectedProduct(null);
      navigate(`/products/${createSlug(selectedCategory as string)}/${createSlug(selectedSubcategory as string)}`);
    } else if (layer === 'product') {
      setLayer('subcategory');
      setSelectedSubcategory(null);
      navigate(`/products/${createSlug(selectedCategory as string)}`);
    } else if (layer === 'subcategory') {
      setLayer('category');
      setSelectedCategory(null);
      navigate('/products');
    }
  };

  const handleSearchResult = (result: any) => {
    if (result.type === 'category') {
      setSelectedCategory(result.name);
      setLayer('subcategory');
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      navigate(`/products/${createSlug(result.name)}`);
    } else if (result.type === 'subcategory') {
      setSelectedCategory(result.category);
      setSelectedSubcategory(result.name);
      setLayer('product');
      setSelectedProduct(null);
      navigate(`/products/${createSlug(result.category)}/${createSlug(result.name)}`);
    } else if (result.type === 'product') {
      setSelectedCategory(result.category);
      setSelectedSubcategory(result.subcategory);
      setSelectedProduct(result.product);
      setLayer('product');
      navigate(`/products/${createSlug(result.category)}/${createSlug(result.subcategory)}/${createSlug(result.name)}`);
    }
    setSearchOpen(false);
    setSearch('');
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Categories', onClick: () => { setLayer('category'); setSelectedCategory(null); setSelectedSubcategory(null); setSelectedProduct(null); navigate('/products'); } },
  ];
  if (selectedCategory) breadcrumbs.push({ label: selectedCategory, onClick: () => { setLayer('subcategory'); setSelectedSubcategory(null); setSelectedProduct(null); navigate(`/products/${createSlug(selectedCategory)}`); } });
  if (selectedSubcategory) breadcrumbs.push({ label: selectedSubcategory, onClick: () => { setLayer('product'); setSelectedProduct(null); navigate(`/products/${createSlug(selectedCategory as string)}/${createSlug(selectedSubcategory)}`); } });
  if (selectedProduct) breadcrumbs.push({ label: selectedProduct.name, onClick: () => {} });

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

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-brand-cream dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-brand-warm-orange text-white rounded-md hover:bg-brand-warm-orange/80"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
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
          <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-brand-warm-orange hover:text-white transition-all duration-300 search-icon cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
          </button>

            {/* Search Bar - Positioned absolutely */}
        {searchOpen && (
              <div className="absolute right-0 top-14 w-80 sm:w-96 z-50">
                <div className="search-container bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3">
            <input
              autoFocus
              type="text"
              placeholder="Search products, categories, or subcategories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
                    className="input-field text-base w-full"
                  />
                  
                  {debouncedSearch.trim() !== '' && searchResults.length === 0 && (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No results found for "{debouncedSearch}"
                    </div>
                  )}
                  
            {searchResults.length > 0 && (
                    <div className="search-results max-h-96 overflow-y-auto mt-2">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-brand-warm-orange/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                      {result.type === 'product' && result.product && (
                        <ProductImage 
                          product={result.product}
                          className="w-full h-full"
                          alt={result.name}
                          showLoader={false}
                        />
                      )}
                      {result.type === 'subcategory' && (
                        <img 
                          src={`https://source.unsplash.com/800x600/?${result.name.toLowerCase().replace(/\s+/g, ',')},${result.category?.toLowerCase().replace(/\s+/g, ',')}`}
                          alt={result.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback image based on category
                            const fallbackMap: Record<string, string> = {
                              'Metal Pens': 'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
                              'Kitchen World': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
                              'Household Products': 'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?auto=format&fit=crop&w=800&h=600&q=80',
                              'Industrial Plastic Crates': 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
                              'Other Products': 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80'
                            };
                            e.currentTarget.src = fallbackMap[result.category || ''] || fallbackMap['Other Products'];
                          }}
                        />
                      )}
                      {result.type === 'category' && (
                        <img 
                          src={`https://source.unsplash.com/800x600/?${result.name.toLowerCase().replace(/\s+/g, ',')},product`}
                          alt={result.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback image for categories
                            const fallbackMap: Record<string, string> = {
                              'Metal Pens': 'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
                              'Kitchen World': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
                              'Household Products': 'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?auto=format&fit=crop&w=800&h=600&q=80',
                              'Industrial Plastic Crates': 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
                              'Other Products': 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80'
                            };
                            e.currentTarget.src = fallbackMap[result.name] || fallbackMap['Other Products'];
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {result.type === 'product' ? 
                          `${result.subcategory}, ${result.category}` : 
                          result.description
                        }
                      </div>
                      <div className="text-xs text-brand-warm-orange capitalize mt-1">
                        {result.type === 'category' ? 'Category' : 
                          result.type === 'subcategory' ? 'Subcategory' : 'Product'}
                      </div>
                    </div>
                  </button>
                ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 mb-8">
          {layer !== 'category' && (
            <button
              onClick={goBack}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-brand-warm-orange hover:text-white transition-all duration-300 mr-2 back-button cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <button
                onClick={crumb.onClick}
                className="breadcrumb-item cursor-pointer"
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
            {catalog.map((categoryData, index) => (
              <div
                key={categoryData.category}
                onClick={() => goToCategory(categoryData.category)}
                className="category-card scale-hover cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <div className="w-full h-full">
                    <img 
                      src={`https://source.unsplash.com/800x600/?${categoryData.category.toLowerCase().replace(/\s+/g, ',')},product`}
                      alt={categoryData.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback image by category
                        const fallbackMap: Record<string, string> = {
                          'Metal Pens': 'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
                          'Kitchen World': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
                          'Household Products': 'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?auto=format&fit=crop&w=800&h=600&q=80',
                          'Industrial Plastic Crates': 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
                          'Other Products': 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80'
                        };
                        e.currentTarget.src = fallbackMap[categoryData.category] || fallbackMap['Other Products'];
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold">{categoryData.category}</h2>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                  <p className="text-gray-600 dark:text-gray-300">
                    {categoryData.subcategories.length} subcategories
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subcategory Layer */}
        {layer === 'subcategory' && selectedCategory && (
          <div className="grid-responsive">
            {catalog
              .find(cat => cat.category === selectedCategory)
              ?.subcategories.map((subcategoryData, index) => (
                <div
                  key={subcategoryData.name}
                  onClick={() => goToSubcategory(subcategoryData.name)}
                  className="subcategory-card scale-hover cursor-pointer"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
                    <div className="w-full h-full">
                      <img 
                        src={`https://source.unsplash.com/800x600/?${subcategoryData.name.toLowerCase().replace(/\s+/g, ',')},${selectedCategory?.toLowerCase().replace(/\s+/g, ',')}`}
                        alt={subcategoryData.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback image based on category
                          const fallbackMap: Record<string, string> = {
                            'Metal Pens': 'https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?auto=format&fit=crop&w=800&h=600&q=80',
                            'Kitchen World': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
                            'Household Products': 'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?auto=format&fit=crop&w=800&h=600&q=80',
                            'Industrial Plastic Crates': 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&h=600&q=80',
                            'Other Products': 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&h=600&q=80'
                          };
                          e.currentTarget.src = fallbackMap[selectedCategory || ''] || fallbackMap['Other Products'];
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <h2 className="absolute bottom-4 left-4 text-white text-lg font-bold">{subcategoryData.name}</h2>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                    <p className="text-gray-600 dark:text-gray-300">
                      {subcategoryData.products.length} products
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Product Layer - Selected Product View */}
        {layer === 'product' && selectedCategory && selectedSubcategory && selectedProduct && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 h-64 md:h-auto relative">
                <ProductImage 
                  product={selectedProduct}
                  className="w-full h-full"
                  alt={selectedProduct.name}
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedProduct.name}</h2>
                    {selectedProduct.brand && (
                      <p className="text-brand-warm-orange font-medium">Brand: {selectedProduct.brand}</p>
                    )}
                    {selectedProduct.series && (
                      <p className="text-gray-500 dark:text-gray-400">Series: {selectedProduct.series}</p>
                    )}
                    {selectedProduct.id && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Product ID: {selectedProduct.id}</p>
                    )}
            </div>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate(`/products/${createSlug(selectedCategory)}/${createSlug(selectedSubcategory)}`);
                    }}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    {selectedProduct.features && selectedProduct.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 product-features">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedProduct.material && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Material</h3>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProduct.material}</p>
                      </div>
                    )}
                    
                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Available Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sizes.map((size, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{size}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Available Colors</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map((color, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{color}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Available Variants</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {Array.isArray(selectedProduct.variants) && selectedProduct.variants.map((variant, index) => (
                            <li key={index}>{typeof variant === 'string' ? variant : variant.name || variant.size || variant.color || variant.model || JSON.stringify(variant).replace(/[{}"]/g, '')}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedProduct.models && selectedProduct.models.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Available Models</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedProduct.models.map((model, index) => (
                            <li key={index}><span className="font-medium">{model.model_no}</span>: {model.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedProduct.capacities && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Available Capacities</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.capacities.map((capacity, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{capacity}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.price_per_kg && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price</h3>
                        <p className="text-gray-600 dark:text-gray-300">₹{selectedProduct.price_per_kg} per kg</p>
                      </div>
                    )}
                    
                    {selectedProduct.moq && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Minimum Order Quantity</h3>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProduct.moq} units</p>
                          </div>
                        )}
                    
                    {selectedProduct.packaging && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Packaging</h3>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProduct.packaging}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {(selectedProduct.outer_dimension || selectedProduct.inner_dimension || selectedProduct.capacity_l) && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedProduct.outer_dimension && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Outer Dimension</p>
                          <p className="text-gray-700 dark:text-gray-300">{selectedProduct.outer_dimension}</p>
                        </div>
                      )}
                      {selectedProduct.inner_dimension && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Inner Dimension</p>
                          <p className="text-gray-700 dark:text-gray-300">{selectedProduct.inner_dimension}</p>
                        </div>
                      )}
                      {selectedProduct.capacity_l && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                          <p className="text-gray-700 dark:text-gray-300">{selectedProduct.capacity_l} L</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <button className="px-6 py-3 bg-brand-warm-orange text-white rounded-md hover:bg-brand-warm-orange/80 transition-colors cursor-pointer">
                    Contact for Inquiry
                  </button>
                </div>
              </div>
              </div>
          </div>
        )}

        {/* Product Layer - Product Cards */}
        {layer === 'product' && selectedCategory && selectedSubcategory && !selectedProduct && (
          <div className="grid-responsive">
            {catalog
              .find(cat => cat.category === selectedCategory)
              ?.subcategories
              .find(sub => sub.name === selectedSubcategory)
              ?.products.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => goToProduct(product)}
                  className="product-card scale-hover cursor-pointer"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <ProductImage 
                      product={product}
                      className="w-full h-full"
                      alt={product.name}
                      showLoader={false}
                    />
                    {product.brand && (
                      <div className="absolute top-2 right-2 bg-brand-warm-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.brand}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                    
                    {product.series && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Series: {product.series}</p>
                    )}
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">{product.description}</p>
                    
                    {/* Show variants count or sizes */}
                    {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} available
                      </p>
                    )}
                    
                    {product.sizes && product.sizes.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {product.sizes.length} size{product.sizes.length !== 1 ? 's' : ''} available
                      </p>
                    )}
                    
                    {product.models && product.models.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {product.models.length} model{product.models.length !== 1 ? 's' : ''} available
                      </p>
                    )}
                    
                    <button className="mt-3 px-4 py-2 bg-brand-warm-orange/10 text-brand-warm-orange rounded-md hover:bg-brand-warm-orange/20 transition-colors text-sm cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;