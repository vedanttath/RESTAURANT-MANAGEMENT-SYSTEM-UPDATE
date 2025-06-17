import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <button className="filter-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
          </svg>
          Filter...
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon chefs">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.5 2C17 2 19 5.69 18.95 9.14C18.87 14.45 14.77 19 12.5 19S6.13 14.45 6.05 9.14C6 5.69 8 2 12.5 2Z" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">04</div>
            <div className="metric-label">Total Chef</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">12K</div>
            <div className="metric-label">Total Revenue</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orders">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7H18V6C18 5.45 17.55 5 17 5S16 5.45 16 6V7H8V6C8 5.45 7.55 5 7 5S6 5.45 6 6V7H5C3.89 7 3.01 7.89 3.01 9L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V9C21 7.89 20.1 7 19 7Z" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">20</div>
            <div className="metric-label">Total Orders</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon clients">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4C18.21 4 20 5.79 20 8C20 10.21 18.21 12 16 12C13.79 12 12 10.21 12 8C12 5.79 13.79 4 16 4ZM16 14C18.67 14 22 15.34 22 18V20H10V18C10 15.34 13.33 14 16 14Z" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">65</div>
            <div className="metric-label">Total Clients</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Order Summary Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Order Summary</div>
            <div className="chart-subtitle">
              Dine In/Take Away/Drive Thru/Delivery
            </div>
          </div>
          <div className="order-summary-chart">
            <div className="donut-container">
              <div className="donut-chart">
                <div className="donut-center">
                  <div className="donut-percentage">36%</div>
                  <div className="donut-label">Orders</div>
                </div>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color blue"></div>
                <span>Dine In</span>
              </div>
              <div className="legend-item">
                <div className="legend-color green"></div>
                <span>Take Away</span>
              </div>
              <div className="legend-item">
                <div className="legend-color orange"></div>
                <span>Served</span>
              </div>
            </div>
          </div>
          <div className="chart-numbers">
            <span>09</span>
            <span>05</span>
            <span>06</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Revenue</div>
            <div className="chart-subtitle">
              Daily/Weekly/Monthly/Quarterly/Yearly
            </div>
          </div>
          <div className="revenue-chart">
            <div className="revenue-bar mon"></div>
            <div className="revenue-bar tue"></div>
            <div className="revenue-bar wed"></div>
            <div className="revenue-bar thu"></div>
            <div className="revenue-bar fri"></div>
            <div className="revenue-bar sat"></div>
            <div className="revenue-bar sun"></div>
          </div>
          <div className="revenue-labels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Tables Calendar */}
        <div className="tables-calendar">
          <div className="calendar-header">
            <div className="calendar-title">Tables</div>
            <div className="calendar-legend">
              <div className="legend-item-calendar">
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%",
                  }}
                ></div>
                <span>Reserved</span>
              </div>
              <div className="legend-item-calendar">
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "50%",
                  }}
                ></div>
                <span>Available</span>
              </div>
            </div>
          </div>
          <div className="calendar-grid">
            {/* Week Headers */}
            <div className="calendar-day-header">Sun</div>
            <div className="calendar-day-header">Mon</div>
            <div className="calendar-day-header">Tue</div>
            <div className="calendar-day-header">Wed</div>
            <div className="calendar-day-header">Thu</div>
            <div className="calendar-day-header">Fri</div>
            <div className="calendar-day-header">Sat</div>

            {/* Calendar Days */}
            <div className="calendar-day available">01</div>
            <div className="calendar-day reserved">02</div>
            <div className="calendar-day reserved">03</div>
            <div className="calendar-day reserved">04</div>
            <div className="calendar-day reserved">05</div>
            <div className="calendar-day reserved">06</div>
            <div className="calendar-day reserved">07</div>
            <div className="calendar-day available">08</div>
            <div className="calendar-day reserved">09</div>
            <div className="calendar-day available">10</div>
            <div className="calendar-day reserved">11</div>
            <div className="calendar-day reserved">12</div>
            <div className="calendar-day available">13</div>
            <div className="calendar-day available">14</div>
            <div className="calendar-day reserved">15</div>
            <div className="calendar-day reserved">16</div>
            <div className="calendar-day reserved">17</div>
            <div className="calendar-day reserved">18</div>
            <div className="calendar-day reserved">19</div>
            <div className="calendar-day available">20</div>
            <div className="calendar-day reserved">21</div>
            <div className="calendar-day reserved">22</div>
            <div className="calendar-day reserved">23</div>
            <div className="calendar-day reserved">24</div>
            <div className="calendar-day reserved">25</div>
            <div className="calendar-day reserved">26</div>
            <div className="calendar-day reserved">27</div>
            <div className="calendar-day reserved">28</div>
            <div className="calendar-day reserved">29</div>
            <div className="calendar-day reserved">30</div>
          </div>
        </div>
      </div>

      {/* Chef Assignment Table */}
      <div className="chef-table">
        <div className="chef-table-header">
          <div>Chef Name</div>
          <div>Order Taken</div>
        </div>
        <div className="chef-table-row">
          <div>Manesh</div>
          <div>03</div>
        </div>
        <div className="chef-table-row">
          <div>Pritam</div>
          <div>07</div>
        </div>
        <div className="chef-table-row">
          <div>Yash</div>
          <div>05</div>
        </div>
        <div className="chef-table-row">
          <div>Tenzen</div>
          <div>08</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
