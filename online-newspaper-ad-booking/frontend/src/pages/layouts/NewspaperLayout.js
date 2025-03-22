import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../../styles/NewspaperLayout.css"; // Ensure CSS path is correct

const NewspaperLayout = () => {
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  // Prices for different ad sizes
  const adPrices = {
    large: 5000,
    medium: 3000,
    small: 1500,
  };

  const handleAdClick = (size, index) => {
    setSelectedAd(index);
    setSelectedPrice(adPrices[size]);
    setSelectedSize(size);
  };

  const handleAdBooking = () => {
    // Navigate to the ad booking page with selected ad details
    navigate("/deccan-chronicles-booking", {
      state: { size: selectedSize, price: selectedPrice },
    });
  };

  return (
    <div className="newspaper-layout">
      <div className="newspaper-container">
        <h1 className="newspaper-title">THE VIRTUAL TIMES</h1>
        <p className="sub-title">Your Trusted Daily Source</p>
        <div className="separator"></div>

        <div className="main-headline">
          <h2>Pakistan’s FIA to Collaborate with CBI on Fighting Terror</h2>
          <p>Intense cross-border security discussions are underway to curb international crime and ensure stability...</p>
        </div>

        {/* First Ad Section */}
        <div className="ads-container">
          <div className="ad-space large" onClick={() => handleAdClick("large", 0)}>
            🔹 <strong>Exclusive Front Page Ad Space</strong> 🔹  
            {selectedAd === 0 && (
              <div>
                <p className="ad-price">Price: ₹{selectedPrice}</p>
                <button className="book-ad-button" onClick={handleAdBooking}>Book Ad</button>
              </div>
            )}
          </div>
        </div>

        {/* More Ads */}
        <div className="ads-container">
          <div className="ad-space medium" onClick={() => handleAdClick("medium", 1)}>
            🔹 <strong>Premium Half-Page Ad</strong> 🔹  
            {selectedAd === 1 && (
              <div>
                <p className="ad-price">Price: ₹{selectedPrice}</p>
                <button className="book-ad-button" onClick={handleAdBooking}>Book Ad</button>
              </div>
            )}
          </div>

          <div className="ad-space small" onClick={() => handleAdClick("small", 2)}>
            🔹 <strong>Quarter-Page Ad</strong> 🔹  
            {selectedAd === 2 && (
              <div>
                <p className="ad-price">Price: ₹{selectedPrice}</p>
                <button className="book-ad-button" onClick={handleAdBooking}>Book Ad</button>
              </div>
            )}
          </div>
        </div>

        <div className="ads-container">
          <div className="ad-space large" onClick={() => handleAdClick("large", 3)}>
            🔹 <strong>Prime Full-Width Ad Spot</strong> 🔹  
            {selectedAd === 3 && (
              <div>
                <p className="ad-price">Price: ₹{selectedPrice}</p>
                <button className="book-ad-button" onClick={handleAdBooking}>Book Ad</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewspaperLayout;
