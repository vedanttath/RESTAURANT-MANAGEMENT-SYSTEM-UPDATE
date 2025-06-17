const mongoose = require("mongoose");

const ChefSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    position: {
      type: String,
      enum: ["head-chef", "sous-chef", "line-cook", "prep-cook", "pastry-chef"],
      default: "line-cook",
    },
    specialties: [
      {
        type: String,
        enum: [
          "burger",
          "pizza",
          "drink",
          "fries",
          "veggies",
          "dessert",
          "other",
        ],
      },
    ],
    shift: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night", "full-time"],
      default: "full-time",
    },
    workSchedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: String, // HH:MM format
        endTime: String, // HH:MM format
        isWorking: {
          type: Boolean,
          default: true,
        },
      },
    ],
    currentStatus: {
      type: String,
      enum: ["available", "busy", "on-break", "off-duty"],
      default: "available",
    },
    performance: {
      ordersCompleted: {
        type: Number,
        default: 0,
      },
      averageCompletionTime: {
        type: Number,
        default: 0, // in minutes
      },
      rating: {
        average: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      totalWorkingHours: {
        type: Number,
        default: 0,
      },
    },
    currentOrders: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high", "urgent"],
          default: "medium",
        },
      },
    ],
    maxConcurrentOrders: {
      type: Number,
      default: 3,
    },
    experience: {
      yearsOfExperience: Number,
      previousPositions: [
        {
          restaurant: String,
          position: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      certifications: [
        {
          name: String,
          issuedBy: String,
          issuedDate: Date,
          expiryDate: Date,
        },
      ],
    },
    contactInfo: {
      emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    },
    employmentDetails: {
      hireDate: {
        type: Date,
        default: Date.now,
      },
      salary: Number,
      paymentFrequency: {
        type: String,
        enum: ["hourly", "daily", "weekly", "monthly"],
        default: "monthly",
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    avatar: {
      url: String,
      alt: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
ChefSchema.index({ restaurant: 1, currentStatus: 1 });
ChefSchema.index({ restaurant: 1, "employmentDetails.isActive": 1 });
ChefSchema.index({ email: 1 });

// Virtual for current workload
ChefSchema.virtual("currentWorkload").get(function () {
  return this.currentOrders.length;
});

// Virtual for availability
ChefSchema.virtual("isAvailable").get(function () {
  return (
    this.currentStatus === "available" &&
    this.currentOrders.length < this.maxConcurrentOrders &&
    this.employmentDetails.isActive
  );
});

// Virtual for full name display
ChefSchema.virtual("displayName").get(function () {
  return `${this.name} (${this.position})`;
});

// Method to assign order
ChefSchema.methods.assignOrder = function (orderId, priority = "medium") {
  if (this.currentOrders.length >= this.maxConcurrentOrders) {
    throw new Error("Chef is at maximum capacity");
  }

  this.currentOrders.push({
    order: orderId,
    assignedAt: new Date(),
    priority: priority,
  });

  if (this.currentOrders.length >= this.maxConcurrentOrders) {
    this.currentStatus = "busy";
  }

  return this.save();
};

// Method to complete order
ChefSchema.methods.completeOrder = function (orderId, completionTime) {
  this.currentOrders = this.currentOrders.filter(
    (orderItem) => !orderItem.order.equals(orderId),
  );

  // Update performance metrics
  this.performance.ordersCompleted += 1;

  if (completionTime) {
    const totalTime =
      this.performance.averageCompletionTime * this.performance.ordersCompleted;
    this.performance.averageCompletionTime =
      (totalTime + completionTime) / this.performance.ordersCompleted;
  }

  // Update status if no longer at capacity
  if (
    this.currentOrders.length < this.maxConcurrentOrders &&
    this.currentStatus === "busy"
  ) {
    this.currentStatus = "available";
  }

  return this.save();
};

// Method to update rating
ChefSchema.methods.updateRating = function (newRating) {
  const currentTotal =
    this.performance.rating.average * this.performance.rating.count;
  this.performance.rating.count += 1;
  this.performance.rating.average =
    (currentTotal + newRating) / this.performance.rating.count;
  return this.save();
};

// Method to check if working today
ChefSchema.methods.isWorkingToday = function () {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = this.workSchedule.find((day) => day.day === today);
  return todaySchedule ? todaySchedule.isWorking : false;
};

// Method to get current shift
ChefSchema.methods.getCurrentShift = function () {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return this.workSchedule.find((day) => day.day === today);
};

// Static method to get available chefs
ChefSchema.statics.getAvailable = function (restaurantId, specialty = null) {
  const query = {
    restaurant: restaurantId,
    currentStatus: "available",
    "employmentDetails.isActive": true,
  };

  if (specialty) {
    query.specialties = specialty;
  }

  return this.find(query).sort({
    "performance.rating.average": -1,
    currentWorkload: 1,
  });
};

// Static method to get chef performance stats
ChefSchema.statics.getPerformanceStats = function (
  restaurantId,
  startDate,
  endDate,
) {
  return this.aggregate([
    {
      $match: {
        restaurant: mongoose.Types.ObjectId(restaurantId),
        "employmentDetails.isActive": true,
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "assignedChef",
        as: "orders",
      },
    },
    {
      $addFields: {
        ordersInPeriod: {
          $filter: {
            input: "$orders",
            cond: {
              $and: [
                { $gte: ["$$this.createdAt", new Date(startDate)] },
                { $lte: ["$$this.createdAt", new Date(endDate)] },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        position: 1,
        "performance.rating": 1,
        ordersCompletedInPeriod: { $size: "$ordersInPeriod" },
        totalOrdersCompleted: "$performance.ordersCompleted",
        averageCompletionTime: "$performance.averageCompletionTime",
      },
    },
  ]);
};

// Static method to auto-assign order to best available chef
ChefSchema.statics.autoAssignOrder = async function (
  restaurantId,
  orderId,
  specialty = null,
) {
  const availableChefs = await this.getAvailable(restaurantId, specialty);

  if (availableChefs.length === 0) {
    throw new Error("No available chefs found");
  }

  // Select chef with best rating and lowest workload
  const bestChef = availableChefs[0];
  await bestChef.assignOrder(orderId);

  return bestChef;
};

module.exports = mongoose.model("Chef", ChefSchema);
