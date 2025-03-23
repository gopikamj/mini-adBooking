// authenticateJWT.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authenticateJWT = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  // Log the received header for debugging
  console.log('Auth Header:', authHeader);
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  
  // Check if it's a Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  
  const token = parts[1];
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Get user from database
    const [users] = await db.query('SELECT id, name, email, phone FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request object (without password)
    req.user = users[0];
    next();
  } catch (error) {
    console.error('JWT Authentication Error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateJWT;