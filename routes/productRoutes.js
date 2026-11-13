const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    lowStockReport,
    categorySummary
} = require("../controllers/productController");

// Create
router.post("/", createProduct);

// Low stock report
router.get("/low-stock", lowStockReport);

// Category summary
router.get("/category-summary", categorySummary);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Update
router.put("/:id", updateProduct);

// Delete
router.delete("/:id", deleteProduct);

// Restock
router.patch("/:id/restock", restockProduct);

// Sell
router.patch("/:id/sale", sellProduct);

module.exports = router;