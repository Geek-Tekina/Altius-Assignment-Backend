const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { role } = req.body;
    var user;
    if (role) {
      if (role == "admin") {
        res.status(401).json({
          message: "Only super admins can create admin in the server!!",
        });
        return;
      }
      user = await User.create({ name, email, password, role });
    } else {
      // default is customer
      user = await User.create({ name, email, password });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      message: "Customer Created Successfully !!",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({ message: "User logged In Succesfully !!", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
