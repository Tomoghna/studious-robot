import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "./SnackbarContext";
import { useAlert } from "./AlertContext";
import { useAuthModal } from "./AuthModalContext";
import api from "../utils/api";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { showAlert } = useAlert();
  const { openLogin } = useAuthModal();

  // No localStorage fallback: empty wishlist until server provides data when logged in
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadServerWishlist = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/api/v1/users/getwhislist`);
      if (res.status === 200) {
        // data is array of product objects
        const mapped = res.data.data.map((p) => ({ id: p._id || p.id, ...p }));
        setWishlistItems(mapped);
      }
    } catch (err) {
      console.error("Failed to load wishlist", err);
      showSnackbar("Failed to load wishlist from server", {severity: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServerWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // no localStorage persistence

  const addToWishlist = (product) => {
    if (!user) {
      openLogin();
      showAlert("Please login to add items to wishlist", "info", 2000);
      return;
    }

    const productId = product._id || product.id;

    setWishlistItems((prev) => {
      if (!prev.some((item) => item.id === productId)) {
        return [...prev, { id: productId, _id: productId, ...product }];
      }
      return prev;
    });
    (async () => {
      try {
        const res = await api.post(`/api/v1/users/addtowhislist/${productId}`);
        if (res.status === 200)
          showSnackbar(res.data.message || "Added to wishlist", {severity: "success"});
      } catch (err) {
        console.error("addToWishlist error", err);
        showSnackbar("Network error while adding to wishlist", {severity: "error"});
      }
    })();
  };

  const removeFromWishlist = (productId) => {
    if (!user) {
      openLogin();
      showAlert("Please login to remove items from wishlist", "info", 2000);
      return;
    }
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    (async () => {
      try {
        const res = await api.delete(`/api/v1/users/removefromwhislist/${productId}`);
        if (res.status === 200)
          showSnackbar(
            res.data.message || "Removed from wishlist",
            {severity: "success"}
          );
      } catch (err) {
        console.error("removeFromWishlist error", err);
        showSnackbar("Network error while removing from wishlist", {severity: "error"});
      }
    })();
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
