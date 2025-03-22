import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/DeccanChroniclesBooking.css";

const DeccanChroniclesBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve required values from navigation state
  const { price: basePrice, newspaperId, spaceId, newspaperName } = location.state || {};

  // Form States
  const [adTitle, setAdTitle] = useState("");
  const [adContent, setAdContent] = useState("");
  const [category, setCategory] = useState("Jobs");
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(basePrice || 0);

  // Function to calculate price based on content length and duration
  const calculatePrice = useCallback((content, duration) => {
    const contentLength = content.length;
    const pricePerCharacter = 0.5; // Set price per character
    const contentPrice = basePrice + contentLength * pricePerCharacter;
    return contentPrice * duration;
  }, [basePrice]);

  // Update total price when ad content or duration changes
  useEffect(() => {
    setTotalPrice(calculatePrice(adContent, duration));
  }, [adContent, duration, calculatePrice]);

  // Handle Ad Booking (Send to Database)
  const handleBooking = async () => {
    if (!adTitle || !adContent) {
      alert("Please fill in all fields.");
      return;
    }

    // Ensure user is logged in
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");

    if (!userId || !email) {
      alert("Please log in to book an ad.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newspaperId,
          spaceId,
          title: adTitle,
          content: adContent,
          category,
          duration,
          price: totalPrice,
          email,
          newspaperName,
        }),
      });

      if (response.ok) {
        alert(`🎉 Ad booked successfully for ${duration} day(s) at ₹${totalPrice}!`);
        navigate("/explore"); // Redirect after booking
      } else {
        alert("❌ Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Error booking ad:", error);
      alert("Error occurred during booking.");
    }
  };

  return (
    <div className="deccan-booking">
      <div className="booking-card">
        <h1 className="newspaper-title">{newspaperName || "Deccan Chronicles"}</h1>
        <p className="subtitle">Your Trusted Daily Newspaper</p>

        <h2 className="section-title">Classified Ads Booking</h2>

        <div className="form-group">
          <label>Ad Title:</label>
          <input
            type="text"
            value={adTitle}
            onChange={(e) => setAdTitle(e.target.value)}
            placeholder="Enter your ad title"
            required
          />
        </div>

        <div className="form-group">
          <label>Ad Content:</label>
          <textarea
            value={adContent}
            onChange={(e) => setAdContent(e.target.value)}
            placeholder="Write your ad content here..."
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Jobs">Jobs</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Services">Services</option>
            <option value="Announcements">Announcements</option>
          </select>
        </div>

        <div className="form-group">
          <label>Duration (in days):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.min(10, Math.max(1, e.target.value)))}
            min="1"
            max="10"
            placeholder="Enter number of days (Max 10)"
            required
          />
        </div>

        <p><strong>Total Price:</strong> ₹{totalPrice}</p>

        <button className="book-ad-button" onClick={handleBooking}>
          Book Ad
        </button>
      </div>
    </div>
  );
};

export default DeccanChroniclesBooking;
