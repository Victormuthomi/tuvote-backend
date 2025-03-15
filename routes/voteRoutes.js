import express from "express";
import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/vote
// @desc    Cast votes for an election (one vote per candidate)
// @access  Private (Voter)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { votes } = req.body; // Array of { candidate, election }

    // Input Validation
    if (!votes || !Array.isArray(votes) || votes.length === 0) {
      return res.status(400).json({ message: "Invalid vote data." });
    }

    const electionId = votes[0].election;

    // Validate Election and candidates
    const election = await Election.findById(electionId).populate("candidates");
    if (!election) {
      console.error(`Election not found: ${electionId}`);
      return res.status(404).json({ message: "Election not found." });
    }

    const candidateIds = election.candidates.map((c) => c._id.toString());
    const positionsVotedFor = new Set();

    // Validate votes for candidates
    for (const vote of votes) {
      if (!candidateIds.includes(vote.candidate)) {
        console.error(`Invalid candidate: ${vote.candidate}`);
        return res
          .status(400)
          .json({ message: "Invalid candidate for this election." });
      }

      const candidate = await Candidate.findById(vote.candidate);
      if (!candidate) {
        console.error(`Candidate not found: ${vote.candidate}`);
        return res.status(404).json({ message: "Candidate not found." });
      }

      positionsVotedFor.add(candidate._id.toString());
    }

    // Check if voter has already voted in this election
    const existingVote = await Vote.findOne({
      voter: userId,
      election: electionId,
    });
    if (existingVote) {
      console.error(
        `User ${userId} has already voted in election: ${electionId}`,
      );
      return res
        .status(403)
        .json({ message: "You have already voted in this election." });
    }

    // Save votes in a single batch to improve performance
    await Vote.insertMany(
      votes.map((vote) => ({
        voter: userId,
        candidate: vote.candidate,
        election: electionId,
      })),
    );

    res.json({ message: "✅ Vote cast successfully!" });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/vote/:electionId/results
// @desc    Get election results
// @access  Public
router.get("/:electionId/results", async (req, res) => {
  try {
    const { electionId } = req.params;

    // Fetch votes for the election
    const votes = await Vote.find({ election: electionId }).populate(
      "candidate",
    );

    if (!votes.length) {
      return res
        .status(404)
        .json({ message: "No votes found for this election." });
    }

    // Count votes per candidate
    const results = {};
    votes.forEach((vote) => {
      const candidateId = vote.candidate._id.toString();
      results[candidateId] = results[candidateId]
        ? results[candidateId] + 1
        : 1;
    });

    // Fetch candidate details
    const candidates = await Candidate.find({ election: electionId });

    const formattedResults = candidates.map((candidate) => ({
      candidate: candidate.name,
      votes: results[candidate._id.toString()] || 0,
    }));

    res.json({ electionId, results: formattedResults });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
