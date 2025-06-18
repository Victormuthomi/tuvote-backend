import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/config.js"; // import the config

import authRoutes from "./routes/authRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();

// Middleware
const frontendURL = "https://tuvote-frontend.vercel.app";
app.use(
  cors({
    origin: frontendURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/votes", voteRoutes);

// Connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
connectDB();

app.get("/", (req, res) => {
  res.send("Tuvote API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
