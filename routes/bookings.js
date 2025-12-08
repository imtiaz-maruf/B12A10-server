const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// CREATE BOOKING (Protected)
router.post("/", verifyFirebaseToken, async (req, res) => {
    try {
        const booking = new Booking(req.body);
        const savedBooking = await booking.save();
        res.status(201).json({ insertedId: savedBooking._id });
    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: "Failed to create booking" });
    }
});

// GET USER'S BOOKINGS (Protected)
router.get("/my-bookings/:email", verifyFirebaseToken, async (req, res) => {
    try {
        const bookings = await Booking.find({
            userEmail: req.params.email,
        }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error("Get My Bookings Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// GET PROVIDER'S SCHEDULE (Protected)
router.get("/my-schedule/:email", verifyFirebaseToken, async (req, res) => {
    try {
        const bookings = await Booking.find({
            providerEmail: req.params.email,
        }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error("Get My Schedule Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE BOOKING STATUS (Protected)
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json({ modifiedCount: 1, data: updated });
    } catch (error) {
        console.error("Update Booking Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE BOOKING (Protected)
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
    try {
        const deleted = await Booking.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json({ deletedCount: 1 });
    } catch (error) {
        console.error("Delete Booking Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;