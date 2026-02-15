import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CategoryContext = createContext({
  categories: [],
  loading: false,
  error: null,
  refreshCategories: () => {},
});

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_SERVER_URL;

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/v1/admin/category`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.data || []);
      } else {
        setError(data.message || "Failed to fetch categories...");
      }
    } catch (err) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        refreshCategories: fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
