const User = require("../models/User.model");

/**
 * @desc   Update user profile
 * @route  PUT /users/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { updateProfile };
