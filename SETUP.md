# 🍽️ Restaurant Management System - Complete Setup Guide

This guide will help you set up the complete restaurant management system with both frontend and backend from scratch.

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js 16+** installed
- **npm** package manager
- **MongoDB** installed and running (local or cloud)

## 🚀 Quick Setup (Recommended)

### 1. Install All Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Environment

```bash
# Backend environment is already configured
# MongoDB URL: mongodb://localhost:27017/restaurant
# Make sure MongoDB is running on your system
```

### 3. Initialize Database

```bash
# Seed the database with demo data
npm run seed
```

### 4. Start the Application

```bash
# Start both frontend and backend simultaneously
npm run start:full
```

## 🌐 Access Points

- **Frontend (React App)**: http://localhost:8080
- **Backend API**: http://localhost:5000

## 🔐 Demo Credentials

```
Email: admin@restaurant.com
Password: password123
```

## 📱 Features Available

### Desktop Dashboard

1. **Analytics Page** (`/`) - Key metrics, charts, chef performance
2. **Tables Page** (`/tables`) - Table management with grid view
3. **Orders Page** (`/orders`) - Order processing and status tracking

### Mobile Menu Interface

4. **Menu Page** (`/menu`) - Complete menu with all categories:
   - 🍔 **Burgers** (4 items): Classic Beef, Chicken Deluxe, Veggie, BBQ Bacon
   - 🍕 **Pizza** (4 items): Margherita, Pepperoni, Vegetarian Supreme, Marinara
   - 🥤 **Drinks** (5 items): Coca Cola, Orange Juice, Iced Coffee, Mango Smoothie, Water
   - 🍟 **French Fries** (4 items): Classic, Cheese, Spicy, Sweet Potato
   - 🥗 **Veggies** (4 items): Garden Salad, Grilled Vegetables, Caesar Salad, Stuffed Peppers

### Order Placement Flow

1. Browse menu by category
2. Add items to cart with quantity controls
3. View order summary with total price
4. Place order with confirmation animation
5. Automatic redirect to orders page

## 🛠️ Development Commands

### Frontend Only

```bash
npm run dev          # Start frontend development server
npm run build        # Build for production
npm run typecheck    # Run TypeScript checks
```

### Backend Only

```bash
npm run backend      # Start backend development server
npm run seed         # Populate database with demo data
```

### Full Stack

```bash
npm run start:full   # Start both frontend and backend
npm run install:all  # Install all dependencies
```

## 🗄️ Database Schema

The system creates the following collections:

- **menuitems** - All food items with categories, pricing, dietary info
- **chefs** - Chef profiles with performance metrics
- **tables** - Restaurant tables with status and reservations
- **orders** - Customer orders with items and status tracking

## 📊 Demo Data Included

- **21 Menu Items** across 5 categories
- **4 Chefs** (Manesh, Pritam, Yash, Tenzen) with order counts
- **29 Tables** (01-30, skipping 28) with various statuses
- **Analytics Data** for charts and metrics

## 🎯 Key Features Implemented

### ✅ Pixel-Perfect UI

- Exact reproduction of provided screenshots
- Desktop analytics dashboard
- Mobile menu interface
- Responsive design for all screen sizes

### ✅ Complete Menu System

- All 5 food categories implemented
- Rich item descriptions and pricing
- Dietary information (vegetarian, vegan, spicy level)
- Popularity tracking and ratings

### ✅ Order Management

- Full order lifecycle (pending → processing → done → served)
- Cart functionality with add/remove items
- Order placement with confirmation
- Real-time status updates

### ✅ Table Management

- Visual grid layout matching screenshot
- Add/edit/delete tables
- Status tracking (available/reserved)
- Real-time updates

### ✅ Analytics Dashboard

- Key metrics cards (chefs, revenue, orders, clients)
- Interactive charts (revenue bars, order donut chart)
- Table calendar view
- Chef performance tracking

## 🔧 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh
# Or start MongoDB service
brew services start mongodb/brew/mongodb-community
# Or for Linux
sudo systemctl start mongod
```

### Port Conflicts

If ports 5000 or 8080 are in use:

```bash
# Backend (edit backend/.env)
PORT=5001

# Frontend (edit vite.config.ts)
server: { port: 3000 }
```

### Dependency Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules
npm run install:all
```

## 🔄 API Endpoints

### Menu

- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/burger` - Get burgers
- `POST /api/menu/seed` - Seed demo data

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Tables

- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create new table
- `PUT /api/tables/:id/reserve` - Reserve table

### Analytics

- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/revenue` - Revenue data

## 🎉 Success!

If everything is set up correctly, you should see:

1. **Frontend** at http://localhost:8080 with the analytics dashboard
2. **Backend** running at http://localhost:5000 with API responses
3. **Navigation** working between all pages
4. **Menu items** loading in all categories
5. **Order placement** working end-to-end

## 🆘 Need Help?

If you encounter any issues:

1. Check that MongoDB is running
2. Verify all dependencies are installed
3. Ensure ports 5000 and 8080 are available
4. Check the console for error messages
5. Try running `npm run seed` again to reset database

The application is now ready for use! 🎊
