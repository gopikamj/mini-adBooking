const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Fetch all booked ads
router.get("/", (req, res) => {
    const query = "SELECT ads.id, users.name AS user_name, newspapers.name AS newspaper_name, ads.content, ads.price FROM ads JOIN users ON ads.user_id = users.id JOIN newspapers ON ads.newspaper_id = newspapers.id";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

module.exports = router;
