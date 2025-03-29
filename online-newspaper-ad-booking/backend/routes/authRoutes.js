const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// ✅ Test Route - To check if authRoutes is working
router.get("/", (req, res) => {
    res.send("Auth API is working!");
});

// =======================
// ✅ Signup Route
// =======================
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, phone, password } = req.body;

    try {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      
      // ✅ Fixed the check for existingUser length
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Default role is "user" during signup
      await db.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone, hashedPassword, "user"]
      );

      res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =======================
// ✅ Login Route
// =======================
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

      if (users.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // ✅ Include the user's role in the JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: "Login successful!",
        token,
        role: user.role,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =======================
// ✅ Get Authenticated User
// =======================
router.get("/user", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
