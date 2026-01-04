const express = require("express");
const Bill = require("../models/Bill");
const router = express.Router();

// Save Bill
router.post("/", async (req, res) => {
    const bill = new Bill(req.body);
    await bill.save();
    res.json({ success: true });
});

// Get Last Bill Number
router.get("/last", async (req, res) => {
    const lastBill = await Bill.find().sort({ billNo: -1 }).limit(1);
    res.json({ billNo: lastBill[0]?.billNo || 0 });
});

// Get all bills (History)
router.get("/", async (req, res) => {
    const bills = await Bill.find().sort({ date: -1 });
    res.json(bills);
});

module.exports = router;
