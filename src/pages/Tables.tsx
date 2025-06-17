import React, { useState } from "react";

interface Table {
  id: number;
  chairs: number;
  status: "available" | "reserved";
}

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, chairs: 4, status: "available" },
    { id: 2, chairs: 4, status: "available" },
    { id: 3, chairs: 4, status: "available" },
    { id: 4, chairs: 4, status: "available" },
    { id: 5, chairs: 4, status: "available" },
    { id: 6, chairs: 4, status: "available" },
    { id: 7, chairs: 4, status: "available" },
    { id: 8, chairs: 4, status: "available" },
    { id: 9, chairs: 4, status: "available" },
    { id: 10, chairs: 4, status: "available" },
    { id: 11, chairs: 4, status: "available" },
    { id: 12, chairs: 4, status: "available" },
    { id: 13, chairs: 4, status: "available" },
    { id: 14, chairs: 4, status: "available" },
    { id: 15, chairs: 4, status: "available" },
    { id: 16, chairs: 4, status: "available" },
    { id: 17, chairs: 4, status: "available" },
    { id: 18, chairs: 4, status: "available" },
    { id: 19, chairs: 4, status: "available" },
    { id: 20, chairs: 4, status: "available" },
    { id: 21, chairs: 4, status: "available" },
    { id: 22, chairs: 4, status: "available" },
    { id: 23, chairs: 4, status: "available" },
    { id: 24, chairs: 4, status: "available" },
    { id: 25, chairs: 4, status: "available" },
    { id: 26, chairs: 4, status: "available" },
    { id: 27, chairs: 4, status: "available" },
    { id: 29, chairs: 4, status: "available" },
    { id: 30, chairs: 4, status: "available" },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableChairs, setNewTableChairs] = useState(3);

  const deleteTable = (id: number) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const addTable = () => {
    if (newTableName.trim()) {
      const newId = Math.max(...tables.map((t) => t.id)) + 1;
      setTables([
        ...tables,
        {
          id: newId,
          chairs: newTableChairs,
          status: "available",
        },
      ]);
      setNewTableName("");
      setNewTableChairs(3);
      setShowAddForm(false);
    }
  };

  const toggleTableStatus = (id: number) => {
    setTables(
      tables.map((table) =>
        table.id === id
          ? {
              ...table,
              status: table.status === "available" ? "reserved" : "available",
            }
          : table,
      ),
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Tables</h1>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <input type="text" className="search-input" placeholder="Search" />
      </div>

      {/* Tables Grid */}
      <div className="tables-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-card ${table.status}`}
            onClick={() => toggleTableStatus(table.id)}
          >
            <button
              className="table-delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteTable(table.id);
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <div className="table-number">
              Table
              <br />
              {table.id.toString().padStart(2, "0")}
            </div>
            <div className="table-chairs">
              <span>🪑</span>
              <span>{table.chairs} sty</span>
            </div>
          </div>
        ))}

        {/* Add Table Card */}
        {!showAddForm && (
          <div
            className="table-card add-table-card"
            onClick={() => setShowAddForm(true)}
          >
            <button className="add-button">+</button>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Add Table</div>
          </div>
        )}

        {/* Add Table Form */}
        {showAddForm && (
          <div className="table-card add-table-card">
            <div className="add-table-form">
              <div className="form-group">
                <label className="form-label">Table name (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Table 31"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chair</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      setNewTableChairs(Math.max(1, newTableChairs - 1))
                    }
                  >
                    -
                  </button>
                  <span style={{ minWidth: "24px", textAlign: "center" }}>
                    {newTableChairs.toString().padStart(2, "0")}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => setNewTableChairs(newTableChairs + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button className="btn-create" onClick={addTable}>
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;
