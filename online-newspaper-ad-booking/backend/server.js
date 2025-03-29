const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const newspaperRoutes = require("./routes/newspaperRoutes");
const adRoutes = require("./routes/adRoutes");
const adBookingRoutes = require("./routes/adBookingRoutes"); // ✅ Added

const adminRoutes = require("./routes/adminRoutes");


dotenv.config();
const app = express();


// ✅ CORS Middleware - Allow frontend access
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());

// ✅ Default Route to Verify Server is Running
app.get("/", (req, res) => {
  res.send("Welcome to the Newspaper Advertisement Booking API!");
});

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/newspapers", newspaperRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/ad-booking", adBookingRoutes); // ✅ Ensure this is added

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


async function createAdminUser() {
  const adminEmail = 'admin@example.com';
  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ?", 
    [adminEmail]
  );

  if (existing.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ['Admin', adminEmail, hashedPassword, 'admin']
    );
    console.log('Admin user created');
  }
}

// Call this when your server starts
createAdminUser();