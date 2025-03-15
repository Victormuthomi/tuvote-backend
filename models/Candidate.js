import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  seat: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

export default mongoose.model("Candidate", CandidateSchema);
