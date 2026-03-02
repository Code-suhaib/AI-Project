import express from "express";
import uploadResume from "../middleware/uploadResume.middleware.js";
import User from "../models/User.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * =====================================================
 * 📌 Upload Resume
 * POST /users/upload-resume
 * =====================================================
 */
router.post(
  "/upload-resume",
  auth,

  // 1️⃣ Check if resume already exists
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
      return res.status(500).json({ message: "Server error" });
    }
  },

  // 2️⃣ Multer Upload
  uploadResume.single("resume"),

  // 3️⃣ Save in MongoDB
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

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
      });

      res.status(200).json({
        message: "Resume uploaded successfully and stored in MongoDB ✅",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/**
 * =====================================================
 * 📌 View Resume
 * GET /users/resume
 * =====================================================
 */
router.get("/resume", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.resumeFile?.data) {
      return res.status(404).json({ message: "No resume found" });
    }

    res.set("Content-Type", user.resumeFile.contentType);
    res.set(
      "Content-Disposition",
      `inline; filename="${user.resumeMeta?.fileName || "resume"}"`
    );

    res.send(user.resumeFile.data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =====================================================
 * 📌 Get Resume Metadata
 * GET /users/resume/meta
 * =====================================================
 */
router.get("/resume/meta", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.resumeMeta) {
      return res.status(404).json({ message: "No resume found" });
    }

    res.json(user.resumeMeta);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =====================================================
 * 📌 Delete Resume
 * DELETE /users/resume
 * =====================================================
 */
router.delete("/resume", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.resumeFile?.data) {
      return res.status(404).json({ message: "No resume to delete" });
    }

    user.resumeFile = undefined;
    user.resumeMeta = undefined;

    await user.save();

    res.json({ message: "Resume deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;