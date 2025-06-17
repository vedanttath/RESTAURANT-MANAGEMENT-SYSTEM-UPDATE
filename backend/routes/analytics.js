const express = require("express");
const Order = require("../models/Order");
const Table = require("../models/Table");
const Chef = require("../models/Chef");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// Get dashboard analytics
router.get("/dashboard", async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId || "default-restaurant";
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Parallel queries for better performance
    const [
      totalChefs,
      totalTables,
      todayOrders,
      todayRevenue,
      tableStats,
      orderStats,
      chefStats,
      weeklyRevenue,
    ] = await Promise.all([
      // Total active chefs
      Chef.countDocuments({
        restaurant: restaurantId,
        "employmentDetails.isActive": true,
      }),

      // Total active tables
      Table.countDocuments({
        restaurant: restaurantId,
        isActive: true,
      }),

      // Today's orders
      Order.find({
        restaurant: restaurantId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }),

      // Today's revenue
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$pricing.total" },
          },
        },
      ]),

      // Table statistics
      Table.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            isActive: true,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Order statistics by type and status
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: {
              status: "$status",
              type: "$orderType",
            },
            count: { $sum: 1 },
          },
        },
      ]),

      // Chef performance for today
      Chef.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            "employmentDetails.isActive": true,
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "assignedChef",
            as: "todayOrders",
            pipeline: [
              {
                $match: {
                  createdAt: { $gte: startOfDay, $lte: endOfDay },
                },
              },
            ],
          },
        },
        {
          $project: {
            name: 1,
            position: 1,
            ordersToday: { $size: "$todayOrders" },
            totalOrders: "$performance.ordersCompleted",
            rating: "$performance.rating.average",
          },
        },
      ]),

      // Weekly revenue
      Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              $lte: new Date(),
            },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: {
              $dayOfWeek: "$createdAt",
            },
            revenue: { $sum: "$pricing.total" },
            orders: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
    ]);

    // Process data for frontend
    const metrics = {
      totalChefs,
      totalRevenue: todayRevenue[0]?.total || 0,
      totalOrders: todayOrders.length,
      totalClients: todayOrders.filter((order) => order.customer?.name).length,
    };

    // Process order summary for donut chart
    const orderSummary = {
      dineIn: 0,
      takeAway: 0,
      delivery: 0,
    };

    orderStats.forEach((stat) => {
      switch (stat._id.type) {
        case "dine-in":
          orderSummary.dineIn += stat.count;
          break;
        case "take-away":
          orderSummary.takeAway += stat.count;
          break;
        case "delivery":
          orderSummary.delivery += stat.count;
          break;
      }
    });

    // Process table calendar data
    const tableCalendar = {};
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      tableCalendar[day] = {
        date: day,
        day: dayName,
        status: Math.random() > 0.3 ? "reserved" : "available", // Demo data
      };
    }

    // Process weekly revenue for chart
    const weeklyRevenueChart = [
      { day: "Mon", revenue: 0 },
      { day: "Tue", revenue: 0 },
      { day: "Wed", revenue: 0 },
      { day: "Thu", revenue: 0 },
      { day: "Fri", revenue: 0 },
      { day: "Sat", revenue: 0 },
      { day: "Sun", revenue: 0 },
    ];

    weeklyRevenue.forEach((item) => {
      const dayIndex = item._id === 1 ? 6 : item._id - 2; // Convert MongoDB day to array index
      if (dayIndex >= 0 && dayIndex < 7) {
        weeklyRevenueChart[dayIndex].revenue = item.revenue;
      }
    });

    res.json({
      success: true,
      data: {
        metrics,
        orderSummary,
        tableCalendar,
        weeklyRevenue: weeklyRevenueChart,
        chefPerformance: chefStats,
        tableStats,
        todayOrdersDetail: todayOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard analytics",
      error: error.message,
    });
  }
});

// Get revenue analytics
router.get("/revenue", async (req, res) => {
  try {
    const { period = "week", startDate, endDate } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    let dateRange = {};
    const now = new Date();

    switch (period) {
      case "today":
        dateRange = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999)),
        };
        break;
      case "week":
        dateRange = {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          $lte: new Date(),
        };
        break;
      case "month":
        dateRange = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        };
        break;
      case "custom":
        if (startDate && endDate) {
          dateRange = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
        }
        break;
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          createdAt: dateRange,
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orderType: "$orderType",
          },
          revenue: { $sum: "$pricing.total" },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: "$pricing.total" },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    res.json({
      success: true,
      data: revenueData,
      period,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching revenue analytics",
      error: error.message,
    });
  }
});

// Get popular menu items
router.get("/popular-items", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const popularItems = await MenuItem.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          isActive: true,
        },
      },
      {
        $sort: {
          "popularity.orderCount": -1,
          "popularity.rating.average": -1,
        },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          name: 1,
          category: 1,
          price: 1,
          orderCount: "$popularity.orderCount",
          rating: "$popularity.rating.average",
          lastOrdered: "$popularity.lastOrdered",
        },
      },
    ]);

    res.json({
      success: true,
      data: popularItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching popular items",
      error: error.message,
    });
  }
});

// Get order trends
router.get("/order-trends", async (req, res) => {
  try {
    const { period = "week" } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const trends = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            hour: { $hour: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$pricing.total" },
        },
      },
      {
        $group: {
          _id: "$_id.hour",
          avgOrders: { $avg: "$orders" },
          avgRevenue: { $avg: "$revenue" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order trends",
      error: error.message,
    });
  }
});

// Get customer analytics
router.get("/customers", async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const customerStats = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          "customer.phone": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$customer.phone",
          name: { $first: "$customer.name" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$pricing.total" },
          avgOrderValue: { $avg: "$pricing.total" },
          lastOrder: { $max: "$createdAt" },
          favoriteType: { $addToSet: "$orderType" },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: 50,
      },
    ]);

    const newCustomers = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: "$customer.phone",
          firstOrder: { $min: "$createdAt" },
        },
      },
      {
        $match: {
          firstOrder: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $count: "newCustomers",
      },
    ]);

    res.json({
      success: true,
      data: {
        topCustomers: customerStats,
        newCustomersThisMonth: newCustomers[0]?.newCustomers || 0,
        totalCustomers: customerStats.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching customer analytics",
      error: error.message,
    });
  }
});

module.exports = router;
