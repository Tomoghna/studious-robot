import React, { createContext, useContext, useState } from "react";
import {initializeApp} from "firebase/app";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "firebase/auth";
import {useSnackbar} from "./SnackbarContext";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {showSnackbar} = useSnackbar();

  const API_URL = "http://localhost:8000"; //Replace with the backend url

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include", // ** Important to include for cookie-based sessions
      body: JSON.stringify({email, password}),
    });
    const data = await res.json();
    if(res.ok && data.data?.user) {
      setUser(data.data.user);
      showSnackbar("Logged in successfully!", "success", 3000);
      return data.data.user;
    }
    else {
      showSnackbar(data.message || "Login failed", "error", 3000);
      throw new Error(data.message || "Login failed");
    }
    }
    catch (err) {
      showSnackbar("Network or server error", "error", 2000);
      console.error(err);
      throw err;
    }
  };


  const signup = async (email, password, name) => {
    try {
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
        showSnackbar("Account created successfully!", "success", 2000);
        return data.data.user;
      }
      else {
        showSnackbar(data.message || "Signup failed", "error", 3000);
        throw new Error(data.message || "Signup failed");
      }
    }
    catch (err) {
      showSnackbar("Signup error!", "error", 4000);
      console.error(err);
      throw err;
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
      await fetch(`${API_URL}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      showSnackbar("Logged out successfully!", "info", 2000);
    }
    catch (err) {
      showSnackbar("Logout failed", "error", 2000);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/users/loggedinuser`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.data) setUser(data.data);
    } catch (err) {
      console.error('fetchUser error', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  const value = { user, loading, login, signup, logout, fetchUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}