import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Get token from localStorage
const getToken = () => localStorage.getItem("token");

// ✅ Fetch newspapers
export const getNewspapers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/newspapers`);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch Newspapers Error:", error);
    return [];
  }
};

// ✅ Login API

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("✅ Token saved:", response.data.token);
    } else {
      console.warn("⚠️ No token received from the server.");
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Signup API
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("❌ Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get Authenticated User (Fixed 401 Unauthorized Error)
export const getUserData = async () => {
  const token = getToken();

  if (!token) {
    console.warn("❌ No token found in localStorage. User is not logged in.");
    return null; // ✅ Prevent API call if no token
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Include token
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ User Fetch Error:", error.response?.data || error);
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); // ✅ Remove invalid token
    }

    return null;
  }
};

// ✅ Decode Token to Get User Info (Alternative)
export const getAuthenticatedUser = () => {
  const token = getToken();
  return token ? JSON.parse(atob(token.split(".")[1])) : null;
};
