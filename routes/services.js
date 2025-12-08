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

// GET ALL SERVICES WITH PAGINATION & SEARCH (Public)
router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                $or: [
                    { serviceName: { $regex: search, $options: "i" } },
                    { serviceCategory: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const services = await Service.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await Service.countDocuments(searchQuery);

        res.json({
            success: true,
            services,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Get Services Error:", error);
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

// GET SINGLE SERVICE (Public)
router.get("/:id", async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res
                .status(404)
                .json({ success: false, message: "Service not found" });
        }
        res.json(service);
    } catch (error) {
        console.error("Get Service By ID Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// UPDATE SERVICE (Protected)
router.put("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        const updated = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res
                .status(404)
                .json({ success: false, message: "Service not found" });
        }
        res.json({
            success: true,
            message: "Service updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Update Service Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE SERVICE (Protected)
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Service not found" });
        }
        res.json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        console.error("Delete Service Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;