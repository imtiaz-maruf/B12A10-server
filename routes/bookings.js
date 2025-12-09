const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// CREATE BOOKING (Protected)
router.post("/", verifyFirebaseToken, async (req, res) => {
    try {
        console.log("📝 Booking request body:", req.body);

        // Validate required fields based on actual schema
        const requiredFields = [
            'serviceId',
            'serviceName',
            'serviceImage',
            'servicePrice',
            'providerEmail',
            'userEmail',
            'userName',
            'currentDate',
            'serviceTakingDate'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            console.error("❌ Missing required fields:", missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const booking = new Booking({
            serviceId: req.body.serviceId,
            serviceName: req.body.serviceName,
            serviceImage: req.body.serviceImage,
            servicePrice: req.body.servicePrice,
            providerEmail: req.body.providerEmail,
            providerName: req.body.providerName || "",
            userEmail: req.body.userEmail,
            userName: req.body.userName,
            currentDate: req.body.currentDate,
            serviceTakingDate: req.body.serviceTakingDate,
            specialInstruction: req.body.specialInstruction || "",
            status: req.body.status || "Pending"
        });

        const savedBooking = await booking.save();

        console.log("✅ Booking created successfully:", savedBooking._id);

        res.status(201).json({
            success: true,
            insertedId: savedBooking._id,
            data: savedBooking
        });
    } catch (error) {
        console.error("❌ Create Booking Error:", error);
        console.error("Error details:", error.message);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate booking detected"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message
        });
    }
});

// GET USER'S BOOKINGS (Protected)
router.get("/my-bookings/:email", verifyFirebaseToken, async (req, res) => {
    try {
        console.log("📖 Fetching bookings for:", req.params.email);

        const bookings = await Booking.find({
            userEmail: req.params.email.toLowerCase(),
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${bookings.length} bookings`);

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("❌ Get My Bookings Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// GET PROVIDER'S SCHEDULE (Protected)
router.get("/my-schedule/:email", verifyFirebaseToken, async (req, res) => {
    try {
        console.log("📅 Fetching schedule for provider:", req.params.email);

        const bookings = await Booking.find({
            providerEmail: req.params.email.toLowerCase(),
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${bookings.length} bookings`);

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("❌ Get My Schedule Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// UPDATE BOOKING STATUS (Protected)
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        console.log("🔄 Updating booking:", req.params.id, "Status:", req.body.status);

        // Validate status
        const validStatuses = ["Pending", "In Progress", "Completed"];
        if (req.body.status && !validStatuses.includes(req.body.status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!updated) {
            console.log("❌ Booking not found:", req.params.id);
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        console.log("✅ Booking updated successfully");

        res.json({
            success: true,
            modifiedCount: 1,
            data: updated
        });
    } catch (error) {
        console.error("❌ Update Booking Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// DELETE BOOKING (Protected)
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        console.log("🗑️ Deleting booking:", req.params.id);

        const deleted = await Booking.findByIdAndDelete(req.params.id);

        if (!deleted) {
            console.log("❌ Booking not found:", req.params.id);
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        console.log("✅ Booking deleted successfully");

        res.json({
            success: true,
            deletedCount: 1
        });
    } catch (error) {
        console.error("❌ Delete Booking Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

module.exports = router;