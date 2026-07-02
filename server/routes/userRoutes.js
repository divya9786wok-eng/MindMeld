// backend/routes/authRoutes.js
const express = require("express");
const { cogni } = require("../controllers/userController");
const middleware = require("../middlewares");
const router = express.Router();

router.post("/cognitive-metrics",middleware,cogni);
 
module.exports = router;
