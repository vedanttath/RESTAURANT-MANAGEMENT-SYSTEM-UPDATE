#!/bin/bash

# Restaurant Management System Setup Script

echo "🍽️ Setting up Restaurant Management System..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Return to root directory
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running on your system"
echo "2. Run 'npm run seed' to populate the database with demo data"
echo "3. Run 'npm run start:full' to start both frontend and backend"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:5000"
echo ""
echo "🔐 Demo login credentials:"
echo "   Email: admin@restaurant.com"
echo "   Password: password123"
