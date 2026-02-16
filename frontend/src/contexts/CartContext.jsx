import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useSnackbar } from "./SnackbarContext";
import { useAuthModal } from "./AuthModalContext";
import api from "../utils/api";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { showAlert } = useAlert();
  const { openLogin } = useAuthModal();

  // No localStorage fallback: keep cart in memory; server is source of truth when logged in
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // When a user logs in, fetch their server cart and replace local cart
  const loadServerCart = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/api/v1/users/cart`);
      if (res.status === 200 && res.data?.data) {
        const mapped = res.data.data.items.map((i) => ({
          _id: i.product._id || i.product,
          name: i.product.name,
          price: i.price,
          images: i.product.images || [],
          quantity: i.quantity,
        }));
        setCartItems(mapped);
      }
    } catch (err) {
      console.error("Failed to load server cart", err);
      showSnackbar("Failed to load cart from server", {severity: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServerCart();
  }, [user]);

  const addToCart = (product, quantity) => {
    if (!user) {
      // prompt login instead of using localStorage fallback
      openLogin();
      showAlert("Please login to add items to cart", "info", 2000);
      return;
    }
    // optimistic UI update
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // sync to server
    (async () => {
      try {
        const res = await api.post(`/api/v1/users/cart/add/${product._id}`,{
          quantity
        });
        if (res.status === 200) {
          loadServerCart();
          showSnackbar(res.data?.message || "Added to cart successfully", {severity: "success"});
        }
      } catch (err) {
        console.error("addToCart error", err);
        showSnackbar(err.message || "Network error while adding to cart", {severity: "error"});
      }
    })();
  };

  const removeFromCart = (productId) => {
    if (!user) {
      openLogin();
      showAlert("Please login to remove items from cart", "info", 2000);
      return;
    }
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    (async () => {
      try {
        const res = await api.post(`/api/v1/users/cart/remove/${productId}`,);
        if (res.status === 200) {
          loadServerCart();
          showSnackbar(res.data?.message || "Removed from cart successfully", {severity: "success"});
        }
      } catch (err) {
        console.error("removeFromCart error", err);
        showSnackbar(err.message ||"Network error while removing from cart", {severity: "error"});
      }
    })();
  };

  const removeItemCart = async (productId) => {
    if (!user) {
      openLogin();
      showAlert("Please login to remove items from cart", "info", 2000);
      return;
    }
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    (async () => {
      try {
        const res = await api.delete(`/api/v1/users/cart/remove-item/${productId}`);
        if (res.status === 200) {
          loadServerCart();
          showSnackbar(res.data?.message || "Removed item from cart successfully", {severity: "success"});
        }
      } catch (error) {
        console.error("removeItemCart error", error);
        showSnackbar(error.message || "Network error while removing from cart", {severity: "error"});
      }
    })();
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const prevItem = cartItems.find((i) => i._id === productId);
    const prevQuantity = prevItem ? prevItem.quantity : 0;

    if (!user) {
      openLogin();
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    );

    const delta = quantity - prevQuantity;
    (async () => {
      try {
        if (delta > 0) {
          for (let i = 0; i < delta; i++) {
            const res = await api.post(`/api/v1/users/cart/add/${productId}`, {
              quantity: 1
            });
            if(res.status === 200){
              loadServerCart();
            }
          }
        } else if (delta < 0) {
          for (let i = 0; i < Math.abs(delta); i++) {
            const res = await api.post(`/api/v1/users/cart/remove/${productId}`);
            if(res.status === 200){
              loadServerCart();
            }
          }
        }
      } catch (err) {
        console.error("updateQuantity sync error", err);
        useAlert("Something went wrong while updating cart quantity, Please try again!", "error", 2000);
      }
    })();
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartItemCount,
    getCartTotal,
    removeItemCart,
    isLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
