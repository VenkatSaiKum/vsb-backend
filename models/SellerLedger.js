const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  billDate: { type: Date, required: true },
  total: { type: Number, required: true },
  remaining: { type: Number, required: true }
});

const PaymentSchema = new mongoose.Schema({
  amount: Number,
  mode: String,
  paidBy: String,
  date: { type: Date, default: Date.now }
});

const SellerLedgerSchema = new mongoose.Schema({
  sellerName: { type: String, required: true, unique: true },
  bills: [BillSchema],
  payments: [PaymentSchema]
});

module.exports = mongoose.model("SellerLedger", SellerLedgerSchema);
