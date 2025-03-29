import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/DeccanChroniclesBooking.css";
import { AuthContext } from "../../context/AuthContext";

const DeccanChroniclesBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  // Retrieve required values from navigation state
  const { price: basePrice, newspaperId = 1, spaceId, newspaperName } = location.state || {};

  // Form States
  const [adTitle, setAdTitle] = useState("");
  const [adContent, setAdContent] = useState("");
  const [category, setCategory] = useState("Jobs");
  const [totalPrice, setTotalPrice] = useState(basePrice || 0);
  const [bookingDate, setBookingDate] = useState("");

  // Automatically set booking date to the next day (YYYY-MM-DD)
  useEffect(() => {
    // Get current date in local timezone
    const today = new Date();
    
    // Calculate tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Format as YYYY-MM-DD without timezone conversion
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    setBookingDate(`${year}-${month}-${day}`);
  }, []);
  // Function to calculate price based on content length (for 1 day)
  const calculatePrice = useCallback(
    (content) => {
      const contentLength = content.length;
      const pricePerCharacter = 0.5; // Price per character
      return basePrice + contentLength * pricePerCharacter;
    },
    [basePrice]
  );

  // Update total price when ad content changes
  useEffect(() => {
    setTotalPrice(calculatePrice(adContent));
  }, [adContent, calculatePrice]);

  // Handle Ad Booking (Send to Database)
  const handleBooking = async () => {
    if (!adTitle || !adContent) {
      alert("Please fill in all fields.");
      return;
    }

    // Ensure user is logged in
    if (!user) {
      alert("Please log in to book an ad.");
      navigate("/login");
      return;
    }

    const { id: userId, email, token } = user;

    try {
      const response = await fetch("http://localhost:5000/api/ad-booking/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          newspaperId,
          spaceId,
          title: adTitle,
          content: adContent,
          category,
          duration: 1, // Fixed to 1 day
          price: totalPrice,
          newspaperName,
          email,
          bookingDate,
        }),
      });

      if (response.ok) {
        localStorage.setItem("bookingPrice", totalPrice);
        alert(`🎉 Ad booked successfully for 1 day on ${bookingDate} at ₹${totalPrice}!`);
        navigate("/payment", {
          state: {
            size: category,
            price: totalPrice,
            newspaperId,
            newspaperName,
            spaceId,
            adTitle,
            adContent,
            duration: 1,
            email,
            bookingDate,
          },
        });
      } else {
        const errorData = await response.json();
        console.error("❌ Booking failed. Response from server:", errorData);
        alert(`❌ Booking failed: ${errorData.message || "Try again."}`);
      }
    } catch (error) {
      console.error("Error booking ad:", error);
      alert("❌ An error occurred during booking.");
    }
  };

  if (loading) return <p>Loading user data...</p>;

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
          <label>Booking Date :</label>
          <input type="date" value={bookingDate} disabled />
        </div>

        <p><strong>Total Price:</strong> ₹{totalPrice}</p>

        <button className="book-ad-button" onClick={handleBooking}>
          📅 Book Ad
        </button>
      </div>
    </div>
  );
};

export default DeccanChroniclesBooking;
