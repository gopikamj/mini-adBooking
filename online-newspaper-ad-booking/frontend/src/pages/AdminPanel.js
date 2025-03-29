// src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [pendingAds, setPendingAds] = useState([]);

  // Fetch pending ad requests
  useEffect(() => {
    const fetchPendingAds = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/pending-ads");
        setPendingAds(response.data);
      } catch (error) {
        console.error("Error fetching pending ads:", error);
      }
    };
    fetchPendingAds();
  }, []);

  // Handle approval or rejection
  const handleAction = async (id, action) => {
    try {
      await axios.post("http://localhost:5000/api/admin/update-status", {
        adId: id,
        status: action === "approve" ? "booked" : "available",
      });
      alert(`Ad ${action}d successfully!`);
      setPendingAds(pendingAds.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error("Error updating ad status:", error);
      alert("Error updating ad status.");
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {pendingAds.length === 0 ? (
        <p>No pending ad requests.</p>
      ) : (
        pendingAds.map((ad) => (
          <div key={ad.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <p><strong>Newspaper:</strong> {ad.newspaper_name}</p>
            <p><strong>Content:</strong> {ad.content}</p>
            <p><strong>Price:</strong> ₹{ad.price}</p>
            <button onClick={() => handleAction(ad.id, "approve")}>Approve</button>
            <button onClick={() => handleAction(ad.id, "reject")}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPanel;
