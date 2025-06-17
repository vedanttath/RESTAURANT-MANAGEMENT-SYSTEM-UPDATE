const express = require("express");
const { body, validationResult } = require("express-validator");
const Table = require("../models/Table");
const router = express.Router();

// Get all tables
router.get("/", async (req, res) => {
  try {
    const { status, section } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    let query = { restaurant: restaurantId, isActive: true };

    if (status) {
      query.status = status;
    }

    if (section) {
      query["location.section"] = section;
    }

    const tables = await Table.find(query)
      .populate("currentOrder")
      .sort({ tableNumber: 1 });

    res.json({
      success: true,
      data: tables,
      count: tables.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tables",
      error: error.message,
    });
  }
});

// Get single table
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate("currentOrder");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.json({
      success: true,
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching table",
      error: error.message,
    });
  }
});

// Create new table
router.post(
  "/",
  [
    body("tableNumber").notEmpty().withMessage("Table number is required"),
    body("chairs")
      .isInt({ min: 1, max: 20 })
      .withMessage("Chairs must be between 1 and 20"),
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

      const { tableNumber, name, chairs, location, restaurantId } = req.body;

      // Check if table number already exists
      const existingTable = await Table.findOne({
        tableNumber,
        restaurant: restaurantId || "default-restaurant",
      });

      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: "Table number already exists",
        });
      }

      const table = new Table({
        tableNumber,
        name: name || `Table ${tableNumber}`,
        chairs,
        location,
        restaurant: restaurantId || "default-restaurant",
      });

      await table.save();

      // Emit real-time update
      req.io.emit("table-created", table);

      res.status(201).json({
        success: true,
        message: "Table created successfully",
        data: table,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating table",
        error: error.message,
      });
    }
  },
);

// Update table
router.put(
  "/:id",
  [
    body("chairs")
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage("Chairs must be between 1 and 20"),
    body("status")
      .optional()
      .isIn(["available", "reserved", "occupied", "maintenance"])
      .withMessage("Invalid status"),
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

      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true },
      );

      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found",
        });
      }

      // Emit real-time update
      req.io.emit("table-updated", table);

      res.json({
        success: true,
        message: "Table updated successfully",
        data: table,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating table",
        error: error.message,
      });
    }
  },
);

// Reserve table
router.put("/:id/reserve", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    if (!table.isAvailable()) {
      return res.status(400).json({
        success: false,
        message: "Table is not available for reservation",
      });
    }

    await table.reserve(req.body.reservationDetails);

    // Emit real-time update
    req.io.emit("table-reserved", table);

    res.json({
      success: true,
      message: "Table reserved successfully",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reserving table",
      error: error.message,
    });
  }
});

// Free table
router.put("/:id/free", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await table.free();

    // Emit real-time update
    req.io.emit("table-freed", table);

    res.json({
      success: true,
      message: "Table freed successfully",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error freeing table",
      error: error.message,
    });
  }
});

// Delete table (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Check if table has active order
    if (table.currentOrder) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete table with active order",
      });
    }

    table.isActive = false;
    await table.save();

    // Emit real-time update
    req.io.emit("table-deleted", { id: table._id });

    res.json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting table",
      error: error.message,
    });
  }
});

// Get table statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const stats = await Table.getStats(restaurantId);
    const availableTables = await Table.getAvailable(restaurantId);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        availableCount: availableTables.length,
        totalTables: await Table.countDocuments({
          restaurant: restaurantId,
          isActive: true,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching table statistics",
      error: error.message,
    });
  }
});

module.exports = router;
