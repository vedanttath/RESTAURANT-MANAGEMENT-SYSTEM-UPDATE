import React, { useState } from "react";

const Checkout: React.FC = () => {
  const [orderType, setOrderType] = useState<"dine-in" | "take-away">(
    "dine-in",
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState("");

  return (
    <div className="menu-container">
      {/* Header */}
      <div className="menu-header">
        <h1 className="menu-greeting">Good evening</h1>
        <p className="menu-subtitle">Place you order here</p>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <input type="text" className="search-input" placeholder="Search" />
        </div>
      </div>

      {/* Selected Item */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "1rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          border: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          🍕
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "0.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
              Marinara
            </h3>
            <button
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <p style={{ color: "#64748b", marginBottom: "0.5rem" }}>₹ 200</p>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>14"</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <button
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                borderRadius: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              -
            </button>
            <span style={{ fontSize: "1.125rem", fontWeight: "500" }}>1</span>
            <button
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                borderRadius: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Cooking Instructions */}
      <button
        onClick={() => setShowInstructions(true)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "1rem",
          border: "none",
          backgroundColor: "transparent",
          color: "#64748b",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          cursor: "pointer",
        }}
      >
        Add cooking instructions (optional)
      </button>

      {/* Order Type Selection */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => setOrderType("dine-in")}
          style={{
            flex: 1,
            padding: "1rem",
            border: "none",
            borderRadius: "2rem",
            backgroundColor: orderType === "dine-in" ? "white" : "#e5e7eb",
            color: orderType === "dine-in" ? "#1e293b" : "#64748b",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Dine In
        </button>
        <button
          onClick={() => setOrderType("take-away")}
          style={{
            flex: 1,
            padding: "1rem",
            border: "none",
            borderRadius: "2rem",
            backgroundColor: orderType === "take-away" ? "white" : "#e5e7eb",
            color: orderType === "take-away" ? "#1e293b" : "#64748b",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Take Away
        </button>
      </div>

      {/* Order Summary */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            color: "#64748b",
          }}
        >
          <span>Item Total</span>
          <span>₹200.00</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            color: "#64748b",
          }}
        >
          <span>Delivery Charge</span>
          <span>₹50</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            color: "#64748b",
          }}
        >
          <span>Taxes</span>
          <span>₹5.00</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.125rem",
            fontWeight: "600",
            borderTop: "1px solid #f1f5f9",
            paddingTop: "1rem",
          }}
        >
          <span>Grand Total</span>
          <span>₹255.00</span>
        </div>
      </div>

      {/* Customer Details */}
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Your details
        </h3>
        <p style={{ color: "#64748b", marginBottom: "1rem" }}>
          Divya Sigatapu, 9109109109
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#10b981",
              borderRadius: "50%",
            }}
          ></div>
          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Delivery at Home - Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#10b981",
              borderRadius: "50%",
            }}
          ></div>
          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Delivery in 42 mins
          </span>
        </div>
      </div>

      {/* Swipe to Order Button */}
      <div
        style={{
          backgroundColor: "#e5e7eb",
          borderRadius: "3rem",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ transform: "rotate(-45deg)" }}
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            color: "#64748b",
            fontWeight: "500",
          }}
        >
          Swipe to Order
        </div>
      </div>

      {/* Cooking Instructions Modal */}
      {showInstructions && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                Add Cooking instructions
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#1e293b",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter cooking instructions..."
              style={{
                width: "100%",
                height: "120px",
                padding: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                resize: "none",
                outline: "none",
                marginBottom: "1rem",
              }}
            />
            <p
              style={{
                color: "#64748b",
                fontSize: "0.875rem",
                marginBottom: "2rem",
              }}
            >
              The restaurant will try its best to follow your request. However,
              refunds or cancellations in this regard won't be possible
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInstructions(false);
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  backgroundColor: "#4b5563",
                  color: "white",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
