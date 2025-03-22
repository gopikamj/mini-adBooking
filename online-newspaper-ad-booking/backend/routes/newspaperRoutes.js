const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Get all newspapers with pricing details
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, price_per_word FROM newspapers");

    if (!Array.isArray(rows)) {
      return res.status(500).json({ error: "Invalid response format" });
    }

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching newspapers:", error.message);
    res.status(500).json({ error: "Failed to fetch newspapers" });
  }
});

module.exports = router;
