import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from './Card';

export default function SearchResults() {
  const { filteredProducts, searchQuery, selectedCategory } = useProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Search Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredProducts.length === 0 ? (
            `No results found for "${searchQuery}"${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}`
          ) : (
            `Found ${filteredProducts.length} result${filteredProducts.length === 1 ? '' : 's'} for "${searchQuery}"${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}`
          )}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Go back
          </button>
        </div>
      )}
    </div>
  );
}