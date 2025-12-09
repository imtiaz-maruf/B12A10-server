const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

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

        res.json(services);
    } catch (error) {
        console.error("Get Top Services Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET SERVICES BY PROVIDER EMAIL (Protected)
router.get("/my-services/:email", verifyFirebaseToken, async (req, res) => {
    try {
        const services = await Service.find({
            providerEmail: req.params.email,
        }).sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        console.error("Get My Services Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;