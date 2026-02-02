import express from "express";
import uploadResume from "../middleware/uploadResume.js";
import User from "../models/User.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload-resume",
  auth,

  // ✅ Step 1: check if resume already exists
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (user.resumeFile?.data) {
        return res.status(400).json({
          message: "Resume already uploaded. Delete it before uploading a new one."
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ Step 2: multer upload
  uploadResume.single("resume"),

  // ✅ Step 3: store in MongoDB
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

      res.json({
        message: "Resume uploaded successfully and stored in MongoDB ✅",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
