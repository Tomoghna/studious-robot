import React, { createContext, useContext, useState } from 'react';
import LoginModal from '../components/LoginModal';

const AuthModalContext = createContext();

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openLogin = () => setOpen(true);
  const closeLogin = () => setOpen(false);

  return (
    <AuthModalContext.Provider value={{ openLogin, closeLogin }}>
      {children}
      <LoginModal isOpen={open} onClose={closeLogin} />
    </AuthModalContext.Provider>
  );
}
