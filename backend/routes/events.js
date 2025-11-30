const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  generateEventPDF,
  generateCategoryPDF,
  generateBillingPDF,
} = require("../controllers/eventController");

// Routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

// PDF Generation Routes
router.get("/:id/event-pdf", generateEventPDF);
router.get("/:id/category-pdf", generateCategoryPDF);
router.get("/:id/billing-pdf", generateBillingPDF);

module.exports = router;
