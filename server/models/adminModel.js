const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ["BAN"], 
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;