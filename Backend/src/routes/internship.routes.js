const router = require("express").Router();
const { searchInternships } = require("../controllers/internship.controller");

router.post("/search", searchInternships);

module.exports = router;
