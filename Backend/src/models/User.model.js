import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 👇 NEW FIELDS FOR AI RECOMMENDATION
    degree: String,
    skills: [String],
    interests: [String],
    preferredLocation: String,
    internshipType: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
    },
    careerGoal: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
