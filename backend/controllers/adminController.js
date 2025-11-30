const User = require("../models/User");

// @desc    Get all admin users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin", isActive: true })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      admins,
      count: admins.length,
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
    });
  }
};

// @desc    Create new admin user
// @route   POST /api/admin/users
// @access  Private/Admin
const createAdmin = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Generate username from email if not provided
    const adminUsername = username || email.split("@")[0];

    // Check if username is taken
    const existingUsername = await User.findOne({ username: adminUsername });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create new admin
    const newAdmin = new User({
      username: adminUsername,
      email,
      password, // Will be hashed automatically by pre-save middleware
      role: "admin",
      isActive: true,
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating admin",
    });
  }
};

// @desc    Delete admin user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    // Check if admin exists
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Soft delete by setting isActive to false
    admin.isActive = false;
    await admin.save();

    res.json({
      success: true,
      message: "Admin user deactivated successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting admin",
    });
  }
};

// @desc    Reactivate admin user
// @route   PUT /api/admin/users/:id/activate
// @access  Private/Admin
const reactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.isActive = true;
    await admin.save();

    res.json({
      success: true,
      message: "Admin user reactivated successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Reactivate admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while reactivating admin",
    });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  reactivateAdmin,
};
