import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:8000"; //Replace with the backend url

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include", // ** Important to include for cookie-based sessions
      body: JSON.stringify({email, password}),
    });
    const data = await res.json();
    if(res.ok && data.user) {
      setUser(data.user);
      return data.user;
    }
    else {
      throw new Error(data.message || "Login failed");
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/v1/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/api/v1/users/loggedinuser`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if(res.ok && data.data) {
      setUser(data.data);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  const value = { user, login, logout, fetchUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}