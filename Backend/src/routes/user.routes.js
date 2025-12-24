const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { updateProfile } = require("../controllers/user.controller");

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, updateProfile);

module.exports = router;
