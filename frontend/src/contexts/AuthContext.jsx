import React, { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";
import { useSnackbar } from "./SnackbarContext";
import { signInWithRedirect, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();
  const { showSnackbar } = useSnackbar();

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      if (res.data?.data?.user) {
        setUser(res.data.data.user);
        showAlert(res.data.message, "success", 3000);
        return res.data.data.user;
      }

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Login failed",
        "error",
        3000
      );
      throw err;
    }
  };

  // ================= GOOGLE LOGIN (Redirect Trigger) =================
  const googleLogin = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  // ================= HANDLE GOOGLE REDIRECT =================
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("Firebase user:", firebaseUser);

    if (!firebaseUser) {
      console.log("No firebase user after redirect");
      return;
    }

    try {
      const idToken = await firebaseUser.getIdToken();
      console.log("Firebase token received");

      const res = await api.post("/api/v1/users/google-login", {
        idToken,
      });

      console.log("Backend response:", res.data);

      setUser(res.data.data);
    } catch (error) {
      console.error("Google login error:", error);
    }
  });

  return () => unsubscribe();
}, []);

  // ================= SIGNUP =================
  const signup = async (email, password, name) => {
    try {
      const res = await api.post("/api/v1/users/register", {
        name,
        email,
        password,
      });

      if (res.data?.data?.user) {
        setUser(res.data.data.user);
        showAlert(res.data.message, "success", 2000);
        return res.data.data.user;
      }

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Signup failed",
        "error",
        3000
      );
      throw err;
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      const res = await api.post("/api/v1/users/logout");

      if (res.status === 200) {
        setUser(null);
        showAlert(res.data.message, "success", 2000);
      }

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Logout failed",
        "error",
        2000
      );
    }
  };

  // ================= FETCH LOGGED IN USER =================
  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/users/loggedinuser");

      if (res.status === 200 && res.data?.data) {
        setUser(res.data.data);
      }

    } catch (err) {
      console.error("fetchUser error", err);

      showSnackbar("Failed to fetch user, Kindly login/signup", {
        severity: "error",
      });

    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL USER CHECK =================
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    fetchUser,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}