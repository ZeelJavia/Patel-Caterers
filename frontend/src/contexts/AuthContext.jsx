import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const savedAuth = localStorage.getItem("patel_caterers_auth");
    const savedAdmin = localStorage.getItem("patel_caterers_admin");
    if (savedAuth === "true" && savedAdmin) {
      setIsAuthenticated(true);
      setAdminEmail(savedAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await ApiService.login(email, password);

      if (data.success) {
        setIsAuthenticated(true);
        setAdminEmail(data.user.email);
        localStorage.setItem("patel_caterers_auth", "true");
        localStorage.setItem("patel_caterers_admin", data.user.email);
        localStorage.setItem("patel_caterers_token", data.token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail("");
    localStorage.removeItem("patel_caterers_auth");
    localStorage.removeItem("patel_caterers_admin");
    localStorage.removeItem("patel_caterers_token");
  };

  const value = {
    isAuthenticated,
    adminEmail,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
