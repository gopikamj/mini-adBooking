import React, { useState, useEffect } from "react";
import { getNewspapers } from "../services/api";

function Explore() {
  const [newspapers, setNewspapers] = useState([]);

  useEffect(() => {
    const fetchNewspapers = async () => {
      const data = await getNewspapers();
      if (Array.isArray(data)) {
        setNewspapers(data);
      } else {
        setNewspapers([]);
      }
    };
    fetchNewspapers();
  }, []);

  return (
    <div>
      <h1>Explore Newspapers</h1>
      {newspapers.length > 0 ? (
        <ul>
          {newspapers.map((paper) => (
            <li key={paper.id}>{paper.name} - ₹{paper.price_per_word} per word</li>
          ))}
        </ul>
      ) : (
        <p>Loading newspapers...</p>
      )}
    </div>
  );
}

export default Explore;
