const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// User Signup
router.post("/signup", (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            // Default role = 'user' for new signups
            db.query(
                "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
                [name, email, hash, phone, "user"],
                (err, result) => {
                    if (err) return res.status(500).json({ message: "Database error" });
                    res.status(201).json({ message: "User registered successfully" });
                }
            );
        });
    });
});

// User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Error comparing passwords" });

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Include user role and ID in the JWT token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            });
        });
    });
});

module.exports = router;
