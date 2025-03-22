import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNewspapers } from "../services/api";

const AdBooking = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewspapers = async () => {
      try {
        setLoading(true);
        const data = await getNewspapers();
        console.log("Fetched newspapers:", data);
        setNewspapers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching newspapers:", error);
        setNewspapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewspapers();
  }, []);

  const handleNewspaperChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedNewspaper = newspapers.find((paper) => paper.id === selectedId);

    if (selectedNewspaper) {
      navigate(`/newspaper-layout?name=${encodeURIComponent(selectedNewspaper.name)}`);
    }
  };

  return (
    <div>
      <h2>Book Your Ad</h2>
      <label>Select a Newspaper:</label>
      <select onChange={handleNewspaperChange}>
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
