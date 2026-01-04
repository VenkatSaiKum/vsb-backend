const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

// ➕ Add Category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name.trim()) {
      return res.status(400).json({ message: "Category name required" });
    }

    // Prevent duplicate category
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.json({ message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();

    res.json({ message: "Category added ✔", category });
  } catch (error) {
    res.status(500).json({ error: "Add failed" });
  }
});

// 📌 Get all Categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// ❌ Delete Category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted ✔" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
