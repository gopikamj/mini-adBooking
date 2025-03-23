import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NewspaperLayout from "./NewspaperLayout";
import "../styles/BookAd.css";

const BookAd = () => {
  const location = useLocation();
  const { newspaperId, newspaperName, spaceId } = location.state || {};

  const [selectedNewspaper, setSelectedNewspaper] = useState(newspaperName || "");
  const [adContent, setAdContent] = useState("");

  const handleNewspaperChange = (event) => {
    setSelectedNewspaper(event.target.value);
  };

  const calculatePrice = () => {
    const pricePerWord = selectedNewspaper === "The Times" ? 10 : 8;
    const wordCount = adContent.split(" ").filter((word) => word).length;
    const totalPrice = pricePerWord * wordCount;
    alert(`Total Price: ₹${totalPrice}`);
  };

  const proceedToPayment = () => {
    alert(`Proceeding to payment with:
      Newspaper ID: ${newspaperId}
      Newspaper: ${selectedNewspaper}
      Space ID: ${spaceId}
    `);
  };

  console.log("Received Data:", { newspaperId, newspaperName, spaceId });

  return (
    <div className="book-ad-container">
      <div className="book-ad-box">
        <h2>Book Your Ad</h2>

        <label>Select a Newspaper:</label>
        <select onChange={handleNewspaperChange} value={selectedNewspaper}>
          <option value="">-- Select --</option>
          <option value="The Times">The Times - ₹10 per word</option>
          <option value="Daily News">Daily News - ₹8 per word</option>
        </select>

        {selectedNewspaper && (
          <div className="newspaper-layout-container">
            <NewspaperLayout name={selectedNewspaper} />
          </div>
        )}

        <label>Enter Ad Content:</label>
        <textarea
          placeholder="Type your ad content here..."
          value={adContent}
          onChange={(e) => setAdContent(e.target.value)}
        />

        <div className="book-ad-buttons">
          <button onClick={calculatePrice}>Calculate Price</button>
          <button onClick={proceedToPayment}>Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
};

export default BookAd;
