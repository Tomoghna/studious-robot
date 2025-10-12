import React, { createContext, useContext, useState } from "react";
import {initializeApp} from "firebase/app";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:8000"; //Replace with the backend url

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const res = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include", // ** Important to include for cookie-based sessions
      body: JSON.stringify({idToken}),
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const res = await fetch(`${API_URL}/api/v1/users/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({idToken, name}),
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
    await signOut(auth);
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

  const value = { user, login, signup, logout, fetchUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}