const express = require("express");
const router = express.Router();
const SellerLedger = require("../models/SellerLedger");
const Expense = require("../models/Expense");

/* ---------------- GET ALL ---------------- */
router.get("/", async (req, res) => {
  const ledgers = await SellerLedger.find().sort({ sellerName: 1 });
  res.json(ledgers);
});

/* ---------------- ADD BILL ---------------- */
router.post("/add-bill", async (req, res) => {
  try {
    const { sellerName, billDate, amount } = req.body;

    if (!sellerName || !billDate || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    let ledger = await SellerLedger.findOne({ sellerName });

    if (!ledger) {
      ledger = new SellerLedger({
        sellerName,
        bills: [],
        payments: []
      });
    }

    // ❌ prevent duplicate bill same date

    ledger.bills.push({
      billDate: new Date(billDate),
      total: Number(amount),
      remaining: Number(amount)
    });

    await ledger.save();
    res.json(ledger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Add bill failed" });
  }
});

/* ---------------- PAY SELLER (FIFO) ---------------- */
router.post("/pay/:id", async (req, res) => {
  try {
    let { amount, mode, paidBy } = req.body;
    amount = Number(amount);

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const ledger = await SellerLedger.findById(req.params.id);
    if (!ledger) return res.status(404).json({ error: "Ledger not found" });

    let remainingPay = amount;

    for (const bill of ledger.bills) {
      if (remainingPay <= 0) break;

      if (bill.remaining > 0) {
        const deduct = Math.min(bill.remaining, remainingPay);
        bill.remaining -= deduct;
        remainingPay -= deduct;
      }
    }

    if (remainingPay > 0) {
      return res.status(400).json({
        error: "Payment exceeds pending balance"
      });
    }

    ledger.payments.push({
      amount,
      mode,
      paidBy
    });

    await ledger.save();

    // 🔥 add to expenses
    await Expense.create({
      title: `Seller Payment - ${ledger.sellerName}`,
      amount,
      date: new Date()
    });

    res.json(ledger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
});

/* ---------------- DELETE LEDGER ---------------- */
router.delete("/:id", async (req, res) => {
  await SellerLedger.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
