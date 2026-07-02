const CognitiveMetric = require("../models/CognitiveMetric");
const User = require("../models/userModel");  // Ensure User model is imported

const cogni = async (req, res) => {
  const { sex, age, userScore, gameId, userCategory } = req.body.userDetails;

  // Determine age range
  let ageRange = "";
  if (age >= 18 && age <= 24) ageRange = "18-24";
  else if (age >= 25 && age <= 34) ageRange = "25-34";
  else if (age >= 35 && age <= 44) ageRange = "35-44";
  else if (age >= 45 && age <= 54) ageRange = "45-54";

  try {
    // Fetch the cognitive metric for the given game, age, and sex
    const metric = await CognitiveMetric.findOne({
      sex,
      ageRange,
      gameId,
    });

    // If no metric is found, return an error response
    if (!metric) {
      return res.status(404).json({ error: "Metrics not found for the given criteria." });
    }

    // Calculate the zScore for the user’s performance
    const zScore = (userScore - metric.metrics.meanAccuracy) / metric.metrics.stdAccuracy;
    // Get the current user by email (assuming req.user contains the email)
    const user = await User.findOne({ email: req.user.email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the userCategory exists and is valid
    if (!user.Category ) {
      return res.status(400).json({ error: "Category not found in user data." });
    }


    // Find the relevant category from the user's categories
    const category = user.Category.find(cat => cat.type === userCategory);

    // If category not found, return an error
    if (!category) {
      return res.status(400).json({ error: "Category not found in user's categories." });
    }

    // Calculate the new score for the category
    const newScore = (userScore + category.count * category.pscore) / (category.count + 1);

    // Update the category with the new score and increment the count
    category.pscore = newScore;
    category.count = category.count + 1;

    // Save the updated user document
    await user.save();

    // Remove sensitive information before returning user data
    user.password = null;
    user._id = null;

    // Send the updated category, zScore, and user data to the frontend
    res.status(200).json({
      ageRange,
      metrics: metric.metrics,
      userZScore: zScore.toFixed(2),
      user,
    });
  } catch (err) {
    console.error("Error:", err);  // Log error for debugging
    res.status(500).json({ error: "Error fetching metrics." });
  }
};

module.exports = { cogni };
