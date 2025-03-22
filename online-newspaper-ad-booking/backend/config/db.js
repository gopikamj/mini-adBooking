const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "newspaper_ads",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();

    // ✅ Test if the database is accessible
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Database query test successful!", rows);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
})();

module.exports = pool;
