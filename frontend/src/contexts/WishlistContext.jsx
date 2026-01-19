import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSnackbar } from './SnackbarContext';
import { useAuthModal } from './AuthModalContext';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { openLogin } = useAuthModal();
  const API_URL = import.meta.env.VITE_SERVER_URL;

  // No localStorage fallback: empty wishlist until server provides data when logged in
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadServerWishlist = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/users/getwhislist`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          // data is array of product objects
          const mapped = data.data.map(p => ({ id: p._id || p.id, ...p }));
          setWishlistItems(mapped);
        }
      } catch (err) {
        console.error('Failed to load wishlist', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadServerWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // no localStorage persistence

  const addToWishlist = (product) => {
    if (!user) { openLogin(); return; }

    const productId = product._id || product.id;

    setWishlistItems(prev => {
      if (!prev.some(item => item.id === productId)) {
        return [...prev, { id: productId, _id: productId, ...product }];
      }
      return prev;
    });
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/addtowhislist/${productId}`, { method: 'POST', credentials: 'include' });
        const data = await res.json();
        console.log('addToWishlist response', data);
        if (res.ok) showSnackbar(data.message || 'Added to wishlist', 'success');
      } catch (err) {
        console.error('addToWishlist error', err);
        showSnackbar('Network error while adding to wishlist', 'error');
      }
    })();
  };

  const removeFromWishlist = (productId) => {
    if (!user) { openLogin(); return; }
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/removefromwhislist/${productId}`, { method: 'DELETE', credentials: 'include' });
        const data = await res.json();
        if (res.ok) showSnackbar(data.message || 'Failed to remove from wishlist', 'success');
      } catch (err) {
        console.error('removeFromWishlist error', err);
        showSnackbar('Network error while removing from wishlist', 'error');
      }
    })();
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
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