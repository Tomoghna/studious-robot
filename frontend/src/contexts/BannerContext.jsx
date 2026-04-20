import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "./AlertContext";

const BannerContext = createContext({
  banners: [],
  loading: false,
  error: null,
  refreshBanners: () => {},
});

export function BannerProvider({ children }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showAlert } = useAlert();

  const API_URL = import.meta.env.VITE_SERVER_URL;

  if (!API_URL) {
    setError("Server URL not configured");
    showAlert("Server URL not configured", "error", 5000);
    setLoading(false);
  }

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/v1/admin/banner`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setBanners(data.data || []);
      } else {
        setBanners([]);
        setError(data.message || "Failed to fetch banners...");
      }
    } catch (err) {
      setBanners([]);
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return (
    <BannerContext.Provider
      value={{
        banners,
        loading,
        error,
        refreshBanners: fetchBanners,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}

export function useBanners() {
  return useContext(BannerContext);
}
