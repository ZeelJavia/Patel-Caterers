const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  reactivateAdmin,
} = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// All routes require admin authentication
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET /api/admin/users
// @desc    Get all admin users
// @access  Private/Admin
router.get("/users", getAllAdmins);

// @route   POST /api/admin/users
// @desc    Create new admin user
// @access  Private/Admin
router.post("/users", createAdmin);

// @route   DELETE /api/admin/users/:id
// @desc    Delete admin user (soft delete)
// @access  Private/Admin
router.delete("/users/:id", deleteAdmin);

// @route   PUT /api/admin/users/:id/activate
// @desc    Reactivate admin user
// @access  Private/Admin
router.put("/users/:id/activate", reactivateAdmin);

module.exports = router;
