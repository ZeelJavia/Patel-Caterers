// Script to remove preparationTime field from existing menu items
const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const removePreparationTime = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/catering_business", {
      family: 4,
    });
    console.log("Connected to MongoDB");

    // Remove preparationTime field from all menu items
    const result = await MenuItem.updateMany(
      {},
      { $unset: { preparationTime: "" } }
    );

    console.log(`Updated ${result.modifiedCount} menu items`);
    console.log(
      "Successfully removed preparationTime field from all menu items"
    );

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error removing preparationTime:", error);
    process.exit(1);
  }
};

removePreparationTime();
