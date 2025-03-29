const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateJWT = require("../middleware/authenticateJWT");

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all pending bookings with payment info
router.get("/bookings", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        b.*, 
        p.id as payment_id, 
        p.amount, 
        p.payment_proof, 
        p.status as payment_status,
        p.approval_status,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        n.name as newspaper_name,
        a.space_name as ad_space_name
      FROM 
        bookings b
      JOIN payments p ON p.booking_id = b.id
      JOIN users u ON u.id = b.user_id
      JOIN newspapers n ON n.id = b.newspaper_id
      JOIN ad_spaces a ON a.id = b.space_id
      WHERE p.approval_status = 'pending'
      ORDER BY b.id DESC
    `);
    res.json(bookings);
  } catch (err) {
    console.error("Admin booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve booking and payment
router.post("/approve/:bookingId", authenticateJWT, requireAdmin, async (req, res) => {
  const { bookingId } = req.params;
  const { adminNotes } = req.body;

  try {
    // Start transaction
    await db.query("START TRANSACTION");

    // 1. Update payment status
    await db.query(`
      UPDATE payments 
      SET 
        status = 'completed',
        approval_status = 'approved'
      WHERE booking_id = ?
    `, [bookingId]);

    // 2. Update ad space status to booked
    await db.query(`
      UPDATE ad_spaces a
      JOIN bookings b ON a.id = b.space_id
      SET a.status = 'booked'
      WHERE b.id = ?
    `, [bookingId]);

    // 3. Update booking status in ads table
    await db.query(`
      UPDATE ads
      SET 
        status = 'approved',
        approval_status = 'approved',
        availability_status = 'not available'
      WHERE id IN (
        SELECT id FROM bookings WHERE id = ?
      )
    `, [bookingId]);

    // Commit transaction
    await db.query("COMMIT");

    res.json({ message: "Booking approved successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Approve booking error:", err);
    res.status(500).json({ message: "Error approving booking" });
  }
});

// Reject booking and payment
router.post("/reject/:bookingId", authenticateJWT, requireAdmin, async (req, res) => {
  const { bookingId } = req.params;
  const { adminNotes } = req.body;

  try {
    // Start transaction
    await db.query("START TRANSACTION");

    // 1. Update payment status
    await db.query(`
      UPDATE payments 
      SET 
        status = 'failed',
        approval_status = 'rejected'
      WHERE booking_id = ?
    `, [bookingId]);

    // 2. Update ad space status back to available
    await db.query(`
      UPDATE ad_spaces a
      JOIN bookings b ON a.id = b.space_id
      SET a.status = 'available'
      WHERE b.id = ?
    `, [bookingId]);

    // 3. Update booking status in ads table
    await db.query(`
      UPDATE ads
      SET 
        status = 'rejected',
        approval_status = 'rejected',
        availability_status = 'available'
      WHERE id IN (
        SELECT id FROM bookings WHERE id = ?
      )
    `, [bookingId]);

    // Commit transaction
    await db.query("COMMIT");

    res.json({ message: "Booking rejected successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Reject booking error:", err);
    res.status(500).json({ message: "Error rejecting booking" });
  }
});

module.exports = router;