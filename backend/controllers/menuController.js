const MenuItem = require("../models/MenuItem");

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isAvailable: true }).sort({
      category: 1,
      name: 1,
    });
    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuItem.find({
      category: category,
      isAvailable: true,
    }).sort({ name: 1 });
    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json({ categories: categories.sort() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new menu item
const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete menu item (soft delete by setting isAvailable to false)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search menu items
const searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;
    const menuItems = await MenuItem.find({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { tags: { $in: [new RegExp(q, "i")] } },
          ],
        },
      ],
    }).sort({ name: 1 });

    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk update menu items availability
const bulkUpdateAvailability = async (req, res) => {
  try {
    const { itemIds, isAvailable } = req.body;

    const result = await MenuItem.updateMany(
      { _id: { $in: itemIds } },
      { isAvailable }
    );

    res.json({
      message: `Updated ${result.modifiedCount} menu items`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemsByCategory,
  getCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  bulkUpdateAvailability,
};
