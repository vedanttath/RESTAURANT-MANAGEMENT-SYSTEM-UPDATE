const express = require("express");
const { body, validationResult } = require("express-validator");
const Chef = require("../models/Chef");
const router = express.Router();

// Get all chefs
router.get("/", async (req, res) => {
  try {
    const { status, specialty, shift } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    let query = {
      restaurant: restaurantId,
      "employmentDetails.isActive": true,
    };

    if (status) {
      query.currentStatus = status;
    }

    if (specialty) {
      query.specialties = specialty;
    }

    if (shift) {
      query.shift = shift;
    }

    const chefs = await Chef.find(query)
      .populate("currentOrders.order", "orderNumber status items")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: chefs,
      count: chefs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chefs",
      error: error.message,
    });
  }
});

// Get single chef
router.get("/:id", async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).populate(
      "currentOrders.order",
    );

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    res.json({
      success: true,
      data: chef,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chef",
      error: error.message,
    });
  }
});

// Create new chef
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("position")
      .isIn(["head-chef", "sous-chef", "line-cook", "prep-cook", "pastry-chef"])
      .withMessage("Invalid position"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const chef = new Chef({
        ...req.body,
        restaurant: req.body.restaurantId || "default-restaurant",
      });

      await chef.save();

      res.status(201).json({
        success: true,
        message: "Chef created successfully",
        data: chef,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Error creating chef",
        error: error.message,
      });
    }
  },
);

// Update chef
router.put("/:id", async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    res.json({
      success: true,
      message: "Chef updated successfully",
      data: chef,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating chef",
      error: error.message,
    });
  }
});

// Update chef status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const chef = await Chef.findByIdAndUpdate(
      req.params.id,
      { currentStatus: status },
      { new: true },
    );

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    res.json({
      success: true,
      message: "Chef status updated successfully",
      data: chef,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating chef status",
      error: error.message,
    });
  }
});

// Get available chefs
router.get("/available/list", async (req, res) => {
  try {
    const { specialty } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const chefs = await Chef.getAvailable(restaurantId, specialty);

    res.json({
      success: true,
      data: chefs,
      count: chefs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching available chefs",
      error: error.message,
    });
  }
});

// Get chef performance statistics
router.get("/stats/performance", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const stats = await Chef.getPerformanceStats(
      restaurantId,
      startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate || new Date(),
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chef performance statistics",
      error: error.message,
    });
  }
});

// Seed chef data for demo
router.post("/seed", async (req, res) => {
  try {
    const restaurantId = req.body.restaurantId || "default-restaurant";

    // Clear existing chefs
    await Chef.deleteMany({ restaurant: restaurantId });

    const chefs = [
      {
        name: "Manesh Kumar",
        email: "manesh@restaurant.com",
        phone: "+1234567890",
        restaurant: restaurantId,
        position: "head-chef",
        specialties: ["burger", "pizza"],
        shift: "full-time",
        performance: {
          ordersCompleted: 245,
          averageCompletionTime: 18,
          rating: { average: 4.8, count: 95 },
        },
        maxConcurrentOrders: 5,
      },
      {
        name: "Pritam Singh",
        email: "pritam@restaurant.com",
        phone: "+1234567891",
        restaurant: restaurantId,
        position: "sous-chef",
        specialties: ["pizza", "veggies"],
        shift: "morning",
        performance: {
          ordersCompleted: 180,
          averageCompletionTime: 22,
          rating: { average: 4.6, count: 72 },
        },
        maxConcurrentOrders: 4,
      },
      {
        name: "Yash Patel",
        email: "yash@restaurant.com",
        phone: "+1234567892",
        restaurant: restaurantId,
        position: "line-cook",
        specialties: ["burger", "fries"],
        shift: "afternoon",
        performance: {
          ordersCompleted: 156,
          averageCompletionTime: 15,
          rating: { average: 4.4, count: 64 },
        },
        maxConcurrentOrders: 3,
      },
      {
        name: "Tenzen Norbu",
        email: "tenzen@restaurant.com",
        phone: "+1234567893",
        restaurant: restaurantId,
        position: "line-cook",
        specialties: ["drink", "veggies"],
        shift: "evening",
        performance: {
          ordersCompleted: 201,
          averageCompletionTime: 12,
          rating: { average: 4.7, count: 88 },
        },
        maxConcurrentOrders: 3,
      },
    ];

    const createdChefs = await Chef.insertMany(chefs);

    res.status(201).json({
      success: true,
      message: "Chefs seeded successfully",
      data: createdChefs,
      count: createdChefs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error seeding chefs",
      error: error.message,
    });
  }
});

// Delete chef (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    // Check if chef has active orders
    if (chef.currentOrders.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete chef with active orders",
      });
    }

    chef.employmentDetails.isActive = false;
    await chef.save();

    res.json({
      success: true,
      message: "Chef deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting chef",
      error: error.message,
    });
  }
});

module.exports = router;
