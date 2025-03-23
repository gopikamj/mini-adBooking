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
export const getToken = () =>{
  const token = localStorage.getItem("token");
  console.log("🔍 Retrieved Token:", token); // <-- Add this line
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
// Add to your api.js
api.interceptors.response.use(
  response => response,
  error => {
    // Check if error is due to invalid token
    if (error.response && error.response.status === 401) {
      console.warn("Authentication token is invalid or expired");
      // Clear the invalid token
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ✅ Login User & Store Token
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Save token
      console.log("✅ Token saved:", response.data.token);
    }

    return response.data; // Return user data
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Book Ad (Requires Authorization)
export const bookAd = async (adData) => {
  console.log("📦 Booking Ad - Data Sent:", adData); // Debug the adData
  try {
    const response = await api.post("/ad-booking", adData);
    console.log("✅ Ad booked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error booking ad:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Other API functions
export const getUserData = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.warn("No token found when getting user data");
      return null;
    }
    
    // Log the full request details for debugging
    console.log("🔍 Requesting user data with token:", token.substring(0, 10) + "...");
    
    const response = await api.get("/auth/user");
    console.log("✅ User data retrieved:", response.data);
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

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
  console.log("🚪 User logged out successfully.");
};

// ✅ Decode JWT to Get User Info
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

// ✅ Export the Axios instance (corrected single export)
export default api;
