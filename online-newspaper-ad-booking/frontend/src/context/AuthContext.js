import React, { createContext, useState, useEffect } from "react";
import { getUserData } from "../services/api";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced fetchUser function with proper error handling
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");

    if (!token) {
      console.log("No token found - user not authenticated");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await getUserData();
      
      if (userData) {
        // Merge data from localStorage and API response
        const completeUser = {
          ...userData,
          token,
          role: userData.role || storedRole,
          id: userData.id || storedUserId
        };
        
        setUser(completeUser);
        
        // Ensure localStorage is up-to-date
        localStorage.setItem("userRole", completeUser.role);
        localStorage.setItem("userId", completeUser.id);
      } else {
        console.warn("Invalid token - clearing authentication");
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError(error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, userData) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userId", userData.id);
    }
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setUser(null);
    setError(null);
  };

  // Check authentication state on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();
    };
    initializeAuth();
  }, []);

  // Value provided to consuming components
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    fetchUser,
    isAdmin: user?.role === "admin"
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};