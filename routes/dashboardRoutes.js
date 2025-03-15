import express from "express";

const router = express.Router();

// Mock dashboard data (Replace this with actual database queries)
router.get("/", async (req, res) => {
  try {
    // Replace with actual data fetching logic from MongoDB
    const dashboardData = {
      totalVoters: 1200,
      totalCandidates: 10,
      totalVotes: 900,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
