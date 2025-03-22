import React, { useState } from "react";
import NewspaperLayout from "./NewspaperLayout";
import "../styles/BookAd.css"; // Make sure the import path is correct

const BookAd = () => {
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [adContent, setAdContent] = useState("");

  const handleNewspaperChange = (event) => {
    setSelectedNewspaper(event.target.value);
  };

  return (
    <div className="book-ad-container">
      <div className="book-ad-box">
        <h2>Book Your Ad</h2>

        <label>Select a Newspaper:</label>
        <select onChange={handleNewspaperChange}>
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
          <button>Calculate Price</button>
          <button>Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
};

export default BookAd;
