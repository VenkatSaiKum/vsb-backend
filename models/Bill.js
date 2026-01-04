const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  billNo: Number,
  items: Array,
  paymentMode: String,
  staff: { type: String, default: "Not Recorded" }, // ⭐ Ensure exists here
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", BillSchema);

