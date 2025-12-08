const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
            trim: true,
        },
        serviceCategory: {
            type: String,
            required: true,
            enum: ["Plumbing", "Electrical", "Cleaning", "Carpentry", "HVAC"],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        serviceArea: {
            type: String,
            required: true,
            trim: true,
        },
        serviceDescription: {
            type: String,
            required: true,
        },
        serviceImage: {
            type: String,
            required: true,
        },
        providerName: {
            type: String,
            required: true,
        },
        providerEmail: {
            type: String,
            required: true,
            lowercase: true,
        },
        providerImage: {
            type: String,
            default: "",
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: [
            {
                userEmail: String,
                userName: String,
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
                comment: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Service", ServiceSchema);