import express from "express";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   POST /api/candidates
// @desc    Add a candidate (Admin only)
// @access  Private (Admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { name, electionId } = req.body;

      const election = await Election.findById(electionId);
      if (!election) {
        return res.status(404).json({ message: "Election not found" });
      }

      const candidate = new Candidate({ name, election: electionId });
      await candidate.save();

      election.candidates.push(candidate._id);
      await election.save();

      res.status(201).json({ message: "Candidate added", candidate });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/candidates/:electionId
// @desc    Get candidates for an election
// @access  Public
router.get("/:electionId", async (req, res) => {
  try {
    const candidates = await Candidate.find({
      election: req.params.electionId,
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
