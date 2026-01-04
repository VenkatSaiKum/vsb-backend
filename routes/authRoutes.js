const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Temporary Login
router.post("/login", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ error: "Invalid User" });
  }

  res.json({
    username: user.username,
    role: user.role,
  });
});

// Create Owner User (Run once)
router.post("/create-owner", async (req, res) => {
  try {
    const owner = new User({
      username: "owner",
      password: "saibaba999",
      role: "owner",
    });
    await owner.save();
    res.json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
