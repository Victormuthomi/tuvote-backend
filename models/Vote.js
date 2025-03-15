import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure a voter can only vote once
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
  },
  { timestamps: true },
);

// ✅ Check if the model already exists before defining it
const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

export default Vote;
