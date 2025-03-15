import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import dotenv from "dotenv"; // Commented out as it's not necessary if you hardcode the Mongo URI
import authRoutes from "./routes/authRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();

// Middleware
const frontendURL = "https://tuvote-frontend.vercel.app"; // Add your frontend URL here
app.use(
  cors({
    origin: frontendURL, // Allow the Vercel frontend to communicate with the backend
    methods: ["GET", "POST", "PUT", "DELETE"], // You can adjust methods as needed
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/votes", voteRoutes);

// Database Connection
const connectDB = async () => {
  try {
    // Hardcoded MongoDB URI
    const mongoURI =
      "mongodb+srv://victor:Kibanga100.@clustervote.wavow.mongodb.net/votes?retryWrites=true&w=majority&appName=Clustervote";
    await mongoose.connect(mongoURI, {
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
