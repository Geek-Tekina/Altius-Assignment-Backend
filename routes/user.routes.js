const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Ticket = require("../models/Ticket");
const { protect, authorize } = require("../middleware/auth");

// Get all users (admin only)
router.get("/all-users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create user (admin only)
router.post("/create-user", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dashboard stats (admin only)
router.get(
  "/dashboard-stats",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const totalCustomers = await User.countDocuments({ role: "customer" });
      const totalTickets = await Ticket.countDocuments();

      res.json({
        totalCustomers,
        totalTickets,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
