const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const Chef = require("../models/Chef");
const Table = require("../models/Table");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    const restaurantId = "default-restaurant";

    // Clear existing data
    await MenuItem.deleteMany({ restaurant: restaurantId });
    await Chef.deleteMany({ restaurant: restaurantId });
    await Table.deleteMany({ restaurant: restaurantId });

    console.log("Cleared existing data");

    // Seed Menu Items
    const menuItems = [
      // Burgers
      {
        name: "Classic Beef Burger",
        description: "Juicy beef patty with lettuce, tomato, onion, and cheese",
        price: 250,
        category: "burger",
        restaurant: restaurantId,
        ingredients: [
          { name: "Beef Patty", quantity: "150g" },
          { name: "Cheese", quantity: "1 slice" },
          { name: "Lettuce", quantity: "2 leaves" },
          { name: "Tomato", quantity: "2 slices" },
        ],
        preparationTime: 12,
        dietaryInfo: { isSpicy: false, spiceLevel: 0 },
        popularity: { orderCount: 45, rating: { average: 4.5, count: 20 } },
      },
      {
        name: "Chicken Deluxe Burger",
        description: "Grilled chicken breast with special sauce and vegetables",
        price: 220,
        category: "burger",
        restaurant: restaurantId,
        preparationTime: 10,
        dietaryInfo: { isSpicy: false, spiceLevel: 1 },
        popularity: { orderCount: 38, rating: { average: 4.3, count: 18 } },
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables",
        price: 200,
        category: "burger",
        restaurant: restaurantId,
        preparationTime: 8,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 22, rating: { average: 4.2, count: 12 } },
      },
      {
        name: "BBQ Bacon Burger",
        description: "Beef patty with crispy bacon and BBQ sauce",
        price: 280,
        category: "burger",
        restaurant: restaurantId,
        preparationTime: 15,
        dietaryInfo: { isSpicy: false, spiceLevel: 1 },
        popularity: { orderCount: 33, rating: { average: 4.6, count: 15 } },
      },

      // Pizzas
      {
        name: "Margherita",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 180,
        category: "pizza",
        restaurant: restaurantId,
        preparationTime: 18,
        dietaryInfo: { isVegetarian: true },
        popularity: { orderCount: 67, rating: { average: 4.7, count: 30 } },
      },
      {
        name: "Pepperoni",
        description: "Pizza topped with pepperoni and cheese",
        price: 220,
        category: "pizza",
        restaurant: restaurantId,
        preparationTime: 20,
        popularity: { orderCount: 56, rating: { average: 4.4, count: 25 } },
      },
      {
        name: "Vegetarian Supreme",
        description: "Loaded with bell peppers, mushrooms, olives, and onions",
        price: 200,
        category: "pizza",
        restaurant: restaurantId,
        preparationTime: 22,
        dietaryInfo: { isVegetarian: true },
        popularity: { orderCount: 41, rating: { average: 4.3, count: 19 } },
      },
      {
        name: "Marinara",
        description: "Classic marinara pizza with herbs",
        price: 160,
        category: "pizza",
        restaurant: restaurantId,
        preparationTime: 16,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 29, rating: { average: 4.1, count: 14 } },
      },

      // Drinks
      {
        name: "Coca Cola",
        description: "Classic refreshing cola drink",
        price: 60,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 2,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 89, rating: { average: 4.2, count: 40 } },
      },
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 80,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 3,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 34, rating: { average: 4.5, count: 16 } },
      },
      {
        name: "Iced Coffee",
        description: "Cold brew coffee with ice",
        price: 90,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 4,
        dietaryInfo: { isVegetarian: true },
        popularity: { orderCount: 42, rating: { average: 4.3, count: 20 } },
      },
      {
        name: "Mango Smoothie",
        description: "Creamy mango smoothie with yogurt",
        price: 100,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 5,
        dietaryInfo: { isVegetarian: true },
        popularity: { orderCount: 26, rating: { average: 4.6, count: 12 } },
      },
      {
        name: "Water Bottle",
        description: "500ml mineral water",
        price: 25,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 1,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 156, rating: { average: 4.0, count: 50 } },
      },

      // French Fries
      {
        name: "Classic French Fries",
        description: "Golden crispy potato fries",
        price: 80,
        category: "fries",
        restaurant: restaurantId,
        preparationTime: 8,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 78, rating: { average: 4.4, count: 35 } },
      },
      {
        name: "Cheese Fries",
        description: "Fries topped with melted cheese",
        price: 120,
        category: "fries",
        restaurant: restaurantId,
        preparationTime: 10,
        dietaryInfo: { isVegetarian: true },
        popularity: { orderCount: 52, rating: { average: 4.5, count: 23 } },
      },
      {
        name: "Spicy Fries",
        description: "Fries with spicy seasoning",
        price: 90,
        category: "fries",
        restaurant: restaurantId,
        preparationTime: 8,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: true,
          isSpicy: true,
          spiceLevel: 3,
        },
        popularity: { orderCount: 37, rating: { average: 4.2, count: 18 } },
      },
      {
        name: "Sweet Potato Fries",
        description: "Crispy sweet potato fries",
        price: 100,
        category: "fries",
        restaurant: restaurantId,
        preparationTime: 12,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 31, rating: { average: 4.3, count: 15 } },
      },

      // Veggies
      {
        name: "Garden Salad",
        description: "Fresh mixed greens with vegetables",
        price: 120,
        category: "veggies",
        restaurant: restaurantId,
        preparationTime: 5,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 44, rating: { average: 4.4, count: 20 } },
      },
      {
        name: "Grilled Vegetables",
        description: "Seasonal vegetables grilled to perfection",
        price: 140,
        category: "veggies",
        restaurant: restaurantId,
        preparationTime: 15,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 28, rating: { average: 4.3, count: 14 } },
      },
      {
        name: "Caesar Salad",
        description: "Romaine lettuce with Caesar dressing and croutons",
        price: 160,
        category: "veggies",
        restaurant: restaurantId,
        preparationTime: 6,
        dietaryInfo: { isVegetarian: true },
        popularity: { orderCount: 39, rating: { average: 4.5, count: 18 } },
      },
      {
        name: "Stuffed Bell Peppers",
        description: "Bell peppers stuffed with rice and vegetables",
        price: 180,
        category: "veggies",
        restaurant: restaurantId,
        preparationTime: 25,
        dietaryInfo: { isVegetarian: true, isVegan: true },
        popularity: { orderCount: 23, rating: { average: 4.6, count: 11 } },
      },
    ];

    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`Created ${createdMenuItems.length} menu items`);

    // Seed Chefs
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
    console.log(`Created ${createdChefs.length} chefs`);

    // Seed Tables
    const tables = [];
    for (let i = 1; i <= 30; i++) {
      if (i === 28) continue; // Skip table 28 as shown in screenshot

      tables.push({
        tableNumber: i.toString().padStart(2, "0"),
        name: `Table ${i.toString().padStart(2, "0")}`,
        chairs: 4,
        status: Math.random() > 0.7 ? "reserved" : "available",
        restaurant: restaurantId,
        location: {
          section: "main",
          position: {
            x: (i % 7) * 100,
            y: Math.floor((i - 1) / 7) * 100,
          },
        },
      });
    }

    const createdTables = await Table.insertMany(tables);
    console.log(`Created ${createdTables.length} tables`);

    console.log("Data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedData();
  mongoose.connection.close();
  console.log("Database connection closed");
};

run();
