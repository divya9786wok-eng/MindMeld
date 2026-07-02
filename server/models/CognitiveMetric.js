const mongoose = require("mongoose");

const CognitiveMetricsSchema = new mongoose.Schema({
  sex: { type: String, required: true, enum: ["Male", "Female"] },
  ageRange: { type: String, required: true },
  metrics: {
    meanAccuracy: { type: Number, required: true },
    stdAccuracy: { type: Number, required: true },
    avgZScoreAccuracy: { type: Number, required: true },
    meanTotalAttempts: { type: Number, required: true },
    stdTotalAttempts: { type: Number, required: true },
    avgZScoreTotalAttempts: { type: Number, required: true },
  },
});

module.exports = mongoose.model("CognitiveMetric", CognitiveMetricsSchema);
