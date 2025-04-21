import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Initialize with sample products
  useEffect(() => {
    // This would typically be an API call
    const initialProducts = [
      {
        id: 1,
        name: "Radha Krishna Garden",
        description: "Beautiful handmade painting by ParamShantim Das.",
        price: 300,
        category: "paintings",
        images: ["/products/product-1.jpg", "/products/product-2.jpg", "/products/product-3.jpg"],
        isNew: true,
        rating: 4.5
      },
      {
        id: 2,
        name: "Golden Incense Box",
        description: "Antique handmade incense box made out of bamboo.",
        price: 150,
        category: "incense-boxes",
        images: ["/products/product-4.jpg", "/products/product-5.jpg", "/products/product-6.jpg"],
        rating: 4.0
      },
      {
        id: 3,
        name: "Peacock Incense Holder",
        description: "Unique handmade bamboo incense holder with beautiful peacock design.",
        price: 200,
        category: "incense-holders",
        images: ["/products/product-7.jpg", "/products/product-8.jpg", "/products/product-9.jpg"],
        isNew: true,
        rating: 4.8
      },
      {
        id: 4,
        name: "Hummingbird Pot",
        description: "A simple pot made out of bamboo handmade.",
        price: 250,
        category: "pots",
        images: ["/products/product-10.jpg", "/products/product-11.jpg", "/products/product-12.jpg"],
        rating: 4.2
      },
      {
        id: 5,
        name: "Krishna with Sudama",
        description: "Artistic painting portraying Krishna and Sudama by ParamShantim Das.",
        price: 350,
        category: "paintings",
        images: ["/products/product-13.jpg", "/products/product-14.jpg", "/products/product-15.jpg"],
        rating: 4.7
      },
      {
        id: 6,
        name: "Wall Alter with Krishna",
        description: "Simple wall alters for hanging with Krishna design.",
        price: 180,
        category: "wall-alters",
        images: ["/products/product-16.jpg", "/products/product-1.jpg", "/products/product-2.jpg"],
        rating: 4.3
      },
      {
        id: 7,
        name: "Honey Bees Incense Holder",
        description: "Simple but unique handmade incense holder with Honey bees design.",
        price: 120,
        category: "incense-holders",
        images: ["/products/product-3.jpg", "/products/product-4.jpg", "/products/product-5.jpg"],
        rating: 4.1
      },
      {
        id: 8,
        name: "Incense Box with Swan",
        description: "Simple but unique handmade incense box with antique swan design.",
        price: 140,
        category: "incense-boxes",
        images: ["/products/product-6.jpg", "/products/product-7.jpg", "/products/product-8.jpg"],
        rating: 4.4
      },
      {
        id: 9,
        name: "Radha Madhava",
        description: "Unique and artistic painting portraying Radha Madhava by ParamShantim Das.",
        price: 400,
        category: "paintings",
        images: ["/products/product-9.jpg", "/products/product-10.jpg", "/products/product-11.jpg"],
        isNew: true,
        rating: 4.9
      },
    ];
    setProducts(initialProducts);
    setFilteredProducts(initialProducts);
  }, []);

  const searchProducts = (query, category = selectedCategory, price = priceRange) => {
    const newQuery = query || searchQuery;
    const newCategory = category || 'all';
    
    setSearchQuery(newQuery);
    setSelectedCategory(newCategory);
    setPriceRange(price);

    let results = products;

    // Apply category filter
    if (newCategory && newCategory !== 'all') {
      results = results.filter(product => product.category === newCategory);
    }

    // Apply price filter
    results = results.filter(product => 
      product.price >= price.min && product.price <= price.max
    );

    // Apply search query
    if (newQuery) {
      const searchLower = newQuery.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(results);
    return results;
  };

  const value = {
    products,
    filteredProducts,
    searchQuery,
    selectedCategory,
    priceRange,
    searchProducts,
    setPriceRange,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}