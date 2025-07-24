import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Package, AlertCircle, Search } from 'lucide-react';
import { loadProducts } from '../utils/productLoader';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProductImage from '../components/Products/ProductImage';
import SearchBar from '../components/Products/SearchBar';
import { getCategoryImage, getSubcategoryImage } from '../utils/imageUtils';

// Helper to flatten and regroup products by new categories
function regroupCatalog(rawCatalog: any): Record<string, any[]> {
  // Helper for Dyna Metal Pen
  const dynaPen: any[] = [];
  // Helper for House Hold Products
  const houseHold: any[] = [];
  // Helper for Kitchen Appliances
  const kitchen: any[] = [];
  // Helper for Saran Enterprises
  const saran: any[] = [];
  // Helper for Other
  const other: any[] = [];
  // Helper for additional catalogs
  const additional: Record<string, any[]> = {};

  // Go through all categories and subcategories
  Object.entries(rawCatalog).forEach(([cat, catObj]: [string, any]) => {
    if (!catObj.subcategories) return;
    Object.entries(catObj.subcategories).forEach(([sub, subObj]: [string, any]) => {
      if (!subObj.products) return;
      subObj.products.forEach((product: any) => {
        // Dyna Metal Pen
        if (
          cat.toLowerCase().includes('dyna') ||
          product.name?.toLowerCase().includes('dyna')
        ) {
          dynaPen.push(product);
        }
        // House Hold Products
        else if (
          cat.toLowerCase().includes('household') ||
          cat.toLowerCase().includes('house hold') ||
          product.name?.toLowerCase().includes('bucket') ||
          product.name?.toLowerCase().includes('mug')
        ) {
          houseHold.push(product);
        }
        // Kitchen Appliances
        else if (
          cat.toLowerCase().includes('kitchen') ||
          cat.toLowerCase().includes('cookware') ||
          product.category?.toLowerCase().includes('cookware') ||
          product.category?.toLowerCase().includes('pressure cooker') ||
          product.name?.toLowerCase().includes('stove') ||
          product.name?.toLowerCase().includes('kettle')
        ) {
          kitchen.push(product);
        }
        // Saran Enterprises
        else if (
          cat.toLowerCase().includes('saran') ||
          product.name?.toLowerCase().includes('saran')
        ) {
          saran.push(product);
        }
        // Other
        else if (
          cat.toLowerCase().includes('other') ||
          product.category?.toLowerCase().includes('other')
        ) {
          other.push(product);
        }
        // Additional catalogs (by file/category name)
        else {
          if (!additional[cat]) additional[cat] = [];
          additional[cat].push(product);
        }
      });
    });
  });

  return {
    'Dyna Metal Pen': dynaPen,
    'House Hold Products': houseHold,
    'Kitchen Appliances': kitchen,
    'Saran Enterprises': saran,
    'Other': other,
    ...additional,
  };
}

// Helper function to create URL-friendly slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^ -\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to find category, subcategory or product by slug
const findBySlug = (items: any[], slug: string): any | undefined => {
  return items.find(item => createSlug(item.name || item.category) === slug);
};

const Products: React.FC = () => {
  const [catalog, setCatalog] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [layer, setLayer] = useState<'category' | 'subcategory' | 'product'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const navigate = useNavigate();
  const { categorySlug, subcategorySlug, productSlug } = useParams();

  // Load catalog data
  useEffect(() => {
    const loadCatalogData = async () => {
      setLoading(true);
      try {
        const data = await loadProducts();
        setCatalog(regroupCatalog(data));
        setError(null);
      } catch (err: any) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    loadCatalogData();
  }, []);

  // Navigation logic (from upstream)
  useEffect(() => {
    if (loading || error || !catalog) return;
    if (categorySlug) {
      const category = Object.keys(catalog).find(cat => createSlug(cat) === categorySlug);
      if (category) {
        setSelectedCategory(category);
        setLayer('subcategory');
        if (subcategorySlug) {
          const subcategory = catalog[category].find((sub: any) => createSlug(sub.name) === subcategorySlug);
          if (subcategory) {
            setSelectedSubcategory(subcategory.name);
            setLayer('product');
            if (productSlug) {
              const product = subcategory.products.find((prod: any) => createSlug(prod.name) === productSlug);
              if (product) {
                setSelectedProduct(product);
              }
            }
          }
        }
      }
    }
  }, [catalog, categorySlug, subcategorySlug, productSlug, loading, error]);

  // Search functionality (from upstream, but adapted)
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    let results: any[] = [];
    Object.entries(catalog).forEach(([cat, subcats]: any) => {
      if (cat.toLowerCase().includes(search.toLowerCase())) {
        results.push({ type: 'category', name: cat });
      }
      subcats.forEach((sub: any) => {
        if (sub.name.toLowerCase().includes(search.toLowerCase())) {
          results.push({ type: 'subcategory', name: sub.name, category: cat });
        }
        sub.products.forEach((prod: any) => {
          if (prod.name && prod.name.toLowerCase().includes(search.toLowerCase())) {
            results.push({ type: 'product', name: prod.name, category: cat, subcategory: sub.name, product: prod });
          }
        });
      });
    });
    return results.slice(0, 15);
  }, [search, catalog]);

  // Navigation functions (from upstream, adapted)
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

  const goToProduct = (product: any) => {
    setSelectedProduct(product);
    navigate(`/products/${createSlug(product.category)}/${createSlug(product.subcategory)}/${createSlug(product.name)}`);
  };
  
  const goBack = () => {
    if (layer === 'subcategory') {
      setLayer('category');
      setSelectedCategory(null);
      navigate('/products');
    } else if (layer === 'product') {
      if (!selectedProduct) {
        setLayer('subcategory');
        setSelectedSubcategory(null);
        navigate(`/products/${createSlug(selectedCategory as string)}`);
      } else {
        // If viewing a specific product, go back to its subcategory
        setSelectedProduct(null);
        navigate(`/products/${createSlug(selectedCategory as string)}/${createSlug(selectedSubcategory as string)}`);
      }
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

  // Breadcrumbs (from upstream, adapted)
  const breadcrumbs = [
    { label: 'Categories', onClick: () => { setLayer('category'); setSelectedCategory(null); setSelectedSubcategory(null); setSelectedProduct(null); navigate('/products'); } },
  ];
  if (selectedCategory) breadcrumbs.push({ label: selectedCategory, onClick: () => { setLayer('subcategory'); setSelectedSubcategory(null); setSelectedProduct(null); navigate(`/products/${createSlug(selectedCategory)}`); } });
  if (selectedSubcategory) breadcrumbs.push({ label: selectedSubcategory, onClick: () => { setLayer('product'); setSelectedProduct(null); navigate(`/products/${createSlug(selectedCategory as string)}/${createSlug(selectedSubcategory)}`); } });
  if (selectedProduct) breadcrumbs.push({ label: selectedProduct.name, onClick: () => {} });

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-brand-cream dark:bg-brand-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-light-secondary dark:text-dark-secondary text-lg">Loading product catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-brand-cream dark:bg-brand-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-light-secondary dark:text-dark-secondary text-lg">{error}</p>
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

  // Render UI (category/subcategory/product layers, search, breadcrumbs, etc.)
  // ... (reuse/adapt the incoming UI, but keep search and navigation from upstream)

  return (
    <div className="pt-16 min-h-screen bg-brand-cream dark:bg-brand-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
              Product Catalog
            </h1>
            <p className="text-light-secondary dark:text-dark-secondary">
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
            {/* Search Bar */}
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
                  {search.trim() !== '' && searchResults.length === 0 && (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No results found for "{search}"
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
                                src={getSubcategoryImage(result.category, result.name)}
                                alt={result.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {result.type === 'category' && (
                              <img 
                                src={getCategoryImage(result.name)}
                                alt={result.name}
                                className="w-full h-full object-cover"
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
              className="p-2 rounded-full bg-white dark:bg-brand-dark-card shadow-md hover:bg-brand-warm-orange hover:text-white transition-all duration-300 mr-2"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <button
                onClick={crumb.onClick}
                className="text-brand-warm-orange hover:underline transition-colors font-medium"
                title={crumb.label && crumb.label.trim() !== '' ? crumb.label : 'Breadcrumb'}
              >
                {crumb.label && crumb.label.trim() !== '' ? crumb.label : 'Breadcrumb'}
              </button>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </span>
          ))}
        </div>
        {/* Category/Subcategory/Product layers (reuse incoming UI, but navigation/search from upstream) */}
        {layer === 'category' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(catalog).map(([category, subcategories], idx) => (
              <div key={category} className="bg-white dark:bg-brand-dark-card rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl" onClick={() => goToCategory(category)}>
                <div className="h-40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img
                    src={getCategoryImage(category)}
                    alt={category}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for failed image loads
                      e.currentTarget.src = "https://images.unsplash.com/photo-1557801200-2f9769722036?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&h=400&q=60";
                    }}
                  />
                  <h2 className="absolute bottom-3 left-3 text-white text-xl font-bold z-20">{category}</h2>
                </div>
                <div className="p-4">
                  <p className="text-light-secondary dark:text-dark-secondary">
                    {Array.isArray(subcategories) ? subcategories.length : 0} subcategories
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {layer === 'subcategory' && selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-6">
              {selectedCategory} Subcategories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalog[selectedCategory]?.map((subcategoryData: any, index: number) => (
                <div 
                  key={subcategoryData.name} 
                  onClick={() => goToSubcategory(subcategoryData.name)}
                  className="bg-white dark:bg-brand-dark-card rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-40 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img
                      src={getSubcategoryImage(selectedCategory, subcategoryData.name)}
                      alt={subcategoryData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for failed image loads
                        e.currentTarget.src = "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVjdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&h=400&q=60";
                      }}
                    />
                    <h3 className="absolute bottom-3 left-3 text-white text-xl font-bold z-20">{subcategoryData.name}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-light-secondary dark:text-dark-secondary">
                      {subcategoryData.products.length} products
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {layer === 'product' && selectedCategory && selectedSubcategory && !selectedProduct && (
          <div>
            <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-2">
              {selectedSubcategory} Products
            </h2>
            <p className="text-light-secondary dark:text-dark-secondary mb-6">{selectedCategory} Collection</p>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalog[selectedCategory]
                ?.find((sub: any) => sub.name === selectedSubcategory)
                ?.products.map((product: any, index: number) => (
                  <div 
                    key={index}
                    onClick={() => goToProduct(product)}
                    className="bg-white dark:bg-brand-dark-card rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-48 overflow-hidden">
                      <ProductImage
                        product={product}
                        className="w-full h-full object-cover"
                        alt={product.name}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-light-secondary dark:text-dark-secondary text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {layer === 'product' && selectedCategory && selectedSubcategory && selectedProduct && (
          <div className="bg-white dark:bg-brand-dark-card rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-80 md:h-96">
                  <ProductImage
                    product={selectedProduct}
                    className="w-full h-full object-contain"
                    alt={selectedProduct.name}
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-3">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-brand-warm-orange mb-4">
                  {selectedProduct.subcategory} / {selectedProduct.category}
                </p>
                <p className="text-light-secondary dark:text-dark-secondary mb-6">
                  {selectedProduct.description}
                </p>
                
                {/* Product Details */}
                <div className="space-y-4">
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-2">Features</h4>
                      <ul className="list-disc ml-5 space-y-1 text-light-secondary dark:text-dark-secondary">
                        {selectedProduct.features.map((feature: string, idx: number) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-2">Available Sizes</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-2">Available Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((color: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedProduct.models && selectedProduct.models.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-2">Models</h4>
                      <div className="space-y-2">
                        {selectedProduct.models.map((model: any, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-brand-warm-orange" />
                            <span className="text-light-primary dark:text-dark-primary">
                              {model.model_no}: {model.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional product information */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {selectedProduct.material && (
                      <div>
                        <h4 className="text-sm text-light-secondary dark:text-dark-secondary">Material</h4>
                        <p className="text-light-primary dark:text-dark-primary">{selectedProduct.material}</p>
                      </div>
                    )}
                    {selectedProduct.capacity_l && (
                      <div>
                        <h4 className="text-sm text-light-secondary dark:text-dark-secondary">Capacity</h4>
                        <p className="text-light-primary dark:text-dark-primary">{selectedProduct.capacity_l} L</p>
                      </div>
                    )}
                    {selectedProduct.outer_dimension && (
                      <div>
                        <h4 className="text-sm text-light-secondary dark:text-dark-secondary">Outer Dimensions</h4>
                        <p className="text-light-primary dark:text-dark-primary">{selectedProduct.outer_dimension}</p>
                      </div>
                    )}
                    {selectedProduct.inner_dimension && (
                      <div>
                        <h4 className="text-sm text-light-secondary dark:text-dark-secondary">Inner Dimensions</h4>
                        <p className="text-light-primary dark:text-dark-primary">{selectedProduct.inner_dimension}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="px-6 py-3 bg-brand-warm-orange text-white rounded-lg hover:bg-brand-mustard transition-colors"
                  >
                    Inquire About This Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;