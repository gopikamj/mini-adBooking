// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all pending ads
router.get("/pending-ads", async (req, res) => {
  try {
    const [pendingAds] = await db.query("SELECT * FROM ad_spaces WHERE status = 'pending'");
    res.json(pendingAds);
  } catch (error) {
    console.error("Error fetching pending ads:", error);
    res.status(500).send("Server error");
  }
});

// Approve or reject ad request
router.post("/update-status", async (req, res) => {
  const { adId, status } = req.body;
  try {
    await db.query("UPDATE ad_spaces SET status = ? WHERE id = ?", [status, adId]);
    res.send("Ad status updated successfully.");
  } catch (error) {
    console.error("Error updating ad status:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
