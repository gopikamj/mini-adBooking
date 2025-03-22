const db = require("../config/db"); // Import MySQL connection

const User = {
  createUser: (name, email, password, callback) => {
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], callback);
  },

  getUserByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  }
};

module.exports = User;
