const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const billRoutes = require("./routes/billRoutes");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const sellerLedgerRoutes = require("./routes/sellerLedgerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB (local now, cloud later)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch(err => console.log("DB Error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/seller-ledger", sellerLedgerRoutes);

// ✅ Dynamic PORT (local + cloud)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);
