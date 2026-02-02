import multer from "multer";

// Store file in memory (S3 / AI ready)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF and DOCX files are allowed"));
  }

  cb(null, true);
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

export default uploadResume;
