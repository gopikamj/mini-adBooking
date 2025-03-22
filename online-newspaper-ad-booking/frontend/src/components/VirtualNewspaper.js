import React, { useState, useEffect } from "react";
import "../styles/VirtualNewspaper.css"; // Import the CSS file

const VirtualNewspaper = ({ onSelectAdSpace }) => {
  const [adSpaces, setAdSpaces] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/ad-spaces") // Fetch ad spaces from backend
      .then((res) => res.json())
      .then((data) => setAdSpaces(data))
      .catch((err) => console.error("Error fetching ad spaces:", err));
  }, []);

  return (
    <div className="newspaper-layout">
      {adSpaces.map((space) => (
        <div
          key={space.id}
          className={`ad-space ${space.status === "available" ? "available" : "booked"}`}
          onClick={() => space.status === "available" && onSelectAdSpace(space)}
        >
          {space.space_name}
        </div>
      ))}
    </div>
  );
};

export default VirtualNewspaper;
