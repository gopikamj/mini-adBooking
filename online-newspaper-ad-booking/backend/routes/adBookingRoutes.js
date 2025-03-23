const express = require("express");
const authenticateJWT = require("../middleware/authenticateJWT");
const db = require("../config/db");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables


const router = express.Router();

// In your auth routes file
router.get("/user", authenticateJWT, (req, res) => {
  // User is already attached to req by the middleware
  res.json({ user: req.user });
});

// ✅ Get all newspapers
router.get("/newspapers", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM newspapers");
    res.json(results);
  } catch (err) {
    console.error("❌ Database error (newspapers):", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Get available and booked ad spaces for a selected newspaper
router.get("/ad-spaces/:newspaperId", async (req, res) => {
  const { newspaperId } = req.params;
  try {
    const [results] = await db.query(
      "SELECT * FROM ad_spaces WHERE newspaper_id = ?",
      [newspaperId]
    );
    res.json(results);
  } catch (err) {
    console.error("❌ Database error (ad spaces):", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Calculate price dynamically based on content length and duration
router.post("/calculate-price", (req, res) => {
  let { content, basePrice, maxPrice, duration } = req.body;

  if (!content || !basePrice || !maxPrice || !duration) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const contentLength = content.length;
  let price = basePrice + contentLength * 0.5 + duration * 10; // Dynamic price calculation

  // If price exceeds max price, truncate content
  if (price > maxPrice) {
    const allowedLength = Math.floor(
      (maxPrice - (basePrice + duration * 10)) / 0.5
    );
    content = content.substring(0, allowedLength);
    price = maxPrice;
  }

  res.json({ price, content });
});

// ✅ Book an ad space
router.post("/book", authenticateJWT, async (req, res) => {
  try {
    const {
      userId,
      newspaperId,
      spaceId,
      title,
      content,
      category,
      duration,
      price,
      newspaperName,
      email,
    } = req.body;

    console.log("📥 Received Booking Data: ", req.body);

    // Ensure no missing fields
    if (!userId || !newspaperId || !spaceId || !title || !content || !category || !duration || !price || !newspaperName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Check if the ad space is already booked
    const [existingBooking] = await db.query(
      "SELECT status FROM ad_spaces WHERE id = ?",
      [spaceId]
    );

    if (!existingBooking || existingBooking.length === 0) {
      return res.status(404).json({ message: "Ad space not found" });
    }

    if (existingBooking[0].status === "booked") {
      return res.status(400).json({ message: "Ad space is already booked" });
    }

    const query = `
      INSERT INTO bookings 
      (user_id, newspaper_id, space_id, title, content, category, duration, price, newspaper_name, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      newspaperId,
      spaceId,
      title,
      content,
      category,
      duration,
      price,
      newspaperName,
      email,
    ];

    await db.query(query, values);

    // ✅ Mark the ad space as 'booked'
    await db.query("UPDATE ad_spaces SET status = 'booked' WHERE id = ?", [spaceId]);
    //await db.query("UPDATE ad_spaces SET price = 'price' WHERE id = ?", [spaceId]);

    res.status(201).json({ message: "Ad booked successfully" });
  } catch (error) {
    console.error("❌ Database error (booking): ", error);
    res.status(500).json({ message: "Error booking ad", error: error.message });
  }
});


module.exports = router;
