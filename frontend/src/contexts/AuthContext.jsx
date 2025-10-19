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
      credentials: "include", 
      body: JSON.stringify({email, password}),
    });
    const data = await res.json();
    if(res.ok && data.data?.user) {
      setUser(data.data.user);
      return data.data.user;
    }
    else {
      throw new Error(data.message || "Login failed");
    }
  };


  const signup = async (email, password, name) => {
    const res = await fetch(`${API_URL}/api/v1/users/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({name,email, password}),
    });
    const data = await res.json();
    if(res.ok && data.data?.user) {
      setUser(data.data.user);
      return data.data.user;
    }
    else {
      throw new Error(data.message || "Signup failed");
    }
  } ;


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

  // const updateProfile = async (newAddress, phone)=>{
  //   const res = await fetch(`${API_URL}/api/v1/users/updateprofile`,{
  //     method:"PATCH",
  //     headers: {"Content-Type": "application/json"},
  //     credentials:"include",
  //     body: JSON.stringify({newAddress, phone})
  //   })
  //   const data = await res.json();
  //   console.log(data);
  // }

  const value = { user, login, signup, logout, fetchUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}