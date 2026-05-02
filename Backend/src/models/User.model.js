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
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },

    // 👇 EXISTING (unchanged)
    resumeUrl: {
      type: String,
      default: null,
    },

    // ✅ Resume metadata
    resumeMeta: {
      fileName: {
        type: String,
      },
      mimeType: {
        type: String,
      },
      size: {
        type: Number,
      },
      uploadedAt: {
        type: Date,
      },
    },
    
    extractedSkills: {
  type: [String],
  default: [],
},

    // ✅ Resume file stored in MongoDB
    resumeFile: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
