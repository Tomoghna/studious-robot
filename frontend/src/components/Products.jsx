import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './Card';
import Pagination from './Pagination';

// Utility function for debouncing
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const CATEGORIES = [
  { id: 'paintings', name: 'Paintings' },
  { id: 'incense-boxes', name: 'Incense Boxes' },
  { id: 'incense-holders', name: 'Incense Holders' },
  { id: 'pots', name: 'Pots' },
  { id: 'wall-alters', name: 'Wall Alters' },
];

const ITEMS_PER_PAGE = 6;

const sliderStyles = {
  rangeSlider: `
    appearance-none
    h-1
    bg-gray-200 dark:bg-gray-700
    rounded-lg
    cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  thumb: `
    appearance-none
    w-4 h-4
    bg-blue-500 dark:bg-blue-400
    rounded-full
    cursor-pointer
    transition-colors
    hover:bg-blue-600 dark:hover:bg-blue-500
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `
};

const PriceFilter = ({ priceRange, onChange }) => {
  const [localRange, setLocalRange] = useState(priceRange);
  const debouncedOnChange = useCallback(
    debounce((value) => {
      const validRange = {
        min: Math.min(value.min, value.max),
        max: Math.max(value.min, value.max)
      };
      onChange(validRange);
    }, 300),
    [onChange]
  );

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleChange = (value) => {
    const newRange = {
      min: Math.max(0, parseInt(value.min) || 0),
      max: Math.max(value.min, parseInt(value.max) || value.max)
    };
    setLocalRange(newRange);
    debouncedOnChange(newRange);
  };

  const handleSliderChange = (type, value) => {
    handleChange({
      ...localRange,
      [type]: parseInt(value)
    });
  };

  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
      <div className="space-y-4">
        <div className="relative pt-1">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Min</span>
            <span>Max</span>
          </div>
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              ${sliderStyles.thumb.replace(/\s+/g, ' ')}
            }
            input[type="range"]::-moz-range-thumb {
              ${sliderStyles.thumb.replace(/\s+/g, ' ')}
            }
          `}</style>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={localRange.min}
            onChange={(e) => handleSliderChange('min', e.target.value)}
            className={sliderStyles.rangeSlider}
          />
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={localRange.max}
            onChange={(e) => handleSliderChange('max', e.target.value)}
            className={`${sliderStyles.rangeSlider} mt-2`}
          />
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Min Price
            </label>
            <input
              type="number"
              min="0"
              max={localRange.max}
              value={localRange.min}
              onChange={(e) => handleChange({ ...localRange, min: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Max Price
            </label>
            <input
              type="number"
              min={localRange.min}
              value={localRange.max}
              onChange={(e) => handleChange({ ...localRange, max: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
            <span>{formatPrice(localRange.min)}</span>
            <span>{formatPrice(localRange.max)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const { products } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  // Initialize selected categories from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
    setCurrentPage(1);
  }, [searchParams]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      let newCategories;
      if (prev.includes(categoryId)) {
        newCategories = prev.filter(id => id !== categoryId);
      } else {
        newCategories = [...prev, categoryId];
      }
      // Update URL params
      if (newCategories.length > 0) {
        setSearchParams({ category: newCategories[0] });
      } else {
        setSearchParams({});
      }
      return newCategories;
    });
    setCurrentPage(1);
  };

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const hasActiveFilters = () => {
    return selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max !== Infinity;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchText.trim() === '' || product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategories.length > 0
      ? selectedCategories.includes(product.category)
      : true;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchParams({});
    setPriceRange({ min: 0, max: Infinity });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-4 sm:gap-8">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters sidebar */}
        <div className={`lg:col-span-3 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="space-y-3">
              {CATEGORIES.map(category => (
                <label
                  key={category.id}
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </label>
              ))}
            </div>
            <PriceFilter priceRange={priceRange} onChange={handlePriceChange} />
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-9">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedCategories.length > 0 
                    ? CATEGORIES.find(cat => cat.id === selectedCategories[0])?.name || 'Products'
                    : 'All Products'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                  Showing {Math.min(startIndex + 1, filteredProducts.length)}-
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              <div className="w-full sm:w-80">
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                  placeholder="Search products by name..."
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No products found in the selected categories.
              </p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}