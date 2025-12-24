const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },

    // 👇 NEW FIELDS FOR AI RECOMMENDATION
    degree: {
      type: String
    },
    skills: [
      {
        type: String
      }
    ],
    interests: [
      {
        type: String
      }
    ],
    preferredLocation: {
      type: String
    },
    internshipType: {
      type: String,
      enum: ["remote", "on-site", "hybrid"]
    },
    careerGoal: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
