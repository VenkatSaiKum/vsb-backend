const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// CATEGORY SUMMARY (MUST BE FIRST)
router.get("/summary/category", async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $group: {
          _id: "$category.name",
          totalStock: { $sum: "$stock" },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});


// ➕ Add Product OR Update Existing Stock (No Duplicates)
router.post("/", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // 🔍 check duplicate by name + category(ObjectId)
    const existing = await Product.findOne({
      name,
      category
    });

    if (existing) {
      existing.stock += Number(stock);
      existing.price = price;

      await existing.save();

      return res.json({
        message: "Product exists. Stock updated ✔",
        product: existing
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock
    });

    res.json(product);
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});



// 📌 Get all products
router.get("/", async (req, res) => {
  const products = await Product
    .find()
    .populate("category", "name");

  res.json(products);
});



// ✏ Update Product Details
// Edit product (duplicate-safe)
router.put("/:id", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Check if another product with same name+category exists
    const duplicate = await Product.findOne({
      _id: { $ne: req.params.id },
      name,
      category
    });

    if (duplicate) {
      // Merge stock into existing product
      duplicate.stock += Number(stock);
      duplicate.price = price;
      await duplicate.save();

      // Remove the edited product to avoid duplicates
      await Product.findByIdAndDelete(req.params.id);

      return res.json({
        message: "Merged with existing product ✔",
        product: duplicate
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, stock },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Edit Product Error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});


// ❌ Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
