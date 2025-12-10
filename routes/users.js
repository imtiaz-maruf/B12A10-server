const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE OR UPDATE USER
router.post("/", async (req, res) => {
    try {
        const { uid, email, displayName, photoURL, provider } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ message: "uid & email required" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { uid },
            {
                email,
                displayName,
                photoURL,
                provider,
                updatedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
