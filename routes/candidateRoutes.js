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
      const { name, electionId, picture, manifesto, position } = req.body;

      const election = await Election.findById(electionId);
      if (!election) {
        return res.status(404).json({ message: "Election not found" });
      }

      const candidate = new Candidate({
        name,
        election: electionId,
        picture,
        manifesto,
        position,
      });

      await candidate.save();
      election.candidates.push(candidate._id);
      await election.save();

      res.status(201).json({ message: "Candidate added", candidate });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/candidates
// @desc    Get all candidates
// @access  Public
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().populate("election", "name");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/candidates/:electionId
// @desc    Get candidates for a specific election
// @access  Public
router.get("/:electionId", async (req, res) => {
  try {
    const candidates = await Candidate.find({ election: req.params.electionId })
      .populate("election", "name")
      .exec();

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/candidates/vote
// @desc    Submit votes
// @access  Private (Authenticated Users)
router.post("/vote", authMiddleware, async (req, res) => {
  try {
    const { votes } = req.body; // Expecting an array of candidate IDs

    if (!votes || !Array.isArray(votes) || votes.length === 0) {
      return res.status(400).json({ message: "No votes submitted" });
    }

    // TODO: Implement voting logic based on your system:
    // 1. Ensure the user hasn't voted before
    // 2. Validate if the candidates exist
    // 3. Store the vote in the database

    res.status(200).json({ message: "Votes submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
