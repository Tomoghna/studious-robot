import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // implement login logic here
  };

  const value = { user, login };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export {AuthContext};