// scripts/migrateMenuItems.js - Migration script to populate database with menu items

const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const { menuData } = require("../data");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect("" + process.env.MONGODB_URI, {
      family: 4,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const migrateMenuItems = async () => {
  try {
    console.log("🔄 Starting menu items migration...");

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log("🧹 Cleared existing menu items");

    let totalItems = 0;
    const categoryCount = {};

    // Process each category from data.js
    for (const category of menuData) {
      console.log(
        `\n📂 Processing category: ${category.name} (${category.id})`
      );
      categoryCount[category.id] = 0;

      // Process each item in the category
      for (const item of category.items) {
        const menuItem = new MenuItem({
          name: item.name,
          nameGujarati: item.nameGujarati || "",
          category: category.id,
          categoryName: category.name,
          categoryNameGujarati: category.nameGujarati || "",
          price: 0, // Default price - can be updated later in admin panel
          isVeg: true, // Default to vegetarian - can be updated later
          isAvailable: true,
          description: item.nameGujarati || "",
          preparationTime: 30, // Default prep time
          tags: [category.id.replace("-", " ")],
          originalId: item.id,
        });

        await menuItem.save();
        categoryCount[category.id]++;
        totalItems++;
      }

      console.log(
        `✅ Added ${categoryCount[category.id]} items to ${category.name}`
      );
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log(`📊 Total items migrated: ${totalItems}`);
    console.log("\n📈 Category breakdown:");

    for (const [categoryId, count] of Object.entries(categoryCount)) {
      const categoryName =
        menuData.find((cat) => cat.id === categoryId)?.name || categoryId;
      console.log(`   ${categoryName}: ${count} items`);
    }

    console.log("\n💡 Next steps:");
    console.log("   - Use the Menu Management interface to update prices");
    console.log("   - Set vegetarian/non-vegetarian preferences");
    console.log("   - Add descriptions and preparation times");
    console.log("   - Organize items by availability");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateMenuItems();
  process.exit(0);
};

runMigration();
