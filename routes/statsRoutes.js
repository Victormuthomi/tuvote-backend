import express from "express";
import User from "../models/user.js"; // Assuming users collection contains voters
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalVoters = await User.countDocuments({ role: "voter" });
    const totalCandidates = await Candidate.countDocuments();
    const totalVotes = await Vote.countDocuments();

    res.json({ totalVoters, totalCandidates, totalVotes });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
