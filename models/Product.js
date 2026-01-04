const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  },
  { timestamps: true }
);

// normalize name (keep this)
ProductSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name
      .trim()
      .toLowerCase()
      .replace(/\bwatt\b/gi, "W")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
