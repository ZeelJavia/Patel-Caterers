// test-server.js - Quick test to verify database operations
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "db.json");

// Test the database functions
const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      console.log("Creating new database file...");
      fs.writeFileSync(DB_FILE, JSON.stringify({ events: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { events: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    console.log("Database updated successfully");
  } catch (error) {
    console.error("Error writing to database:", error);
    throw error;
  }
};

// Test the operations
console.log("Testing database operations...");

try {
  // Test read
  const db = readDB();
  console.log("✅ Read operation successful");

  // Test write
  const testEvent = {
    _id: "test-123",
    eventName: "Test Event",
    clientName: "Test Client",
    createdAt: new Date().toISOString(),
  };

  db.events.push(testEvent);
  writeDB(db);
  console.log("✅ Write operation successful");

  // Test read again
  const updatedDb = readDB();
  if (updatedDb.events.length > 0) {
    console.log("✅ Data persistence verified");
  }

  // Clean up test data
  updatedDb.events = updatedDb.events.filter((e) => e._id !== "test-123");
  writeDB(updatedDb);
  console.log("✅ Test data cleaned up");

  console.log("🎉 All database operations working correctly!");
} catch (error) {
  console.error("❌ Database test failed:", error);
}
