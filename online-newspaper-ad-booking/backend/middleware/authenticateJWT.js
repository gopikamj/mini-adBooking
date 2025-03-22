const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateJWT = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;

  // Log the received header for debugging
  console.log("Auth Header Received:", authHeader);

  // Check if the authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Ensure userId is present in the token
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Check if the user exists in the database
    const [users] = await db.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user data to the request object (for use in subsequent middleware)
    req.user = users[0];

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = authenticateJWT;
