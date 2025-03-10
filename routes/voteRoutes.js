import express from "express";
import Candidate from "../models/Candidate.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/vote
// @desc    Cast a vote (Voter only)
// @access  Private (Voter)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { candidateId } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1;
    await candidate.save();

    res.json({ message: "Vote cast successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
