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

        // FIX: Handle Mongoose Validation Errors (e.g., missing providerEmail)
        if (error.name === 'ValidationError') {
            // Return 400 for bad client input
            return res.status(400).json({ success: false, message: error.message });
        }

        // Return 500 for true server errors
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET ALL SERVICES WITH PAGINATION AND SEARCH (Public)
router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";

        const skip = (page - 1) * limit;

        // Build search query
        const query = search
            ? {
                $or: [
                    { serviceName: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { serviceArea: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        // Get total count for pagination
        const total = await Service.countDocuments(query);

        // Get services with pagination
        const services = await Service.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            services,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        });
    } catch (error) {
        console.error("Get All Services Error:", error);
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

// GET SINGLE SERVICE BY ID (Public)
router.get("/:id", async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json(service);
    } catch (error) {
        console.error("Get Service Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// UPDATE SERVICE (Protected)
router.put("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // runValidators: true is necessary for Mongoose to check schema constraints
        );
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        console.error("Update Service Error:", error);

        // FIX: Handle Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            // Return 400 for bad client input
            return res.status(400).json({ success: false, message: error.message });
        }

        // Return 500 for true server errors
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE SERVICE (Protected)
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        console.error("Delete Service Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;