const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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

    education: {
      degree: String,
      branch: String,
      year: Number
    },

    skills: {
      type: [String],
      default: []
    },

    interests: {
      type: [String],
      default: []
    },

    preferences: {
      internshipType: String,
      location: String,
      paidOnly: Boolean
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
