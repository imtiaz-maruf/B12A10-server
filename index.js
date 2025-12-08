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
// CORS FIXED COMPLETELY
// ----------------------
const allowedOrigins = [
    process.env.CLIENT_URL,          // Netlify frontend
    "http://localhost:5173",         // Local development
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (Postman, server-side)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Body parser
app.use(express.json());

// ----------------------
// ROUTES
// ----------------------
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));

// DEFAULT ROUTE
app.get("/", (req, res) => {
    res.json({ message: "HomeHero API is running..." });
});

// SERVER LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
