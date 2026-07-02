const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { register, login } = require("./controllers/authController");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000","https://mind-beige.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api", authRoute);
app.use("/api", userRoute);

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
