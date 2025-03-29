const express = require("express");
const db = require("../config/db");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

/** 
 * ✅ Fetch all ad spaces
 * Endpoint: GET /api/ads/spaces
 */
router.get("/spaces", async (req, res) => {
    try {
        const [ads] = await db.query("SELECT * FROM ad_spaces");
        res.json(ads);
    } catch (error) {
        console.error("Error fetching ad spaces:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/** 
 * ✅ Book an Ad
 * Endpoint: POST /api/ads/book
 * Authentication: Required
 */
router.post("/book", authenticateJWT, async (req, res) => {
    const { newspaperId, adSpaceId, content, price } = req.body;
    const userId = req.user.userId;

    if (!newspaperId || !adSpaceId || !content || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the ad space is available
        const [space] = await db.query("SELECT * FROM ad_spaces WHERE id = ? AND status = 'available'", [adSpaceId]);
        if (space.length === 0) {
            return res.status(400).json({ message: "Ad space is not available" });
        }

        // Book the ad and set status to "pending"
        await db.query(
            "INSERT INTO ads (user_id, newspaper_id, ad_space_id, content, price, status) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, newspaperId, adSpaceId, content, price, "pending"]
        );

        // ✅ Update ad space status to "pending" (not booked yet)
        await db.query("UPDATE ad_spaces SET status = 'pending' WHERE id = ?", [adSpaceId]);

        res.status(201).json({ message: "Ad booked successfully and awaiting admin approval!" });
    } catch (error) {
        console.error("Error booking ad:", error);
        res.status(500).json({ message: "Error booking ad" });
    }
});


/** 
 * ✅ Fetch user ads
 * Endpoint: GET /api/ads/user-ads
 * Authentication: Required
 */
router.get("/user-ads", authenticateJWT, async (req, res) => {
    try {
        const [ads] = await db.query("SELECT * FROM ads WHERE user_id = ?", [req.user.userId]);
        res.json(ads);
    } catch (error) {
        console.error("Error fetching user ads:", error);
        res.status(500).json({ message: "Error fetching user ads" });
    }
});

module.exports = router;
