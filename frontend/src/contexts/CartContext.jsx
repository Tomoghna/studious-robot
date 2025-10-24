import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSnackbar } from './SnackbarContext';
import { useAuthModal } from './AuthModalContext';

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

  // When a user logs in, fetch their server cart and replace local cart
  useEffect(() => {
    const loadServerCart = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/api/v1/users/cart`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.data) {
          // backend returns cart with items array of { product, quantity, price }
          const mapped = data.data.items.map(i => ({ id: i.product._id || i.product, name: i.product.name, price: i.price, images: i.product.images || [], quantity: i.quantity }));
          setCartItems(mapped);
        }
      } catch (err) {
        console.error('Failed to load server cart', err);
      }
    };
    loadServerCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // no localStorage persistence per request

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      // prompt login instead of using localStorage fallback
      openLogin();
      return;
    }
    // optimistic UI update
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // sync to server
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/cart/add/${product.id}`, { method: 'POST', credentials: 'include' });
        const data = await res.json();
        if (!res.ok) {
          showSnackbar(data.message || 'Failed to add to cart', 'error');
        }
      } catch (err) {
        console.error('addToCart error', err);
        showSnackbar('Network error while adding to cart', 'error');
      }
    })();
  };

  const removeFromCart = (productId) => {
    if (!user) { openLogin(); return; }
    setCartItems(prev => prev.filter(item => item.id !== productId));
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/cart/remove/${productId}`, { method: 'POST', credentials: 'include' });
        const data = await res.json();
        if (!res.ok) showSnackbar(data.message || 'Failed to remove from cart', 'error');
      } catch (err) {
        console.error('removeFromCart error', err);
        showSnackbar('Network error while removing from cart', 'error');
      }
    })();
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const prevItem = cartItems.find(i => i.id === productId);
    const prevQuantity = prevItem ? prevItem.quantity : 0;

    if (!user) { openLogin(); return; }

    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));

    const delta = quantity - prevQuantity;
    (async () => {
      try {
        if (delta > 0) {
          for (let i = 0; i < delta; i++) {
            await fetch(`${API_URL}/api/v1/users/cart/add/${productId}`, { method: 'POST', credentials: 'include' });
          }
        } else if (delta < 0) {
          for (let i = 0; i < Math.abs(delta); i++) {
            await fetch(`${API_URL}/api/v1/users/cart/remove/${productId}`, { method: 'POST', credentials: 'include' });
          }
        }
      } catch (err) {
        console.error('updateQuantity sync error', err);
      }
    })();
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    getCartItemCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}