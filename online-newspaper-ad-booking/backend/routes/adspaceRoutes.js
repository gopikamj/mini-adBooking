const express = require("express");
const router = express.Router();

// ✅ Test route to check if adspace API is working
router.get("/", (req, res) => {
  res.json({ message: "Ad Space Routes Working" });
});

module.exports = router; // ✅ Ensure it's correctly exported
