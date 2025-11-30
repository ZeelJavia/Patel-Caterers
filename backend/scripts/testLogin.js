const mongoose = require("mongoose");
const User = require("../models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://127.0.0.1:27017/patel_caterers",
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

const testLogin = async () => {
  try {
    await connectDB();

    const email = "patelcaterersjnd13@gmail.com";
    const password = "patel1234";

    console.log("🔍 Testing login process...");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    // Step 1: Find user
    const user = await User.findOne({ email, isActive: true });
    console.log("👤 User found:", !!user);

    if (user) {
      console.log("📊 User details:");
      console.log("   - ID:", user._id);
      console.log("   - Email:", user.email);
      console.log("   - Username:", user.username);
      console.log("   - Role:", user.role);
      console.log("   - Active:", user.isActive);
      console.log("   - Password hash length:", user.password?.length);

      // Step 2: Test password comparison
      const isPasswordValid = await user.comparePassword(password);
      console.log("🔐 Password valid:", isPasswordValid);

      if (isPasswordValid) {
        console.log("✅ Login should succeed");
      } else {
        console.log("❌ Password comparison failed");
      }
    } else {
      console.log("❌ User not found");
    }
  } catch (error) {
    console.error("❌ Test error:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
testLogin();
