const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const newspaperRoutes = require("./routes/newspaperRoutes");
const adBookingRoutes = require("./routes/adBookingRoutes"); // ✅ Added

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
app.use("/api/ad-booking", adBookingRoutes); // ✅ Ensure this is added

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
