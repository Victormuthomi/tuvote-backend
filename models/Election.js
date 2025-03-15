import mongoose from "mongoose";
import "./Candidate.js"; // Ensure the Candidate model is registered

const ElectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }], // Reference Candidate model
});

const Election = mongoose.model("Election", ElectionSchema);
export default Election;
