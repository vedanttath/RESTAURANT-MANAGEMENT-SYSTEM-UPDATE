const express = require("express");
const { body, validationResult } = require("express-validator");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const { category, available, popular, search } = req.query;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    let query = { restaurant: restaurantId, isActive: true };

    if (category) {
      query.category = category;
    }

    if (available === "true") {
      query["availability.isAvailable"] = true;
    }

    let menuItems;

    if (search) {
      menuItems = await MenuItem.search(restaurantId, search);
    } else if (popular === "true") {
      menuItems = await MenuItem.getPopular(restaurantId);
    } else {
      menuItems = await MenuItem.find(query).sort({ sortOrder: 1, name: 1 });
    }

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
      error: error.message,
    });
  }
});

// Get menu items by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const restaurantId = req.query.restaurantId || "default-restaurant";

    const menuItems = await MenuItem.getByCategory(restaurantId, category);

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu items by category",
      error: error.message,
    });
  }
});

// Get single menu item
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu item",
      error: error.message,
    });
  }
});

// Create new menu item
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
    body("category")
      .isIn([
        "burger",
        "pizza",
        "drink",
        "fries",
        "veggies",
        "dessert",
        "other",
      ])
      .withMessage("Invalid category"),
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

      const menuItem = new MenuItem({
        ...req.body,
        restaurant: req.body.restaurantId || "default-restaurant",
      });

      await menuItem.save();

      res.status(201).json({
        success: true,
        message: "Menu item created successfully",
        data: menuItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating menu item",
        error: error.message,
      });
    }
  },
);

// Update menu item
router.put("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
      error: error.message,
    });
  }
});

// Delete menu item (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
      error: error.message,
    });
  }
});

// Seed menu items for demo
router.post("/seed", async (req, res) => {
  try {
    const restaurantId = req.body.restaurantId || "default-restaurant";

    // Clear existing items
    await MenuItem.deleteMany({ restaurant: restaurantId });

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
          { name: "Onion", quantity: "2 rings" },
          { name: "Burger Bun", quantity: "1" },
        ],
        preparationTime: 12,
        dietaryInfo: { isSpicy: false, spiceLevel: 0 },
      },
      {
        name: "Chicken Deluxe Burger",
        description: "Grilled chicken breast with special sauce and vegetables",
        price: 220,
        category: "burger",
        restaurant: restaurantId,
        ingredients: [
          { name: "Chicken Breast", quantity: "120g" },
          { name: "Special Sauce", quantity: "2 tbsp" },
          { name: "Lettuce", quantity: "2 leaves" },
          { name: "Pickles", quantity: "3 slices" },
        ],
        preparationTime: 10,
        dietaryInfo: { isSpicy: false, spiceLevel: 1 },
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables",
        price: 200,
        category: "burger",
        restaurant: restaurantId,
        ingredients: [
          { name: "Veggie Patty", quantity: "120g" },
          { name: "Avocado", quantity: "1/2" },
          { name: "Sprouts", quantity: "1 handful" },
        ],
        preparationTime: 8,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        name: "BBQ Bacon Burger",
        description: "Beef patty with crispy bacon and BBQ sauce",
        price: 280,
        category: "burger",
        restaurant: restaurantId,
        ingredients: [
          { name: "Beef Patty", quantity: "150g" },
          { name: "Bacon", quantity: "2 strips" },
          { name: "BBQ Sauce", quantity: "2 tbsp" },
        ],
        preparationTime: 15,
        dietaryInfo: { isSpicy: false, spiceLevel: 1 },
      },

      // Pizzas
      {
        name: "Margherita",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 180,
        category: "pizza",
        restaurant: restaurantId,
        ingredients: [
          { name: "Pizza Dough", quantity: "200g" },
          { name: "Tomato Sauce", quantity: "3 tbsp" },
          { name: "Mozzarella", quantity: "100g" },
          { name: "Basil", quantity: "5 leaves" },
        ],
        preparationTime: 18,
        dietaryInfo: { isVegetarian: true },
      },
      {
        name: "Pepperoni",
        description: "Pizza topped with pepperoni and cheese",
        price: 220,
        category: "pizza",
        restaurant: restaurantId,
        ingredients: [
          { name: "Pizza Dough", quantity: "200g" },
          { name: "Tomato Sauce", quantity: "3 tbsp" },
          { name: "Mozzarella", quantity: "100g" },
          { name: "Pepperoni", quantity: "50g" },
        ],
        preparationTime: 20,
        dietaryInfo: { isSpicy: false, spiceLevel: 1 },
      },
      {
        name: "Vegetarian Supreme",
        description: "Loaded with bell peppers, mushrooms, olives, and onions",
        price: 200,
        category: "pizza",
        restaurant: restaurantId,
        ingredients: [
          { name: "Bell Peppers", quantity: "50g" },
          { name: "Mushrooms", quantity: "40g" },
          { name: "Olives", quantity: "20g" },
          { name: "Red Onions", quantity: "30g" },
        ],
        preparationTime: 22,
        dietaryInfo: { isVegetarian: true },
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
      },
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 80,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 3,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        name: "Iced Coffee",
        description: "Cold brew coffee with ice",
        price: 90,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 4,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        name: "Mango Smoothie",
        description: "Creamy mango smoothie with yogurt",
        price: 100,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 5,
        dietaryInfo: { isVegetarian: true },
      },
      {
        name: "Water Bottle",
        description: "500ml mineral water",
        price: 25,
        category: "drink",
        restaurant: restaurantId,
        preparationTime: 1,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },

      // French Fries
      {
        name: "Classic French Fries",
        description: "Golden crispy potato fries",
        price: 80,
        category: "fries",
        restaurant: restaurantId,
        ingredients: [
          { name: "Potatoes", quantity: "200g" },
          { name: "Salt", quantity: "1 tsp" },
        ],
        preparationTime: 8,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        name: "Cheese Fries",
        description: "Fries topped with melted cheese",
        price: 120,
        category: "fries",
        restaurant: restaurantId,
        ingredients: [
          { name: "French Fries", quantity: "200g" },
          { name: "Cheese Sauce", quantity: "50ml" },
        ],
        preparationTime: 10,
        dietaryInfo: { isVegetarian: true },
      },
      {
        name: "Spicy Fries",
        description: "Fries with spicy seasoning",
        price: 90,
        category: "fries",
        restaurant: restaurantId,
        ingredients: [
          { name: "French Fries", quantity: "200g" },
          { name: "Spicy Seasoning", quantity: "1 tbsp" },
        ],
        preparationTime: 8,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: true,
          isSpicy: true,
          spiceLevel: 3,
        },
      },
      {
        name: "Sweet Potato Fries",
        description: "Crispy sweet potato fries",
        price: 100,
        category: "fries",
        restaurant: restaurantId,
        ingredients: [
          { name: "Sweet Potatoes", quantity: "200g" },
          { name: "Paprika", quantity: "1 tsp" },
        ],
        preparationTime: 12,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },

      // Veggies
      {
        name: "Garden Salad",
        description: "Fresh mixed greens with vegetables",
        price: 120,
        category: "veggies",
        restaurant: restaurantId,
        ingredients: [
          { name: "Mixed Lettuce", quantity: "100g" },
          { name: "Tomatoes", quantity: "50g" },
          { name: "Cucumbers", quantity: "50g" },
          { name: "Carrots", quantity: "30g" },
          { name: "Olive Oil Dressing", quantity: "2 tbsp" },
        ],
        preparationTime: 5,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        name: "Grilled Vegetables",
        description: "Seasonal vegetables grilled to perfection",
        price: 140,
        category: "veggies",
        restaurant: restaurantId,
        ingredients: [
          { name: "Zucchini", quantity: "80g" },
          { name: "Bell Peppers", quantity: "60g" },
          { name: "Eggplant", quantity: "80g" },
          { name: "Onions", quantity: "40g" },
        ],
        preparationTime: 15,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        name: "Caesar Salad",
        description: "Romaine lettuce with Caesar dressing and croutons",
        price: 160,
        category: "veggies",
        restaurant: restaurantId,
        ingredients: [
          { name: "Romaine Lettuce", quantity: "120g" },
          { name: "Caesar Dressing", quantity: "3 tbsp" },
          { name: "Croutons", quantity: "30g" },
          { name: "Parmesan Cheese", quantity: "20g" },
        ],
        preparationTime: 6,
        dietaryInfo: { isVegetarian: true },
      },
      {
        name: "Stuffed Bell Peppers",
        description: "Bell peppers stuffed with rice and vegetables",
        price: 180,
        category: "veggies",
        restaurant: restaurantId,
        ingredients: [
          { name: "Bell Peppers", quantity: "2 pieces" },
          { name: "Rice", quantity: "100g" },
          { name: "Mixed Vegetables", quantity: "80g" },
        ],
        preparationTime: 25,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
    ];

    const createdItems = await MenuItem.insertMany(menuItems);

    res.status(201).json({
      success: true,
      message: "Menu items seeded successfully",
      data: createdItems,
      count: createdItems.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error seeding menu items",
      error: error.message,
    });
  }
});

module.exports = router;
