const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Connect MongoDB
connectDB();

const app = express();

// MIDDLEWARE
app.use(
    cors({
        origin: [process.env.CLIENT_URL, "http://localhost:5173"],
        credentials: true,
    })
);
app.use(express.json());

// ROUTES
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));

// DEFAULT ROUTE
app.get("/", (req, res) => {
    res.json({ message: "HomeHero API is running..." });
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));