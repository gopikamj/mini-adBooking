const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = users[0]; // Attach user details to request
    next();
  } catch (error) {
    console.error('JWT Authentication Error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateJWT;
