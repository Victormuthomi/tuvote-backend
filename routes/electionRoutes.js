import express from "express";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   POST /api/elections
// @desc    Create an election (Admin only)
// @access  Private (Admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { name, description, startDate, endDate } = req.body;
      const election = new Election({ name, description, startDate, endDate });
      await election.save();
      res.status(201).json({ message: "Election created", election });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/elections
// @desc    Get all elections
// @access  Public
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find().populate("candidates");
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
