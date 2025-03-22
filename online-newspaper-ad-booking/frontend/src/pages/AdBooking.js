import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNewspapers, getUserData } from "../services/api";
import api from "../services/api";

const AdBooking = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  console.log("📌 Retrieved Token in AdBooking:", localStorage.getItem("token"));

  // ✅ Check if the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        setAuthChecking(true);
        const userData = await getUserData();
        console.log("🔎 User Data in AdBooking:", userData);

        if (userData) {
          setUser(userData);
          setAuthError(false);
          // User is authenticated, fetch newspapers
          fetchNewspapers();
        } else {
          console.warn("User data is null - but not redirecting yet");
          setAuthError(true);
        }
      } catch (error) {
        console.error("❌ Error checking user:", error);
        setAuthError(true);
      } finally {
        setAuthChecking(false);
      }
    };

    checkUser();
  }, []);

  // ✅ Fetch available newspapers
  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const data = await getNewspapers();
      console.log("🗞️ Newspapers Data:", data);
      setNewspapers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching newspapers:", error);
      setNewspapers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle newspaper selection
  const handleNewspaperChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedNewspaper = newspapers.find((paper) => paper.id === selectedId);

    if (selectedNewspaper) {
      navigate(`/newspaper-layout?name=${encodeURIComponent(selectedNewspaper.name)}`);
    }
  };

  // ✅ Handle ad booking
  const bookAd = async (adData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to book an ad.");
        navigate("/login");
        return;
      }

      const response = await api.post("/ad-booking", adData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Ad booked successfully:", response.data);
      alert("Ad booked successfully!");
    } catch (error) {
      console.error("❌ Error booking ad:", error.response ? error.response.data : error.message);
      alert("Failed to book ad. Please try again.");
    }
  };

  // ✅ Login button handler
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (authChecking) {
    return <div>Verifying your account...</div>;
  }

  // Show error message but don't redirect automatically
  if (authError) {
    return (
      <div>
        <h2>Authentication Issue</h2>
        <p>There was a problem verifying your login. Please try logging in again.</p>
        <button onClick={handleLoginRedirect}>Go to Login</button>
      </div>
    );
  }

  // If not checking auth and no error but still no user, show login button
  if (!user) {
    return (
      <div>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to book an ad.</p>
        <button onClick={handleLoginRedirect}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Book Your Ad</h2>

      <p>Welcome, {user.name}!</p>

      <label>Select a Newspaper:</label>
      <select onChange={handleNewspaperChange} disabled={loading || newspapers.length === 0}>
        <option value="">Select a newspaper</option>
        {loading ? (
          <option disabled>Loading newspapers...</option>
        ) : newspapers.length > 0 ? (
          newspapers.map((paper) => (
            <option key={paper.id} value={paper.id}>
              {paper.name} - ₹{paper.price_per_word} per word
            </option>
          ))
        ) : (
          <option disabled>No newspapers available</option>
        )}
      </select>
    </div>
  );
};

export default AdBooking;
