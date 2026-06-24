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

    // ==========================================
    // RESUME URL (Legacy)
    // ==========================================
    resumeUrl: {
      type: String,
      default: null,
    },

    // ==========================================
    // RESUME METADATA
    // ==========================================
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

    // ==========================================
    // AI EXTRACTED SKILLS
    // ==========================================
    extractedSkills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // AI GENERATED RESUME PROFILE
    // ==========================================
    resumeProfile: {
      suggestedRole: {
        type: String,
        default: "",
      },

      experienceLevel: {
        type: String,
        default: "",
      },

      projects: {
        type: [String],
        default: [],
      },

      education: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // RESUME FILE STORED IN MONGODB
    // ==========================================
    resumeFile: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;