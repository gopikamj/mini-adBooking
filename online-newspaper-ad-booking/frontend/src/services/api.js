import axios from "axios";

// ✅ Create Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Helper: Retrieve token from localStorage
export const getToken = () => localStorage.getItem("token");

// ✅ Automatically add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Fetch user data (Authorization handled automatically)
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/user");
    return response.data?.user || response.data; // Ensure user object is returned
  } catch (error) {
    console.error("❌ Error fetching user data:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Fetch available newspapers
export const getNewspapers = async () => {
  try {
    const response = await api.get("/newspapers");
    return response.data;
  } catch (error) {
    console.error("❌ Fetch Newspapers Error:", error);
    return [];
  }
};

// ✅ Login User & Store Token
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

// ✅ Signup User
export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Book Ad - Requires Authorization
export const bookAd = async (adData) => {
  try {
    const response = await api.post("/ad-booking", adData);
    console.log("📢 Ad booked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error booking ad:", error.response?.data || error.message);
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

export default api;
