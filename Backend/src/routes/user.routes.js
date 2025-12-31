import express from "express";

const router = express.Router();

// example route (adjust if you already have controllers)
router.get("/", (req, res) => {
  res.json({ message: "User route working ✅" });
});

export default router;
