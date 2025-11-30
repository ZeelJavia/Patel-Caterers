const mongoose = require("mongoose");

// Sub-event schema for individual events within a main event
const subEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    pax: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    items: {
      type: Object,
      default: {},
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Main event schema
const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    subEvents: [subEventSchema],
    notes: {
      type: String,
      default: "",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
eventSchema.pre("save", function (next) {
  if (this.subEvents && this.subEvents.length > 0) {
    this.totalAmount = this.subEvents.reduce((total, subEvent) => {
      const pax = parseInt(subEvent.pax) || 0;
      const price = parseFloat(subEvent.price) || 0;
      return total + pax * price;
    }, 0);
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
