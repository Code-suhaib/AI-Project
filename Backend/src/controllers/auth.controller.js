const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/**
 * @desc   Register new user
 * @route  POST /auth/register
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password"
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 5. Send response
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  registerUser
};
