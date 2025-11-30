const mongoose = require("mongoose");
const User = require("../models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "" + process.env.MONGODB_URI,
      {
        family: 4, // Use IPv4
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "patelcaterersjnd13@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      console.log("Created:", existingAdmin.createdAt);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "patelcaterersjnd13@gmail.com",
      password: "patel1234", // Will be hashed automatically
      role: "admin",
      isActive: true,
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: patelcaterersjnd13@gmail.com");
    console.log("🔑 Password: patel1234");
    console.log("👤 Role: admin");
    console.log("📅 Created:", adminUser.createdAt);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createAdminUser();
