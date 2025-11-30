const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "patel_caterers_secret_key_2024";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    console.log("🔍 Auth Header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid auth header format");
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log("🔍 Token (first 20 chars):", token.substring(0, 20) + "...");

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decoded successfully, userId:", decoded.userId);

    // Get user from database
    const user = await User.findById(decoded.userId);
    console.log(
      "🔍 User found:",
      user ? `${user.email} (${user.role})` : "Not found"
    );

    if (!user || !user.isActive) {
      console.log("❌ User not found or inactive");
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    // Add user to request
    req.user = { userId: user._id, role: user.role };
    console.log("✅ Auth successful for:", user.email);
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
