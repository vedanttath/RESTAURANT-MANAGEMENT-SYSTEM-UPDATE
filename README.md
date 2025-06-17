# 🍽️ Restaurant Management & POS System

A comprehensive, pixel-perfect restaurant management and point-of-sale (POS) system built with React, TypeScript, Node.js, Express, and MongoDB. Features both desktop analytics dashboard and mobile-optimized ordering interface.

## 📱 Features

### 🔹 Dashboard Analytics

- **Key Metrics Overview**: Total chefs (04), revenue (₹12K), orders (20), clients (65)
- **Interactive Charts**: Daily revenue bars, order summary donut chart, table calendar
- **Chef Performance**: Real-time order tracking and completion statistics

### 🔹 Table Management

- **Visual Table Grid**: Tables 01-30+ with real-time status updates
- **CRUD Operations**: Add/edit/delete tables with chair counts
- **Status Tracking**: Available, Reserved, Occupied, Maintenance
- **Search & Filter**: Quick table lookup functionality

### 🔹 Order Management

- **Order Processing**: Complete workflow from pending to served
- **Real-time Updates**: Live order status with WebSocket connections
- **Chef Assignment**: Automatic and manual chef allocation
- **Order Types**: Dine-in, Take-away, Delivery support

### 🔹 Menu Management (Mobile-Optimized)

- **Categories**: Burger 🍔, Pizza 🍕, Drinks 🥤, French Fries 🍟, Veggies 🥗
- **Item Management**: 20+ pre-loaded menu items with descriptions
- **Cart System**: Add/remove items with quantity controls
- **Order Placement**: Complete checkout flow with order confirmation

### 🔹 Real-time Features

- **Live Updates**: WebSocket integration for instant updates
- **Order Status**: Processing → Done → Served workflow
- **Table Status**: Automatic updates when orders are placed/completed

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **React Router 6** for navigation
- **Vanilla CSS** with custom design system
- **Responsive Design** (Mobile-first approach)

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time updates
- **JWT Authentication**
- **bcryptjs** for password hashing

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or cloud)

### 1. Clone Repository

```bash
git clone <repository-url>
cd restaurant-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed initial data
npm run seed

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../  # Go back to root
npm install

# Start frontend development server
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000

## 📖 API Documentation

### Authentication

```bash
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
```

### Menu Items

```bash
GET /api/menu                 # Get all menu items
GET /api/menu/category/:cat   # Get items by category
POST /api/menu/seed           # Seed demo data
```

### Orders

```bash
GET /api/orders               # Get all orders
POST /api/orders              # Create new order
PUT /api/orders/:id/status    # Update order status
```

### Tables

```bash
GET /api/tables               # Get all tables
POST /api/tables              # Create new table
PUT /api/tables/:id/reserve   # Reserve table
```

### Analytics

```bash
GET /api/analytics/dashboard  # Dashboard metrics
GET /api/analytics/revenue    # Revenue analytics
```

## 🎨 Design System

### Color Palette

```css
--primary-blue: #3b82f6 --success-green: #10b981 --warning-orange: #f59e0b
  --danger-red: #ef4444 --text-primary: #1f2937 --bg-secondary: #f6f8fa;
```

### Components

- Metric cards with icons
- Interactive charts and graphs
- Mobile-responsive navigation
- Touch-friendly interfaces

## 📱 Mobile Experience

The application is optimized for mobile devices with:

- **Touch-friendly interfaces**
- **Bottom navigation** on mobile
- **Swipe gestures** for menu items
- **Responsive grid layouts**
- **Mobile-first design**

## 🔧 Development

### Project Structure

```
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express server
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── App.css         # Design system
│   └── App.tsx         # Main app component
└── README.md
```

### Available Scripts

**Frontend:**

```bash
npm run dev        # Development server
npm run build      # Production build
npm run typecheck  # TypeScript checking
```

**Backend:**

```bash
npm run dev        # Development server
npm run seed       # Seed database
npm start          # Production server
```

## 🗄️ Database Schema

### Menu Items

- Categories: burger, pizza, drink, fries, veggies
- Pricing, descriptions, dietary information
- Popularity tracking and ratings

### Orders

- Customer information and preferences
- Item lists with customizations
- Status tracking and timing
- Chef assignments

### Tables

- Table numbers and seating capacity
- Status management and reservations
- Location tracking within restaurant

### Chefs

- Performance metrics and ratings
- Specialty assignments
- Workload management

## 🔐 Authentication

Simple JWT-based authentication with demo accounts:

- **Admin**: admin@restaurant.com / password123
- **Manager**: manager@restaurant.com / password123

## 🌟 Key Features Implemented

✅ **Pixel-perfect UI** matching provided screenshots  
✅ **Complete menu system** with all food categories  
✅ **Order placement workflow** with cart management  
✅ **Real-time updates** using WebSocket  
✅ **Responsive design** for desktop and mobile  
✅ **Analytics dashboard** with interactive charts  
✅ **Table management** with visual grid layout  
✅ **Chef assignment** and performance tracking

## 🚦 Demo Data

The system comes pre-loaded with:

- **20+ menu items** across 5 categories
- **4 demo chefs** (Manesh, Pritam, Yash, Tenzen)
- **30 restaurant tables** with various statuses
- **Sample orders** and analytics data

## 🔮 Future Enhancements

- Payment gateway integration
- Inventory management system
- Staff scheduling and payroll
- Customer loyalty programs
- Advanced reporting and analytics
- Multi-restaurant support

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, create an issue in the repository or contact the development team.

---

**Built with ❤️ for modern restaurant operations**
