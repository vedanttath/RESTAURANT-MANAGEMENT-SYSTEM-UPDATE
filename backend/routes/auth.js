const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Simple in-memory user store for demo (use database in production)
const users = [
  {
    id: "1",
    email: "admin@restaurant.com",
    password: "$2a$10$8K6Q8Q8Q8Q8Q8Q8Q8Q8Q8O", // "password123"
    name: "Restaurant Admin",
    role: "admin",
    restaurant: "default-restaurant",
  },
  {
    id: "2",
    email: "manager@restaurant.com",
    password: "$2a$10$8K6Q8Q8Q8Q8Q8Q8Q8Q8Q8O", // "password123"
    name: "Restaurant Manager",
    role: "manager",
    restaurant: "default-restaurant",
  },
];

// Hash the demo passwords
(async () => {
  for (let user of users) {
    if (user.password === "$2a$10$8K6Q8Q8Q8Q8Q8Q8Q8Q8Q8O") {
      user.password = await bcrypt.hash("password123", 10);
    }
  }
})();

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
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

      const { email, password, name, role = "staff" } = req.body;

      // Check if user exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = {
        id: (users.length + 1).toString(),
        email,
        password: hashedPassword,
        name,
        role,
        restaurant: "default-restaurant",
      };

      users.push(newUser);

      // Generate JWT
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          restaurant: newUser.restaurant,
        },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: process.env.JWT_EXPIRE || "7d" },
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            restaurant: newUser.restaurant,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error.message,
      });
    }
  },
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body;

      // Find user
      const user = users.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          restaurant: user.restaurant,
        },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: process.env.JWT_EXPIRE || "7d" },
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            restaurant: user.restaurant,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error during login",
        error: error.message,
      });
    }
  },
);

// Get current user
router.get("/me", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      restaurant: user.restaurant,
    },
  });
});

// Logout (in a real app, you might want to blacklist the token)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback-secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
      req.user = user;
      next();
    },
  );
}

module.exports = router;
module.exports.authenticateToken = authenticateToken;
