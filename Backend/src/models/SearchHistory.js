import mongoose from "mongoose";

const SearchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  role: String,
  skills: [String],
  location: String,

  results: [
    {
      title: String,
      company: String,
      location: String,
      url: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SearchHistory", SearchHistorySchema);
