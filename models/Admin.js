const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: { type: String, default: "owner" },
    password: { type: String, default: "saibaba999" }
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
