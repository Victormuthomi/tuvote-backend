import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "voter"], default: "voter" }, // Role-based access
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
