const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const { protect, authorize } = require("../middleware/auth");

// Get all tickets (agents and admin)
router.get(
  "/all-tickets",
  protect,
  authorize("agent", "admin"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate("customer", "name email")
        .sort("-lastUpdated");
      res.json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get customer's tickets
router.get("/my-tickets", protect, authorize("customer"), async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user._id }).sort(
      "-lastUpdated"
    );
    res.json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create ticket
router.post(
  "/create-ticket",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {
      const { title } = req.body;
      const ticketId = "TIC" + Date.now().toString().slice(-6);

      const ticket = await Ticket.create({
        ticketId,
        title,
        customer: req.user._id,
      });

      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Add note to ticket
router.post("/add/:id/notes", protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const { content } = req.body;
    ticket.notes.push({
      content,
      createdBy: req.user._id,
    });

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update ticket status
router.patch(
  "/update-status/:id/status",
  protect,
  authorize("agent", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
