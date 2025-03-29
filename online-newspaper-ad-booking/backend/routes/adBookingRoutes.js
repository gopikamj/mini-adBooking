const express = require("express");
const authenticateJWT = require("../middleware/authenticateJWT");
const db = require("../config/db");
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

// ✅ Book an ad space (only update to 'pending' initially)
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

    if (
      !userId ||
      !newspaperId ||
      !spaceId ||
      !title ||
      !content ||
      !category ||
      !duration ||
      !price ||
      !newspaperName ||
      !email
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Check if the ad space is already pending or booked
    const [existingBooking] = await db.query(
      "SELECT status FROM ad_spaces WHERE id = ?",
      [spaceId]
    );

    if (!existingBooking || existingBooking.length === 0) {
      return res.status(404).json({ message: "Ad space not found" });
    }

    const currentStatus = existingBooking[0].status;

    if (currentStatus === "pending" || currentStatus === "booked") {
      return res
        .status(400)
        .json({ message: "Ad space is already pending or booked" });
    }

    // ✅ Insert booking with 'pending' status
    const query = `
      INSERT INTO bookings 
      (user_id, newspaper_id, space_id, title, content, category, duration, price, newspaper_name, email, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
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

    // ✅ Ensure ad space status is updated to 'pending'
    await db.query("UPDATE ad_spaces SET status = 'pending' WHERE id = ?", [
      spaceId,
    ]);

    res.status(201).json({
      message: "Ad booked successfully and awaiting admin approval",
    });
  } catch (error) {
    console.error("❌ Database error (booking): ", error);
    res.status(500).json({ message: "Error booking ad", error: error.message });
  }
});

// ✅ Approve ad booking
router.post("/approve/:bookingId", authenticateJWT, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch booking details
    const [booking] = await db.query(
      "SELECT space_id FROM bookings WHERE id = ? AND status = 'pending'",
      [bookingId]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Pending booking not found" });
    }

    const spaceId = booking[0].space_id;

    // ✅ Update booking status to 'approved'
    await db.query("UPDATE bookings SET status = 'approved' WHERE id = ?", [
      bookingId,
    ]);

    // ✅ Update ad space status to 'booked'
    await db.query("UPDATE ad_spaces SET status = 'booked' WHERE id = ?", [
      spaceId,
    ]);

    res.status(200).json({ message: "Booking approved successfully" });
  } catch (error) {
    console.error("❌ Error approving booking: ", error);
    res.status(500).json({ message: "Error approving booking" });
  }
});

// ✅ Reject ad booking
router.post("/reject/:bookingId", authenticateJWT, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch booking details
    const [booking] = await db.query(
      "SELECT space_id FROM bookings WHERE id = ? AND status = 'pending'",
      [bookingId]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Pending booking not found" });
    }

    const spaceId = booking[0].space_id;

    // ✅ Update booking status to 'rejected'
    await db.query("UPDATE bookings SET status = 'rejected' WHERE id = ?", [
      bookingId,
    ]);

    // ✅ Set ad space back to 'available'
    await db.query("UPDATE ad_spaces SET status = 'available' WHERE id = ?", [
      spaceId,
    ]);

    res.status(200).json({ message: "Booking rejected successfully" });
  } catch (error) {
    console.error("❌ Error rejecting booking: ", error);
    res.status(500).json({ message: "Error rejecting booking" });
  }
});

module.exports = router;
