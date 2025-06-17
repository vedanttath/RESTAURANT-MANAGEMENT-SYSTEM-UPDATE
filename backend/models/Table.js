const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: function () {
        return `Table ${this.tableNumber}`;
      },
    },
    chairs: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 4,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "occupied", "maintenance"],
      default: "available",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    location: {
      section: {
        type: String,
        default: "main",
      },
      position: {
        x: Number,
        y: Number,
      },
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    reservationDetails: {
      customerName: String,
      customerPhone: String,
      reservationTime: Date,
      partySize: Number,
      specialRequests: String,
    },
    lastCleaned: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
TableSchema.index({ restaurant: 1, status: 1 });
TableSchema.index({ restaurant: 1, tableNumber: 1 });

// Virtual for table display name
TableSchema.virtual("displayName").get(function () {
  return this.name || `Table ${this.tableNumber}`;
});

// Method to check if table is available
TableSchema.methods.isAvailable = function () {
  return this.status === "available" && this.isActive;
};

// Method to reserve table
TableSchema.methods.reserve = function (reservationDetails) {
  this.status = "reserved";
  this.reservationDetails = reservationDetails;
  return this.save();
};

// Method to occupy table
TableSchema.methods.occupy = function (orderId) {
  this.status = "occupied";
  this.currentOrder = orderId;
  return this.save();
};

// Method to free table
TableSchema.methods.free = function () {
  this.status = "available";
  this.currentOrder = null;
  this.reservationDetails = {};
  this.lastCleaned = new Date();
  return this.save();
};

// Static method to get available tables
TableSchema.statics.getAvailable = function (restaurantId) {
  return this.find({
    restaurant: restaurantId,
    status: "available",
    isActive: true,
  });
};

// Static method to get table statistics
TableSchema.statics.getStats = function (restaurantId) {
  return this.aggregate([
    { $match: { restaurant: mongoose.Types.ObjectId(restaurantId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};

module.exports = mongoose.model("Table", TableSchema);
