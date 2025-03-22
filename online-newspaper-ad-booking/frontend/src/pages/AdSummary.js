import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AdSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { newspaperId, adContent, price } = location.state || {};

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/ads/book",
        { newspaperId, adContent, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Ad booked successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error booking ad");
    }
  };

  return (
    <div>
      <h2>Confirm Your Ad</h2>
      <p>Newspaper: {newspaperId}</p>
      <p>Content: {adContent}</p>
      <p>Price: {price}</p>
      <button onClick={handleConfirm}>Confirm Booking</button>
    </div>
  );
};

export default AdSummary;