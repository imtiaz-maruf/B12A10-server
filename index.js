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
// FIXED CORS
// ----------------------
const allowedOrigins = [
    process.env.CLIENT_URL,                             // Netlify client
    "http://localhost:5173",                            // Local dev
    "https://b12-a10-server-59nx.vercel.app",           // Vercel BACKEND
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow non-browser requests (Postman, server-to-server)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("❌ Blocked by CORS:", origin);
                callback(null, false); // Do NOT throw error, just block
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        preflightContinue: false,
        optionsSuccessStatus: 200,
    })
);

// Handle OPTIONS preflight for all routes
app.options("*", cors());

// Body parser
app.use(express.json());

// ----------------------
// ROUTES
// ----------------------
app.use("/services", require("./routes/services"));
app.use("/bookings", require("./routes/bookings"));

// DEFAULT ROUTE
app.get("/", (req, res) => {
    res.json({ message: "HomeHero API is running with full CORS support..." });
});

// SERVER LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
