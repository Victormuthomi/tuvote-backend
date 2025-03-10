import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  votes: { type: Number, default: 0 },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
