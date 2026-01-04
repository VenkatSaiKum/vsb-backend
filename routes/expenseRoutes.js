const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ➕ Add Expense
router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create({
      title: req.body.title,
      amount: req.body.amount,
      date: new Date()
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// 📌 Get ALL expenses (table)
router.get("/", async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

// ⭐ TODAY EXPENSE TOTAL (THIS FIXES EVERYTHING)
router.get("/today-total", async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const expenses = await Expense.find({
    date: { $gte: start, $lte: end }
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  res.json({ total });
});
// GET TODAY EXPENSES LIST
router.get("/today", async (req, res) => {
  const start = new Date();
  start.setHours(0,0,0,0);

  const end = new Date();
  end.setHours(23,59,59,999);

  const expenses = await Expense.find({
    date: { $gte: start, $lte: end }
  }).sort({ date: -1 });

  res.json(expenses);
});

module.exports = router;
