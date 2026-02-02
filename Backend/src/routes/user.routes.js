import express from "express";
import uploadResume from "../middleware/uploadResume.middleware.js";
import User from "../models/User.model.js";
import auth from "../middleware/auth.middleware.js";


const router = express.Router();

/**
 * @route   POST /users/upload-resume
 * @desc    Upload resume (PDF/DOCX) and store in MongoDB
 * @access  Private
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
          message: "Resume already uploaded. Delete it before uploading a new one."
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  // 2️⃣ Multer upload
  uploadResume.single("resume"),

  // 3️⃣ Save resume in MongoDB
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

export default router;
