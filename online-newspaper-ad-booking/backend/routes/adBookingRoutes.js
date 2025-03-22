const express = require("express");
const authenticateJWT = require("../middleware/authenticateJWT");
const db = require("../config/db");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const router = express.Router();

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
  const {
    userId,
    newspaperId,
    spaceId,
    title,
    content,
    category,
    duration,
    price,
    email,
    newspaperName,
  } = req.body;

  if (
    !userId ||
    !newspaperId ||
    !spaceId ||
    !title ||
    !content ||
    !category ||
    !duration ||
    !price ||
    !email ||
    !newspaperName
  ) {
    console.log("❌ Missing fields in booking request:", req.body);
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Check if ad space is available
    const [space] = await db.query(
      "SELECT * FROM ad_spaces WHERE id = ? AND status = 'available'",
      [spaceId]
    );

    if (space.length === 0) {
      return res.status(400).json({ message: "Ad space is not available" });
    }

    // ✅ Insert booking details
    const bookingQuery = `
      INSERT INTO bookings 
      (user_id, newspaper_id, space_id, title, content, category, duration, price, newspaper_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(bookingQuery, [
      userId,
      newspaperId,
      spaceId,
      title,
      content,
      category,
      duration,
      price,
      newspaperName,
    ]);

    // ✅ Mark ad space as booked
    await db.query("UPDATE ad_spaces SET status = 'booked' WHERE id = ?", [
      spaceId,
    ]);

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ad Booking Confirmation",
      text: `Your ad titled "${title}" in category "${category}" has been successfully booked for newspaper: ${newspaperName}. Duration: ${duration} days. Thank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email error:", error);
        return res
          .status(500)
          .json({ message: "Booking successful, but email delivery failed" });
      }
      console.log("📧 Confirmation email sent:", info.response);
      res.json({ message: "Booking successful! Confirmation email sent." });
    });
  } catch (err) {
    console.error("❌ Database error (booking):", err);
    res.status(500).json({ message: "Error booking ad" });
  }
});

module.exports = router;
