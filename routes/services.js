const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const cors = require("cors");

// -------------------
// Allow CORS for ALL routes in this router
// -------------------
const allowedOrigins = [
    "https://home-hero-b12a10-client.netlify.app",
    "http://localhost:5173",
];

router.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// -------------------
// ROUTES
// -------------------

// CREATE SERVICE (Protected)
router.post("/", verifyFirebaseToken, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        console.error("Create Service Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET TOP-RATED SERVICES (Public)
router.get("/top-rated", async (req, res) => {
    try {
        const services = await Service.find()
            .sort({ averageRating: -1, createdAt: -1 })
            .limit(6);

        // ✅ Ensure CORS header is always sent
        res.set("Access-Control-Allow-Origin", "https://home-hero-b12a10-client.netlify.app");
        res.set("Access-Control-Allow-Credentials", "true");

        res.json(services);
    } catch (error) {
        console.error("Get Top Services Error:", error);
        res.set("Access-Control-Allow-Origin", "https://home-hero-b12a10-client.netlify.app");
        res.set("Access-Control-Allow-Credentials", "true");
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET SERVICES BY PROVIDER EMAIL (Protected)
router.get("/my-services/:email", verifyFirebaseToken, async (req, res) => {
    try {
        const services = await Service.find({
            providerEmail: req.params.email,
        }).sort({ createdAt: -1 });
        res.set("Access-Control-Allow-Origin", "https://home-hero-b12a10-client.netlify.app");
        res.set("Access-Control-Allow-Credentials", "true");
        res.json(services);
    } catch (error) {
        console.error("Get My Services Error:", error);
        res.set("Access-Control-Allow-Origin", "https://home-hero-b12a10-client.netlify.app");
        res.set("Access-Control-Allow-Credentials", "true");
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
