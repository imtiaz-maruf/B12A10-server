const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// TRUST PROXY (Fixes 308 redirect issues on Vercel)
app.set("trust proxy", 1);

// ----------------------
// CORS CONFIGURATION FOR VERCEL
// ----------------------
const allowedOrigins = [
    "https://home-hero-b12a10-client.netlify.app",
    "http://localhost:5173",
];

// Custom CORS middleware that works on Vercel
app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }

    // Fix COOP warning
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Body parser
app.use(express.json());

// ----------------------
// ROUTES
// ----------------------
app.use("/services", require("./routes/services"));
app.use("/bookings", require("./routes/bookings"));
app.use("/users", require("./routes/users"));


// DEFAULT ROUTE
app.get("/", (req, res) => {
    res.json({ message: "HomeHero API is running..." });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: err.message || "Server Error" });
});

// SERVER LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app; // Export for Vercel