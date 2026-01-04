const express = require("express");
const Staff = require("../models/Staff");
const router = express.Router();

// Get all staff
router.get("/", async (req, res) => {
    const staff = await Staff.find().sort({ name: 1 });
    res.json(staff);
});

// Add new staff
router.post("/", async (req, res) => {
    try {
        const staff = await Staff.create(req.body);
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: "Already exists or invalid!" });
    }
});

module.exports = router;
