const express = require("express");
const router = express.Router();
// 1. ADD THIS LINE
const User = require("../models/User");

const {
  loginUser,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

// @route   POST /api/auth/login
router.post("/login", loginUser);

// @route   GET /api/auth/me
router.get("/me", authMiddleware, getCurrentUser);

// @route   POST /api/auth/logout
router.post("/logout", authMiddleware, logoutUser);

// ==========================================
// 2. ADD THIS EMERGENCY ROUTE BLOCK
// ==========================================
router.get("/emergency-create", async (req, res) => {
  try {
    // Check if temp admin already exists to prevent duplicates
    let user = await User.findOne({ email: "temp@admin.com" });
    if (user) {
      return res
        .status(400)
        .json({ msg: "Temp user already exists. Try logging in." });
    }

    // Create the user
    user = new User({
      username: "TempAdmin",
      email: "temp@admin.com",
      password: "password123", // This will be encrypted automatically
      role: "admin",
      isActive: true,
    });

    await user.save();

    res.json({
      success: true,
      message: "✅ User created successfully!",
      login_details: {
        email: "temp@admin.com",
        password: "password123",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ==========================================

module.exports = router;
