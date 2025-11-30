// Quick test script for MongoDB integration
require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Force IPv4
    });
    console.log("✅ MongoDB connected successfully");

    // Test fetching events
    const events = await Event.find();
    console.log(`✅ Found ${events.length} events in database`);

    if (events.length > 0) {
      console.log("✅ Sample event:", events[0].eventName);
    }

    mongoose.connection.close();
    console.log("✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testConnection();
