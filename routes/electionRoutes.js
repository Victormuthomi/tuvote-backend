import express from "express";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js"; // Ensure Vote model exists
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
      const { name, description, startDate, endDate, candidates } = req.body;

      const election = new Election({ name, description, startDate, endDate });
      await election.save();

      if (candidates && candidates.length > 0) {
        const candidateDocs = candidates.map((candidate) => ({
          ...candidate,
          election: election._id,
        }));

        const savedCandidates = await Candidate.insertMany(candidateDocs);

        election.candidates = savedCandidates.map((c) => c._id);
        await election.save();
      }

      res.status(201).json({ message: "Election created", election });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/elections
// @desc    Get all elections with candidates populated
// @access  Public
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find().populate("candidates");
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/elections/:id
// @desc    Get a single election by ID with candidates populated
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate(
      "candidates",
    );
    if (!election)
      return res.status(404).json({ message: "Election not found." });

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/elections/:id/results
// @desc    Get election results
// @access  Public
router.get("/:id/results", async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election)
      return res.status(404).json({ message: "Election not found." });

    const votes = await Vote.find({ election: id }).populate("candidate");

    const results = {};
    votes.forEach((vote) => {
      const candidateId = vote.candidate._id.toString();
      results[candidateId] = results[candidateId]
        ? results[candidateId] + 1
        : 1;
    });

    const candidates = await Candidate.find({ election: id });

    const formattedResults = candidates.map((candidate) => ({
      candidate: candidate.name,
      votes: results[candidate._id.toString()] || 0,
    }));

    res.json({ electionId: id, results: formattedResults });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/vote/check
// @desc    Check if a user has voted
// @access  Private (Authenticated user)
router.get("/vote/check", authMiddleware, async (req, res) => {
  try {
    const { election } = req.query;
    const userId = req.user.id;

    const electionRecord = await Election.findById(election);
    if (!electionRecord)
      return res.status(404).json({ message: "Election not found." });

    const existingVote = await Vote.findOne({
      election: electionRecord._id,
      voter: userId,
    });
    if (existingVote) return res.json({ message: "You have already voted." });

    res.json({ message: "You have not voted yet." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
