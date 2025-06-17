const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
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
    subcategory: {
      type: String,
      trim: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    ingredients: [
      {
        name: String,
        quantity: String,
        isAllergen: {
          type: Boolean,
          default: false,
        },
      },
    ],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number,
    },
    customizations: [
      {
        name: String,
        type: {
          type: String,
          enum: ["select", "checkbox", "radio", "input"],
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [
          {
            name: String,
            additionalPrice: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      availableDays: [
        {
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
      ],
      availableTime: {
        start: String, // HH:MM format
        end: String, // HH:MM format
      },
      outOfStockUntil: Date,
    },
    preparationTime: {
      type: Number,
      default: 15, // minutes
    },
    tags: [String],
    dietaryInfo: {
      isVegetarian: {
        type: Boolean,
        default: false,
      },
      isVegan: {
        type: Boolean,
        default: false,
      },
      isGlutenFree: {
        type: Boolean,
        default: false,
      },
      isSpicy: {
        type: Boolean,
        default: false,
      },
      spiceLevel: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },
    popularity: {
      orderCount: {
        type: Number,
        default: 0,
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
      lastOrdered: Date,
    },
    pricing: {
      costPrice: Number,
      profitMargin: Number,
      discountedPrice: Number,
      discountValidUntil: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
MenuItemSchema.index({ restaurant: 1, category: 1 });
MenuItemSchema.index({ restaurant: 1, isActive: 1 });
MenuItemSchema.index({ "availability.isAvailable": 1 });
MenuItemSchema.index({ name: "text", description: "text" });

// Virtual for current price (considering discounts)
MenuItemSchema.virtual("currentPrice").get(function () {
  if (
    this.pricing.discountedPrice &&
    this.pricing.discountValidUntil &&
    new Date() < this.pricing.discountValidUntil
  ) {
    return this.pricing.discountedPrice;
  }
  return this.price;
});

// Virtual for availability status
MenuItemSchema.virtual("isCurrentlyAvailable").get(function () {
  if (!this.availability.isAvailable || !this.isActive) {
    return false;
  }

  // Check if out of stock
  if (
    this.availability.outOfStockUntil &&
    new Date() < this.availability.outOfStockUntil
  ) {
    return false;
  }

  // Check day availability
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  if (
    this.availability.availableDays.length > 0 &&
    !this.availability.availableDays.includes(today)
  ) {
    return false;
  }

  // Check time availability
  if (
    this.availability.availableTime.start &&
    this.availability.availableTime.end
  ) {
    const now = new Date().toTimeString().slice(0, 5);
    if (
      now < this.availability.availableTime.start ||
      now > this.availability.availableTime.end
    ) {
      return false;
    }
  }

  return true;
});

// Method to update popularity when ordered
MenuItemSchema.methods.recordOrder = function (quantity = 1) {
  this.popularity.orderCount += quantity;
  this.popularity.lastOrdered = new Date();
  return this.save();
};

// Method to update rating
MenuItemSchema.methods.updateRating = function (newRating) {
  const currentTotal =
    this.popularity.rating.average * this.popularity.rating.count;
  this.popularity.rating.count += 1;
  this.popularity.rating.average =
    (currentTotal + newRating) / this.popularity.rating.count;
  return this.save();
};

// Static method to get popular items
MenuItemSchema.statics.getPopular = function (restaurantId, limit = 10) {
  return this.find({
    restaurant: restaurantId,
    isActive: true,
    "availability.isAvailable": true,
  })
    .sort({ "popularity.orderCount": -1 })
    .limit(limit);
};

// Static method to get items by category
MenuItemSchema.statics.getByCategory = function (restaurantId, category) {
  return this.find({
    restaurant: restaurantId,
    category: category,
    isActive: true,
    "availability.isAvailable": true,
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to search items
MenuItemSchema.statics.search = function (restaurantId, query) {
  return this.find({
    restaurant: restaurantId,
    isActive: true,
    "availability.isAvailable": true,
    $text: { $search: query },
  }).sort({ score: { $meta: "textScore" } });
};

// Pre-save middleware to ensure only one primary image
MenuItemSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach((image, index) => {
      if (image.isPrimary) {
        primaryCount++;
        if (primaryCount > 1) {
          this.images[index].isPrimary = false;
        }
      }
    });

    // If no primary image, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
