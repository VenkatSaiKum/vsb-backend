const express = require("express");
const Admin = require("../models/Admin");
const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });

    if (!admin) return res.status(400).json({ message: "Invalid Credentials" });

    res.json({ message: "Login Success ✔" });
});

module.exports = router;
