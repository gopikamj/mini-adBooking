import React, { createContext, useState, useEffect } from "react";
import { getUserData } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ No token found, user is not logged in.");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setTimeout(async () => {  // ✅ Delay fetching to ensure token is stored
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem("token"); // Remove invalid token
          setUser(null);
        }
        setLoading(false);
      }, 500); // Delay for 500ms
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
