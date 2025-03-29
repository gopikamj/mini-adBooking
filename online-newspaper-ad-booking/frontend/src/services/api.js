import axios from "axios";

// ✅ Ensure API_BASE_URL is defined only once
const API_BASE_URL = "http://localhost:5000/api";

// ✅ Create a single Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Helper: Retrieve token from localStorage
export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("🔍 Retrieved Token:", token);
  return token;
};

// ✅ Automatically add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication token is invalid or expired");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ✅ ADMIN LOGIN FUNCTIONALITY
export const adminLogin = async (email, password) => {
  try {
    console.log("Attempting admin login with:", email);
    const response = await api.post("/auth/admin-login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "admin");
      console.log("✅ Admin token saved:", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Admin Login Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || "Admin login failed");
  }
};

// ✅ Export all API functions that were missing
export const getUserData = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.warn("No token found when getting user data");
      return null;
    }
    
    const response = await api.get("/auth/user");
    return response.data?.user || response.data;
  } catch (error) {
    console.error("❌ Error fetching user data:", error.response?.data || error.message);
    return null;
  }
};

export const getNewspapers = async () => {
  try {
    const response = await api.get("/newspapers");
    return response.data;
  } catch (error) {
    console.error("❌ Fetch Newspapers Error:", error);
    return [];
  }
};

// ✅ Keep all existing functions exactly as they were
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("✅ Token saved:", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const bookAd = async (adData) => {
  try {
    const response = await api.post("/ad-booking", adData);
    console.log("✅ Ad booked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error booking ad:", error.response?.data || error.message);
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  console.log("🚪 User logged out successfully.");
};

export const getAuthenticatedUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("🔍 Decoded Token Payload:", payload);
    return payload;
  } catch (error) {
    console.error("❌ Token decoding error:", error);
    return null;
  }
};

// ✅ Export the Axios instance
export default api;