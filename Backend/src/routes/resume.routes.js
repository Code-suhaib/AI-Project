import express from "express";
import uploadResume from "../middleware/uploadResume.js";
import User from "../models/User.model.js";
import auth from "../middleware/auth.js";
import { extractSkillsAI, cleanSkills } from "../services/ollama.service.js";

import pdf from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();

router.post(
  "/upload-resume",
  auth,

  // ✅ Step 1: check if resume already exists
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (user?.resumeFile?.data) {
        return res.status(400).json({
          message:
            "Resume already uploaded. Delete it before uploading a new one.",
        });
      }

      next();
    } catch (err) {
      console.error("Check error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ Step 2: multer upload
  uploadResume.single("resume"),

  // ✅ Step 3: FULL AI PIPELINE 🔥
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let extractedText = "";

      // 📄 PDF handling
      if (req.file.mimetype === "application/pdf") {
        const data = await pdf(req.file.buffer);
        extractedText = data.text;
      }

      // 📄 DOCX handling
      else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });
        extractedText = result.value;
      }

      // ❌ Unsupported file
      else {
        return res.status(400).json({
          message: "Only PDF and DOCX files are supported",
        });
      }

      // ⚠️ Safety check
      if (!extractedText || extractedText.length < 20) {
        return res.status(400).json({
          message: "Could not extract text from resume",
        });
      }

      // 🤖 STEP 4: Send to Ollama AI
      const rawAI = await extractSkillsAI(extractedText);

      if (!rawAI) {
        return res.status(500).json({
          message: "AI processing failed",
        });
      }

      // 🧹 STEP 5: Clean skills
      const skills = cleanSkills(rawAI);

      // 💾 STEP 6: Save everything
      await User.findByIdAndUpdate(req.user.id, {
        resumeFile: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
        resumeMeta: {
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          uploadedAt: new Date(),
        },
        extractedSkills: skills, // 🔥 AI output stored
      });

      // ✅ FINAL RESPONSE
      res.json({
        message: "Resume uploaded + AI processed successfully 🚀",
        skills,
      });

    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({
        message: err.message || "Upload failed",
      });
    }
  }
);

export default router;