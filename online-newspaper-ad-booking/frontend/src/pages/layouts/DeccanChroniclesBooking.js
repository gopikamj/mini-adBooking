import React, { useState } from "react";
import "../../styles/DeccanChroniclesBooking.css"; // Import CSS for styling

const DeccanChroniclesBooking = () => {
  const [adTitle, setAdTitle] = useState("");
  const [adContent, setAdContent] = useState("");
  const [category, setCategory] = useState("Jobs");

  const handleBooking = () => {
    alert("Ad booked successfully!");
  };

  return (
    <div className="deccan-booking"> {/* Add a wrapper div */}
      <div className="booking-container">
        <div className="booking-card">
          <h1 className="newspaper-title">Deccan Chronicles</h1>
          <p className="subtitle">Your Trusted Daily Newspaper</p>

          <h2 className="section-title">Classified Ads Booking</h2>

          <div className="form-group">
            <label>Ad Title:</label>
            <input
              type="text"
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="Enter your ad title"
            />
          </div>

          <div className="form-group">
            <label>Ad Content:</label>
            <textarea
              value={adContent}
              onChange={(e) => setAdContent(e.target.value)}
              placeholder="Write your ad content here..."
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

          <button className="book-ad-button" onClick={handleBooking}>
            Book Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeccanChroniclesBooking;
