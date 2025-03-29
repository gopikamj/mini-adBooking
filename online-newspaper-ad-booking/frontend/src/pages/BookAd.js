import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NewspaperLayout from "./layouts/NewspaperLayout";
import "../index.css"; // Ensure global styles apply
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
    if (!selectedNewspaper) {
      alert("Please select a newspaper first.");
      return;
    }
    const pricePerWord = selectedNewspaper === "The Virtual Times" ? 10 : 8;
    const wordCount = adContent.split(" ").filter((word) => word).length;
    const totalPrice = pricePerWord * wordCount;
    alert(`Total Price: ₹${totalPrice}`);
  };

  const proceedToPayment = () => {
    if (!selectedNewspaper || !adContent.trim()) {
      alert("Please select a newspaper and enter ad content before proceeding.");
      return;
    }
    alert(`Proceeding to payment with:\nNewspaper ID: ${newspaperId}\nNewspaper: ${selectedNewspaper}\nSpace ID: ${spaceId}`);
  };

  return (
    <div className="book-ad-container">
      <h2>Book Your Ad</h2>

      <form>
        <label>Select a Newspaper:</label>
        <select
          onChange={handleNewspaperChange}
          value={selectedNewspaper}
          className="dropdown-select"
        >
          <option value="">-- Select --</option>
          <option value="The Virtual Times">The Virtual Times - ₹10/word</option>
          <option value="Daily News">Daily News - ₹8/word</option>
        </select>

        {selectedNewspaper && (
          <div className="layout-container">
            <NewspaperLayout name={selectedNewspaper} />
          </div>
        )}

        <label>Enter Ad Content:</label>
        <textarea
          placeholder="Type your ad content here..."
          value={adContent}
          onChange={(e) => setAdContent(e.target.value)}
        />

        <div className="button-container">
          <button type="button" onClick={calculatePrice}>
            Calculate Price
          </button>
          <button type="button" onClick={proceedToPayment}>
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAd;
