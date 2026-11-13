const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        min: 0
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);