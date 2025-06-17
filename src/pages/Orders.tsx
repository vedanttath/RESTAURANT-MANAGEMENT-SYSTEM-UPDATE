import React from "react";

interface Order {
  id: number;
  time: string;
  items: number;
  table: string;
  duration: string;
  status: "processing" | "done" | "served";
  orderItems: string[];
}

const Orders: React.FC = () => {
  const orders: Order[] = [
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "processing",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "done",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "served",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "processing",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "processing",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "served",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "done",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
    {
      id: 108,
      time: "9:37 AM",
      items: 3,
      table: "Table-05",
      duration: "4 min",
      status: "processing",
      orderItems: [
        "1x Value Set Meals",
        "1x Double Cheeseburger",
        "1x Apple Pie",
        "1x Coca-Cola",
      ],
    },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Ongoing 4 min";
      case "done":
        return "Done";
      case "served":
        return "Order Done 2x";
      default:
        return status;
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case "processing":
        return "Processing ⚠️";
      case "done":
        return "Done 🍽️";
      case "served":
        return "Order Done 🍽️";
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Order Line</h1>
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {orders.map((order, index) => (
          <div key={index} className={`order-card ${order.status}`}>
            {/* Order Header */}
            <div className="order-header">
              <div className="order-number">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                </svg>
                <span>#{order.id}</span>
              </div>
              <div className={`order-status-badge ${order.status}`}>
                {getStatusText(order.status)}
              </div>
            </div>

            {/* Order Details */}
            <div className="order-details">
              <div className="order-detail-line">
                <span>{order.time}</span>
                <span>{order.duration}</span>
              </div>
              <div className="order-detail-line">
                <span>{order.items} Item</span>
                <span></span>
              </div>
              <div className="order-detail-line">
                <span>{order.table}</span>
                <span></span>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items">
              {order.orderItems.map((item, itemIndex) => (
                <div key={itemIndex} className="order-item">
                  {item}
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button className={`order-action-btn ${order.status}`}>
              {getActionText(order.status)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
