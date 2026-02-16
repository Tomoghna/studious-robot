import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "./AlertContext";
import { useSnackbar } from "./SnackbarContext";

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

  const { showAlert } = useAlert();
  const { showSnackbar } = useSnackbar();

  const API_URL = import.meta.env.VITE_SERVER_URL;

  if (!API_URL) {
    setError("Server URL not configured");
    showAlert("Server URL not configured", "error", 5000);
    setLoading(false);
    return;
  }

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
        setCategories([]);
        setError(data.message || "Failed to fetch categories...");
        showAlert(data.message || "Failed to fetch categories, Somethings went wrong!", "error", 3000);
      }
    } catch (err) {
      setCategories([]);
      setError(err?.message ?? "Something went wrong");
      showAlert(err?.message ?? "Something went wrong while fetching categories!", "error", 3000);
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
