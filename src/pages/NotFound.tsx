import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "1rem",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#475569",
            marginBottom: "1rem",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            color: "#64748b",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
