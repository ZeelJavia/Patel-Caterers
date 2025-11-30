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

const resetAdminPassword = async () => {
  try {
    await connectDB();

    // Find and update the admin user
    const adminUser = await User.findOne({
      email: "patelcaterersjnd13@gmail.com",
    });

    if (!adminUser) {
      console.log("❌ Admin user not found!");
      process.exit(1);
    }

    console.log("📧 Found admin user:", adminUser.email);

    // Update password (this will trigger the pre-save hook to hash it)
    adminUser.password = "patel1234";
    await adminUser.save();

    console.log("✅ Admin password updated successfully!");
    console.log("📧 Email: patelcaterersjnd13@gmail.com");
    console.log("🔑 Password: patel1234");
    console.log("👤 Role:", adminUser.role);
  } catch (error) {
    console.error("❌ Error updating admin password:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
resetAdminPassword();
