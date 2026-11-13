const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res, next) => {
    try {
        const {
            category,
            search,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        const currentPage = Math.max(1, Number(page));
        const perPage = Math.min(100, Math.max(1, Number(limit)));

        const products = await Product.find(filter)
            .sort(sort || "-createdAt")
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        const total = await Product.countDocuments(filter);

        res.json({
            total,
            page: currentPage,
            totalPages: Math.ceil(total / perPage),
            products
        });
    } catch (error) {
        next(error);
    }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// RESTOCK PRODUCT
exports.restockProduct = async (req, res, next) => {
    try {
        const amount = Number(req.body.quantity);

        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Enter a valid positive quantity"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: amount } },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Stock increased successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// SELL PRODUCT
exports.sellProduct = async (req, res, next) => {
    try {
        const amount = Number(req.body.quantity);

        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Enter a valid positive quantity"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: amount }
            },
            {
                $inc: { quantity: -amount }
            },
            { new: true }
        );

        if (!product) {
            return res.status(400).json({
                message: "Product not found or insufficient stock"
            });
        }

        res.json({
            message: "Product sold successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// LOW STOCK REPORT
exports.lowStockReport = async (req, res, next) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$lowStockThreshold"]
            }
        });

        res.json({
            message: "Low Stock Report",
            products
        });
    } catch (error) {
        next(error);
    }
};

// CATEGORY SUMMARY USING AGGREGATION
exports.categorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(summary);
    } catch (error) {
        next(error);
    }
};