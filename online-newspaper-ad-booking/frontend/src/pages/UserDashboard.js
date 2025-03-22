import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/ads/user-ads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAds(response.data);
      } catch (error) {
        console.error("Error fetching ads", error);
      }
    };

    fetchAds();
  }, []);

  return (
    <div>
      <h2>Your Booked Ads</h2>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id}>{ad.content} - <strong>Status:</strong> {ad.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
