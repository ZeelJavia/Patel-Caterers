const express = require("express");
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemsByCategory,
  getCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  bulkUpdateAvailability,
} = require("../controllers/menuController");

// Routes
router.get("/", getAllMenuItems);
router.get("/categories", getCategories);
router.get("/search", searchMenuItems);
router.get("/category/:category", getMenuItemsByCategory);
router.get("/:id", getMenuItemById);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.patch("/bulk-availability", bulkUpdateAvailability);

module.exports = router;
