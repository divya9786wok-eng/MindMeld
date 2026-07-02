const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};
const register = async (req, res) => {
  const { email, password, name, age, sex, occupation } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      age,
      sex, 
      occupation,
      Category: [
        { type: "memory", pscore: 0, count: 0 },
        { type: "attention", pscore: 0, count: 0 },
        { type: "focus", pscore: 0, count: 0 },
        { type: "problemSolving", pscore: 0, count: 0 },
      ],
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure default Category values if not set
    if (!user.Category || user.Category.length === 0) {
      user.Category = [
        { type: "memory", pscore: 0, count: 0 },
        { type: "attention", pscore: 0, count: 0 },
        { type: "focus", pscore: 0, count: 0 },
        { type: "problemSolving", pscore: 0, count: 0 },
      ];
      await user.save();  // Save the user after updating the Category
    }

    const token = generateToken(user);
    user._id = null;
    user.password = null;

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
 