const express = require("express");
const { registerUser, loginUser, refreshToken, logoutUser } = require("../controllers/authController");
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticateUser, logoutUser);

module.exports = router;
