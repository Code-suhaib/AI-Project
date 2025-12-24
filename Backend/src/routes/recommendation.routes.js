const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { recommendInternships } = require("../controllers/recommendation.controller");

router.get("/", protect, recommendInternships);

module.exports = router;
