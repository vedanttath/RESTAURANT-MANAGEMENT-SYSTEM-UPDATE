const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const Chef = require("../models/Chef");
const Table = require("../models/Table");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    const {
      status,
      orderType,
      table,
      chef,
      limit = 50,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    let query = { restaurant: restaurantId, isActive: true };

    if (status) {
      query.status = status;
    }
    if (orderType) {
      query.orderType = orderType;
    }
    if (table) {
      query.table = table;
    }
    if (chef) {
      query.assignedChef = chef;
    }

    const orders = await Order.find(query)
      .populate("table", "tableNumber name")
      .populate("assignedChef", "name position")
      .populate("items.menuItem", "name price")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: orders.length,
        totalDocuments: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("table", "tableNumber name location")
      .populate("assignedChef", "name position currentStatus")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
});

// Create new order
router.post(
  "/",
  [
    body("orderType")
      .isIn(["dine-in", "take-away", "delivery"])
      .withMessage("Invalid order type"),
    body("items").isArray({ min: 1 }).withMessage("At least one item required"),
    body("items.*.menuItem").notEmpty().withMessage("Menu item ID required"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
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

      const {
        orderType,
        table,
        items,
        customer,
        cookingInstructions,
        specialRequests,
        restaurantId,
      } = req.body;

      // Generate order number
      const orderNumber = await Order.generateOrderNumber();

      // Validate menu items and calculate pricing
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!menuItem) {
          return res.status(400).json({
            success: false,
            message: `Menu item ${item.menuItem} not found`,
          });
        }

        if (!menuItem.isCurrentlyAvailable) {
          return res.status(400).json({
            success: false,
            message: `Menu item ${menuItem.name} is not available`,
          });
        }

        const itemPrice = menuItem.currentPrice;
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          menuItem: menuItem._id,
          name: menuItem.name,
          quantity: item.quantity,
          price: itemPrice,
          customizations: item.customizations || [],
          specialInstructions: item.specialInstructions || "",
        });

        // Update menu item popularity
        await menuItem.recordOrder(item.quantity);
      }

      // Calculate tax and total
      const taxRate = 0.1; // 10% tax
      const tax = subtotal * taxRate;
      const deliveryCharge = orderType === "delivery" ? 50 : 0;
      const total = subtotal + tax + deliveryCharge;

      // Create order
      const order = new Order({
        orderNumber,
        restaurant: restaurantId || "default-restaurant",
        table: orderType === "dine-in" ? table : undefined,
        orderType,
        items: processedItems,
        customer,
        pricing: {
          subtotal,
          tax,
          deliveryCharge,
          total,
        },
        cookingInstructions,
        specialRequests,
      });

      await order.save();

      // Update table status if dine-in
      if (orderType === "dine-in" && table) {
        await Table.findByIdAndUpdate(table, {
          status: "occupied",
          currentOrder: order._id,
        });
      }

      // Auto-assign to chef
      try {
        const chef = await Chef.autoAssignOrder(
          restaurantId || "default-restaurant",
          order._id,
        );
        order.assignedChef = chef._id;
        await order.save();
      } catch (chefError) {
        console.log(
          "No available chef for auto-assignment:",
          chefError.message,
        );
      }

      // Populate the response
      await order.populate("table assignedChef items.menuItem");

      // Emit real-time update
      req.io.emit("order-created", order);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  },
);

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldStatus = order.status;
    await order.updateStatus(status);

    // Handle chef workflow
    if (status === "ready" && order.assignedChef) {
      const chef = await Chef.findById(order.assignedChef);
      if (chef) {
        const completionTime =
          order.timing.readyAt - order.timing.startedCookingAt;
        await chef.completeOrder(order._id, completionTime);
      }
    }

    // Emit real-time update
    req.io.emit("order-status-updated", {
      orderId: order._id,
      oldStatus,
      newStatus: status,
      order,
    });

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
});

// Assign chef to order
router.put("/:id/assign-chef", async (req, res) => {
  try {
    const { chefId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    if (!chef.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Chef is not available",
      });
    }

    // Remove from previous chef if assigned
    if (order.assignedChef) {
      const previousChef = await Chef.findById(order.assignedChef);
      if (previousChef) {
        previousChef.currentOrders = previousChef.currentOrders.filter(
          (orderItem) => !orderItem.order.equals(order._id),
        );
        await previousChef.save();
      }
    }

    // Assign to new chef
    await chef.assignOrder(order._id);
    order.assignedChef = chef._id;
    await order.save();

    // Emit real-time update
    req.io.emit("order-chef-assigned", {
      orderId: order._id,
      chefId: chef._id,
      chefName: chef.name,
    });

    res.json({
      success: true,
      message: "Chef assigned successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning chef",
      error: error.message,
    });
  }
});

// Get today's orders
router.get("/today/summary", async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId || "default-restaurant";
    const orders = await Order.getTodaysOrders(restaurantId);

    const summary = {
      total: orders.length,
      byStatus: {},
      byType: {},
      totalRevenue: 0,
      averageOrderValue: 0,
    };

    orders.forEach((order) => {
      // Count by status
      summary.byStatus[order.status] =
        (summary.byStatus[order.status] || 0) + 1;

      // Count by type
      summary.byType[order.orderType] =
        (summary.byType[order.orderType] || 0) + 1;

      // Calculate revenue
      summary.totalRevenue += order.pricing.total;
    });

    summary.averageOrderValue =
      orders.length > 0 ? summary.totalRevenue / orders.length : 0;

    res.json({
      success: true,
      data: {
        orders,
        summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching today's orders",
      error: error.message,
    });
  }
});

// Cancel order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["ready", "served"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is ready or served",
      });
    }

    // Update order status
    order.status = "cancelled";
    order.isActive = false;
    await order.save();

    // Free table if dine-in
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, {
        status: "available",
        currentOrder: null,
      });
    }

    // Remove from chef's queue
    if (order.assignedChef) {
      const chef = await Chef.findById(order.assignedChef);
      if (chef) {
        chef.currentOrders = chef.currentOrders.filter(
          (orderItem) => !orderItem.order.equals(order._id),
        );
        await chef.save();
      }
    }

    // Emit real-time update
    req.io.emit("order-cancelled", {
      orderId: order._id,
      tableId: order.table,
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
});

module.exports = router;
