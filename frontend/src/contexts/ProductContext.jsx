import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

const API_URL = import.meta.env.VITE_SERVER_URL;

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with sample products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/products`);
      const data = await res.json();
      if (res.ok && data.data) {
        setProducts(data.data.products);
        setFilteredProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const searchProducts = (
    query,
    category = selectedCategory,
    price = priceRange,
  ) => {
    const newQuery = query || searchQuery;
    const newCategory = category || "all";

    setSearchQuery(newQuery);
    setSelectedCategory(newCategory);
    setPriceRange(price);

    let results = products;

    // Apply category filter
    if (newCategory && newCategory !== "all") {
      results = results.filter((product) => product.category === newCategory);
    }

    // Apply price filter
    results = results.filter(
      (product) => product.price >= price.min && product.price <= price.max,
    );

    // Apply search query
    if (newQuery) {
      const searchLower = newQuery.toLowerCase();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower),
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
    isLoading,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
