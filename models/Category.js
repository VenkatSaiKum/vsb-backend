const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Auto-format category name — Title Case
CategorySchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
