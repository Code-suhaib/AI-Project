const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    url: String,
    source: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
