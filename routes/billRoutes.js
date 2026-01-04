const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

// Get all bills (for Bill History)
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ billNo: -1 });
    res.json(bills);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error loading bills" });
  }
});

// Get last bill number
router.get("/last", async (req, res) => {
  try {
    const lastBill = await Bill.findOne().sort({ billNo: -1 });
    res.json(lastBill || { billNo: 0 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting last bill" });
  }
});

// Save New Bill (including STAFF)
router.post("/", async (req, res) => {
  try {
    const lastBill = await Bill.findOne().sort({ billNo: -1 });
    const newBillNo = lastBill ? lastBill.billNo + 1 : 1;

    const bill = new Bill({
      billNo: newBillNo,
      items: req.body.items,
      paymentMode: req.body.paymentMode,
      staff: req.body.staff || "Not Recorded", // ⭐ Save Staff correctly
      total: req.body.total,
      date: new Date()
    });

    await bill.save();
    res.json(bill);
  } catch (err) {
    console.error("Bill Save Error:", err);
    res.status(500).json({ error: "Failed to save bill" });
  }
});

// Today's Sales Summary
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bills = await Bill.find({
      date: { $gte: today }
    });

    const cash = bills
      .filter((b) => b.paymentMode === "Cash")
      .reduce((sum, b) => sum + b.total, 0);

    const upi = bills
      .filter((b) => b.paymentMode === "UPI")
      .reduce((sum, b) => sum + b.total, 0);

    const total = cash + upi;

    res.json({
      count: bills.length,
      total,
      cash,
      upi
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// 🔝 Top Sold Products Today
router.get("/top-products", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bills = await Bill.find({
      date: { $gte: today }
    });

    const productMap = {};

    bills.forEach(bill => {
      bill.items.forEach(item => {
        productMap[item.name] =
          (productMap[item.name] || 0) + item.qty;
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.json(topProducts);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});


module.exports = router;
