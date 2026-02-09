import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "./SnackbarContext";
import { useAuthModal } from "./AuthModalContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { openLogin } = useAuthModal();

  const API_URL = import.meta.env.VITE_SERVER_URL;

  // No localStorage fallback: keep cart in memory; server is source of truth when logged in
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // When a user logs in, fetch their server cart and replace local cart
  const loadServerCart = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/cart`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const mapped = data.data.items.map((i) => ({
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
        const res = await fetch(
          `${API_URL}/api/v1/users/cart/add/${product._id}`,{ 
            method: "POST", 
            credentials: "include",
            body: JSON.stringify({ quantity }),
            headers:{
              "Content-Type": "application/json"
            }
          });
        const data = await res.json();
        if (res.ok) {
          loadServerCart();
          showSnackbar(data.message || "Failed to add to cart", "success");
        }
      } catch (err) {
        console.error("addToCart error", err);
        showSnackbar("Network error while adding to cart", "error");
      }
    })();
  };

  const removeFromCart = (productId) => {
    if (!user) {
      openLogin();
      return;
    }
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/users/cart/remove/${productId}`,
          { method: "POST", credentials: "include" },
        );
        const data = await res.json();
        if (res.ok) {
          loadServerCart();
          showSnackbar(data.message || "Failed to remove from cart", "success");
        }
      } catch (err) {
        console.error("removeFromCart error", err);
        showSnackbar("Network error while removing from cart", "error");
      }
    })();
  };

  const removeItemCart = async (productId) => {
    if (!user) {
      openLogin();
      return;
    }
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/users/cart/remove-item/${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          loadServerCart();
          showSnackbar(data.message || "Failed to remove from cart", "success");
        }
      } catch (error) {
        console.error("removeItemCart error", error);
        showSnackbar("Network error while removing from cart", "error");
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
            await fetch(`${API_URL}/api/v1/users/cart/add/${productId}`, {
              method: "POST",
              credentials: "include",
            });
            loadServerCart();
          }
        } else if (delta < 0) {
          for (let i = 0; i < Math.abs(delta); i++) {
            await fetch(`${API_URL}/api/v1/users/cart/remove/${productId}`, {
              method: "POST",
              credentials: "include",
            });
            loadServerCart();
          }
        }
      } catch (err) {
        console.error("updateQuantity sync error", err);
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
