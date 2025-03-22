const express = require("express");
const router = express.Router();
const db = require("../config/db");
const nodemailer = require("nodemailer");

// Get all newspapers
router.get("/newspapers", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM newspapers");
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Get available and booked ad spaces for a selected newspaper
router.get("/ad-spaces/:newspaperId", async (req, res) => {
    const { newspaperId } = req.params;
    try {
        const [results] = await db.query("SELECT * FROM ad_spaces WHERE newspaper_id = ?", [newspaperId]);
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Calculate price dynamically based on content length
router.post("/calculate-price", (req, res) => {
    const { content, basePrice, maxPrice } = req.body;
    if (!content || !basePrice || !maxPrice) {
        return res.status(400).json({ message: "Invalid input" });
    }

    let contentLength = content.length;
    let price = basePrice + (contentLength * 0.5); // Example: 50 cents per character

    if (price > maxPrice) {
        const allowedLength = Math.floor((maxPrice - basePrice) / 0.5);
        content = content.substring(0, allowedLength);
        price = maxPrice;
    }

    res.json({ price, content });
});

// Book an ad space
router.post("/book-ad", async (req, res) => {
    const { userId, newspaperId, spaceId, content, price, email } = req.body;

    if (!userId || !newspaperId || !spaceId || !content || !price || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the space is available
        const [space] = await db.query("SELECT * FROM ad_spaces WHERE id = ? AND status = 'available'", [spaceId]);
        if (space.length === 0) {
            return res.status(400).json({ message: "Ad space is not available" });
        }

        // Insert booking details
        await db.query(
            "INSERT INTO bookings (user_id, newspaper_id, space_id, content, price) VALUES (?, ?, ?, ?, ?)",
            [userId, newspaperId, spaceId, content, price]
        );

        // Update ad space status
        await db.query("UPDATE ad_spaces SET status = 'booked' WHERE id = ?", [spaceId]);

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com",
                pass: "your-email-password"
            }
        });

        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Ad Booking Confirmation",
            text: `Your ad has been successfully booked for newspaper ID: ${newspaperId}. Thank you!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email error:", error);
                return res.status(500).json({ message: "Booking successful, but email failed" });
            }
            res.json({ message: "Booking successful! Confirmation email sent." });
        });

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Error booking ad" });
    }
});

module.exports = router;
