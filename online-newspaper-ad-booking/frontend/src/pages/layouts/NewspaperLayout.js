import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/NewspaperLayout.css";

const NewspaperLayout = () => {
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [adSpaces, setAdSpaces] = useState([]);
  const navigate = useNavigate();

  // ✅ Fixed ad prices
  const adPrices = {
    large: 5000,
    medium: 3000,
    small: 1500,
  };

  // ✅ Fetch ad spaces from backend
  const fetchAdSpaces = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ad-booking/ad-spaces/1");
      console.log("Fetched Ad Spaces:", response.data); // Debugging line
      setAdSpaces(response.data);
    } catch (error) {
      console.error("Error fetching ad spaces:", error);
    }
  };

  useEffect(() => {
    fetchAdSpaces();
  }, []);

  // ✅ Handle ad space selection
  const handleAdClick = (size, index, status) => {
    if (status === "booked") return; // Prevent selecting booked ads
    setSelectedAd(index);
    setSelectedPrice(adPrices[size]);
    setSelectedSize(size);
  };

  // ✅ Navigate to ad booking page
  const handleAdBooking = () => {
    navigate("/deccan-chronicles-booking", {
      state: {
        size: selectedSize,
        price: selectedPrice,
        newspaperId: 1,
        newspaperName: "The Virtual Times",
        spaceId: selectedAd + 1,
      },
    });
  };

  // ✅ Helper to get ad status by position
  const getAdStatus = (spaceName) => {
    return adSpaces.find((ad) => ad.space_name === spaceName) || { status: "available" };
  };

  return (
    <div className="newspaper-layout">
      <div className="newspaper-container">
        <h1 className="newspaper-title">THE VIRTUAL TIMES</h1>
        <p className="sub-title">Your Trusted Daily Source</p>
        <div className="separator"></div>

        {/* Main Headline */}
        <div className="main-headline">
          <h2>Pakistan’s FIA to Collaborate with CBI on Fighting Terror</h2>
          <p>
            Intense cross-border security discussions are underway to curb
            international crime and ensure stability...
          </p>
        </div>

        {/* First Ad Section */}
        <div className="ads-container">
          {(() => {
            const ad = getAdStatus("Exclusive Front Page Ad Space");
            return (
              <div
                className={`ad-space large ${ad.status === "booked" ? "disabled" : ""}`}
                onClick={() => handleAdClick("large", 0, ad.status)}
              >
                🔹 <strong>Exclusive Front Page Ad Space</strong> 🔹
                {ad.status === "booked" && <p>Booked</p>}
                {selectedAd === 0 && ad.status !== "booked" && (
                  <div>
                    <p className="ad-price">Price: ₹{selectedPrice}</p>
                    <button className="book-ad-button" onClick={handleAdBooking}>
                      Book Ad
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Second Ad Section */}
        <div className="ads-container">
          {(() => {
            const ad1 = getAdStatus("Premium Half-Page Ad");
            const ad2 = getAdStatus("Quarter-Page Ad");
            return (
              <>
                <div
                  className={`ad-space medium ${ad1.status === "booked" ? "disabled" : ""}`}
                  onClick={() => handleAdClick("medium", 1, ad1.status)}
                >
                  🔹 <strong>Premium Half-Page Ad</strong> 🔹
                  {ad1.status === "booked" && <p>Booked</p>}
                  {selectedAd === 1 && ad1.status !== "booked" && (
                    <div>
                      <p className="ad-price">Price: ₹{selectedPrice}</p>
                      <button className="book-ad-button" onClick={handleAdBooking}>
                        Book Ad
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className={`ad-space small ${ad2.status === "booked" ? "disabled" : ""}`}
                  onClick={() => handleAdClick("small", 2, ad2.status)}
                >
                  🔹 <strong>Quarter-Page Ad</strong> 🔹
                  {ad2.status === "booked" && <p>Booked</p>}
                  {selectedAd === 2 && ad2.status !== "booked" && (
                    <div>
                      <p className="ad-price">Price: ₹{selectedPrice}</p>
                      <button className="book-ad-button" onClick={handleAdBooking}>
                        Book Ad
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>

        {/* Fourth Ad Section */}
        <div className="ads-container">
          {(() => {
            const ad3 = getAdStatus("Prime Full-Width Ad Spot");
            return (
              <div
                className={`ad-space large ${ad3.status === "booked" ? "disabled" : ""}`}
                onClick={() => handleAdClick("large", 3, ad3.status)}
              >
                🔹 <strong>Prime Full-Width Ad Spot</strong> 🔹
                {ad3.status === "booked" && <p>Booked</p>}
                {selectedAd === 3 && ad3.status !== "booked" && (
                  <div>
                    <p className="ad-price">Price: ₹{selectedPrice}</p>
                    <button className="book-ad-button" onClick={handleAdBooking}>
                      Book Ad
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default NewspaperLayout;
