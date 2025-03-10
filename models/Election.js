import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
});

const Election = mongoose.model("Election", electionSchema);
export default Election;
