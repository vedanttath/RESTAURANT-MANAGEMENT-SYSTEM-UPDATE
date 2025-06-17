import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  preparationTime: number;
  dietaryInfo?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isSpicy?: boolean;
    spiceLevel?: number;
  };
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("burger");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = [
    { id: "burger", name: "Burger", icon: "🍔" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "drink", name: "Drink", icon: "🥤" },
    { id: "fries", name: "French fries", icon: "🍟" },
    { id: "veggies", name: "Veggies", icon: "🥗" },
  ];

  // Sample menu data for all categories
  const allMenuItems: { [key: string]: MenuItem[] } = {
    burger: [
      {
        id: "burger-1",
        name: "Classic Beef Burger",
        description: "Juicy beef patty with lettuce, tomato, onion, and cheese",
        price: 250,
        category: "burger",
        preparationTime: 12,
      },
      {
        id: "burger-2",
        name: "Chicken Deluxe",
        description: "Grilled chicken breast with special sauce",
        price: 220,
        category: "burger",
        preparationTime: 10,
      },
      {
        id: "burger-3",
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables",
        price: 200,
        category: "burger",
        preparationTime: 8,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        id: "burger-4",
        name: "BBQ Bacon Burger",
        description: "Beef patty with crispy bacon and BBQ sauce",
        price: 280,
        category: "burger",
        preparationTime: 15,
      },
    ],
    pizza: [
      {
        id: "pizza-1",
        name: "Margherita",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 180,
        category: "pizza",
        preparationTime: 18,
        dietaryInfo: { isVegetarian: true },
      },
      {
        id: "pizza-2",
        name: "Pepperoni",
        description: "Pizza topped with pepperoni and cheese",
        price: 220,
        category: "pizza",
        preparationTime: 20,
      },
      {
        id: "pizza-3",
        name: "Vegetarian Supreme",
        description: "Loaded with bell peppers, mushrooms, olives, and onions",
        price: 200,
        category: "pizza",
        preparationTime: 22,
        dietaryInfo: { isVegetarian: true },
      },
      {
        id: "pizza-4",
        name: "Marinara",
        description: "Classic marinara pizza with herbs",
        price: 160,
        category: "pizza",
        preparationTime: 16,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
    ],
    drink: [
      {
        id: "drink-1",
        name: "Coca Cola",
        description: "Classic refreshing cola drink",
        price: 60,
        category: "drink",
        preparationTime: 2,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        id: "drink-2",
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 80,
        category: "drink",
        preparationTime: 3,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        id: "drink-3",
        name: "Iced Coffee",
        description: "Cold brew coffee with ice",
        price: 90,
        category: "drink",
        preparationTime: 4,
        dietaryInfo: { isVegetarian: true },
      },
      {
        id: "drink-4",
        name: "Mango Smoothie",
        description: "Creamy mango smoothie with yogurt",
        price: 100,
        category: "drink",
        preparationTime: 5,
        dietaryInfo: { isVegetarian: true },
      },
      {
        id: "drink-5",
        name: "Water Bottle",
        description: "500ml mineral water",
        price: 25,
        category: "drink",
        preparationTime: 1,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
    ],
    fries: [
      {
        id: "fries-1",
        name: "Classic French Fries",
        description: "Golden crispy potato fries",
        price: 80,
        category: "fries",
        preparationTime: 8,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        id: "fries-2",
        name: "Cheese Fries",
        description: "Fries topped with melted cheese",
        price: 120,
        category: "fries",
        preparationTime: 10,
        dietaryInfo: { isVegetarian: true },
      },
      {
        id: "fries-3",
        name: "Spicy Fries",
        description: "Fries with spicy seasoning",
        price: 90,
        category: "fries",
        preparationTime: 8,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: true,
          isSpicy: true,
          spiceLevel: 3,
        },
      },
      {
        id: "fries-4",
        name: "Sweet Potato Fries",
        description: "Crispy sweet potato fries",
        price: 100,
        category: "fries",
        preparationTime: 12,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
    ],
    veggies: [
      {
        id: "veggies-1",
        name: "Garden Salad",
        description: "Fresh mixed greens with vegetables",
        price: 120,
        category: "veggies",
        preparationTime: 5,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        id: "veggies-2",
        name: "Grilled Vegetables",
        description: "Seasonal vegetables grilled to perfection",
        price: 140,
        category: "veggies",
        preparationTime: 15,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
      {
        id: "veggies-3",
        name: "Caesar Salad",
        description: "Romaine lettuce with Caesar dressing and croutons",
        price: 160,
        category: "veggies",
        preparationTime: 6,
        dietaryInfo: { isVegetarian: true },
      },
      {
        id: "veggies-4",
        name: "Stuffed Bell Peppers",
        description: "Bell peppers stuffed with rice and vegetables",
        price: 180,
        category: "veggies",
        preparationTime: 25,
        dietaryInfo: { isVegetarian: true, isVegan: true },
      },
    ],
  };

  useEffect(() => {
    setMenuItems(allMenuItems[activeCategory] || []);
  }, [activeCategory]);

  const filteredItems = menuItems;

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const getItemQuantity = (id: string) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "burger":
        return "🍔";
      case "pizza":
        return "🍕";
      case "drink":
        return "🥤";
      case "fries":
        return "🍟";
      case "veggies":
        return "🥗";
      default:
        return "🍽️";
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // Simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setOrderPlaced(true);
      setCart([]);

      // Show success message and redirect after delay
      setTimeout(() => {
        setOrderPlaced(false);
        navigate("/orders");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="menu-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "1rem",
              animation: "bounce 1s infinite",
            }}
          >
            ✅
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#10b981",
              marginBottom: "0.5rem",
            }}
          >
            Order Placed Successfully!
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Your order is being prepared. You'll be redirected to the orders
            page shortly.
          </p>
          <div
            style={{
              width: "40px",
              height: "4px",
              backgroundColor: "#10b981",
              borderRadius: "2px",
              animation: "loading 3s linear",
            }}
          ></div>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes loading {
            0% { width: 0; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {/* Cart Total Display */}
      {getTotalPrice() > 0 && (
        <div className="cart-total-float">₹{getTotalPrice()}</div>
      )}

      {/* Header */}
      <div className="menu-header">
        <h1 className="menu-greeting">Good evening</h1>
        <p className="menu-subtitle">Place your order here</p>

        {/* Search Bar */}
        <div className="menu-search">
          <div className="menu-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <input
            type="text"
            className="menu-search-input"
            placeholder="Search"
          />
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Title */}
      <h2 className="category-title">
        {categories.find((c) => c.id === activeCategory)?.name ||
          activeCategory}
      </h2>

      {/* Menu Items Grid */}
      <div className="menu-items-grid">
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          return (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                {getCategoryIcon(item.category)}
              </div>
              <div className="menu-item-content">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-price">₹ {item.price}</div>
                {item.dietaryInfo?.isVegetarian && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#10b981",
                      marginBottom: "8px",
                    }}
                  >
                    🌱 Vegetarian
                  </div>
                )}
                {item.dietaryInfo?.isSpicy && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#ef4444",
                      marginBottom: "8px",
                    }}
                  >
                    🌶️ Spicy Level {item.dietaryInfo.spiceLevel}
                  </div>
                )}
                <div className="menu-item-actions">
                  {quantity === 0 ? (
                    <button
                      className="menu-add-btn"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  ) : (
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid #f1f5f9",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Your Order ({cart.length} items)
          </h3>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr style={{ margin: "12px 0", border: "1px solid #f1f5f9" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            <span>Total</span>
            <span>₹{getTotalPrice()}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        className="next-button"
        onClick={cart.length > 0 ? placeOrder : () => navigate("/checkout")}
        disabled={loading}
        style={{
          opacity: cart.length === 0 ? 0.5 : 1,
          cursor: cart.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid transparent",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            Placing Order...
          </div>
        ) : cart.length > 0 ? (
          `Place Order (₹${getTotalPrice()})`
        ) : (
          "Add items to cart"
        )}
      </button>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Menu;
