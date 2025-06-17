const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  customizations: [
    {
      name: String,
      value: String,
      additionalPrice: {
        type: Number,
        default: 0,
      },
    },
  ],
  specialInstructions: String,
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: function () {
        return this.orderType === "dine-in";
      },
    },
    orderType: {
      type: String,
      enum: ["dine-in", "take-away", "delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "served", "cancelled"],
      default: "pending",
    },
    items: [OrderItemSchema],
    customer: {
      name: String,
      phone: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
    },
    assignedChef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
    },
    assignedWaiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      tax: {
        type: Number,
        default: 0,
        min: 0,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["cash", "card", "digital", "pending"],
        default: "pending",
      },
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      paidAt: Date,
    },
    timing: {
      orderedAt: {
        type: Date,
        default: Date.now,
      },
      acceptedAt: Date,
      startedCookingAt: Date,
      readyAt: Date,
      servedAt: Date,
      estimatedDeliveryTime: Date,
      actualDeliveryTime: Date,
    },
    cookingInstructions: String,
    specialRequests: String,
    rating: {
      food: {
        type: Number,
        min: 1,
        max: 5,
      },
      service: {
        type: Number,
        min: 1,
        max: 5,
      },
      overall: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
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

// Indexes for efficient queries
OrderSchema.index({ restaurant: 1, status: 1 });
OrderSchema.index({ restaurant: 1, orderNumber: 1 });
OrderSchema.index({ table: 1, status: 1 });
OrderSchema.index({ assignedChef: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual for cooking duration
OrderSchema.virtual("cookingDuration").get(function () {
  if (this.timing.startedCookingAt && this.timing.readyAt) {
    return this.timing.readyAt - this.timing.startedCookingAt;
  }
  return null;
});

// Virtual for total duration
OrderSchema.virtual("totalDuration").get(function () {
  if (this.timing.orderedAt && this.timing.servedAt) {
    return this.timing.servedAt - this.timing.orderedAt;
  }
  return null;
});

// Method to calculate total price
OrderSchema.methods.calculateTotal = function () {
  const subtotal = this.items.reduce((total, item) => {
    const itemPrice = item.price * item.quantity;
    const customizationPrice = item.customizations.reduce(
      (sum, custom) => sum + custom.additionalPrice,
      0,
    );
    return total + itemPrice + customizationPrice;
  }, 0);

  this.pricing.subtotal = subtotal;
  this.pricing.total =
    subtotal +
    this.pricing.tax +
    this.pricing.deliveryCharge -
    this.pricing.discount;

  return this.pricing.total;
};

// Method to update status
OrderSchema.methods.updateStatus = function (newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;

  // Update timing based on status
  const now = new Date();
  switch (newStatus) {
    case "processing":
      this.timing.acceptedAt = now;
      break;
    case "ready":
      this.timing.readyAt = now;
      if (!this.timing.startedCookingAt) {
        this.timing.startedCookingAt = this.timing.acceptedAt || now;
      }
      break;
    case "served":
      this.timing.servedAt = now;
      if (this.table) {
        // Free the table if it's a dine-in order
        this.model("Table").findByIdAndUpdate(this.table, {
          status: "available",
          currentOrder: null,
        });
      }
      break;
  }

  return this.save();
};

// Static method to generate order number
OrderSchema.statics.generateOrderNumber = async function () {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lt: new Date(today.setHours(23, 59, 59, 999)),
    },
  });
  return `ORD${dateStr}${(count + 1).toString().padStart(3, "0")}`;
};

// Static method to get today's orders
OrderSchema.statics.getTodaysOrders = function (restaurantId) {
  const today = new Date();
  return this.find({
    restaurant: restaurantId,
    createdAt: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lt: new Date(today.setHours(23, 59, 59, 999)),
    },
  }).populate("table assignedChef items.menuItem");
};

// Static method to get order statistics
OrderSchema.statics.getStats = function (restaurantId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        restaurant: mongoose.Types.ObjectId(restaurantId),
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          status: "$status",
          type: "$orderType",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        count: { $sum: 1 },
        totalRevenue: { $sum: "$pricing.total" },
        avgOrderValue: { $avg: "$pricing.total" },
      },
    },
  ]);
};

module.exports = mongoose.model("Order", OrderSchema);
