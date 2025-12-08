const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        serviceName: {
            type: String,
            required: true,
        },
        serviceImage: {
            type: String,
            required: true,
        },
        servicePrice: {
            type: Number,
            required: true,
        },
        providerEmail: {
            type: String,
            required: true,
            lowercase: true,
        },
        providerName: {
            type: String,
        },
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
        },
        userName: {
            type: String,
            required: true,
        },
        currentDate: {
            type: String,
            required: true,
        },
        serviceTakingDate: {
            type: String,
            required: true,
        },
        specialInstruction: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", BookingSchema);