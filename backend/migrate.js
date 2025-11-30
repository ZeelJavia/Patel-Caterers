require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Event = require("./models/Event");
const MenuItem = require("./models/MenuItem");
const connectDB = require("./config/database");

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read existing JSON data
    const jsonData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "db.json"), "utf8")
    );

    // Clear existing data (be careful in production!)
    await Event.deleteMany({});
    await MenuItem.deleteMany({});

    console.log("Cleared existing data...");

    // Migrate events
    if (jsonData.events && jsonData.events.length > 0) {
      // Convert _id to MongoDB ObjectId format by removing _id and letting MongoDB auto-generate
      const eventsToInsert = jsonData.events.map((event) => {
        const { _id, ...eventWithoutId } = event;
        return eventWithoutId;
      });

      await Event.insertMany(eventsToInsert);
      console.log(`Migrated ${eventsToInsert.length} events`);
    }

    // Migrate menu items from data.js if available
    try {
      const { menuData } = require("./data.js");
      const menuItems = [];

      // Extract menu items from the menuData structure
      // menuData is an array of category objects
      if (Array.isArray(menuData)) {
        menuData.forEach((categoryObj) => {
          if (categoryObj.items && Array.isArray(categoryObj.items)) {
            categoryObj.items.forEach((item) => {
              menuItems.push({
                category: categoryObj.id,
                categoryName: categoryObj.name,
                categoryNameGujarati: categoryObj.nameGujarati,
                name: item.name,
                nameGujarati: item.nameGujarati,
                originalId: item.id,
                description: item.description || "",
                price: item.price || 0,
                isVeg: item.isVeg !== false, // default to true
                isAvailable: true,
                tags: item.tags || [],
              });
            });
          }
        });
      }

      if (menuItems.length > 0) {
        await MenuItem.insertMany(menuItems);
        console.log(`Migrated ${menuItems.length} menu items`);
      }
    } catch (error) {
      console.log(
        "No menu data found or error reading menu data:",
        error.message
      );
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
migrateData();
