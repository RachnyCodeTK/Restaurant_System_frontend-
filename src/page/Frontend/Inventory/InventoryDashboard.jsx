import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import {
  getStockLevels,
  getLowStockAlerts,
  getStockAdjustments,
  getInventorySummary,
  getStockByCategory,
} from "../../../services/analyticsService";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from "recharts";
import "./InventoryDashboard.css";

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [threshold, setThreshold] = useState(10);

  // Data states
  const [inventorySummary, setInventorySummary] = useState(null);
  const [stockLevels, setStockLevels] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [stockAdjustments, setStockAdjustments] = useState([]);
  const [stockByCategory, setStockByCategory] = useState([]);

  // Fetch all inventory data
  useEffect(() => {
    fetchInventoryData();
  }, [threshold]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryRes, levelsRes, alertsRes, adjustmentsRes, categoryRes] = await Promise.all([
        getInventorySummary(),
        getStockLevels(),
        getLowStockAlerts(threshold),
        getStockAdjustments(null, 50),
        getStockByCategory(),
      ]);

      setInventorySummary(summaryRes.data);
      setStockLevels(levelsRes.data || []);
      setLowStockAlerts(alertsRes.data || []);
      setStockAdjustments(adjustmentsRes.data || []);
      setStockByCategory(categoryRes.data || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "#ef4444";
      case "Low":
        return "#f59e0b";
      case "Medium":
        return "#f59e0b";
      case "Healthy":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getSeverityBadge = (severity) => {
    return severity === "critical" ? "🔴 Critical" : "🟡 Warning";
  };

  if (loading) {
    return (
      <div className="container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main">
          <Header />
          <div className="loading">Loading Inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className={`hamburger ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        <Header />

        {/* Error Display */}
        {error && <div className="error-message">{error}</div>}

        {/* Inventory Header */}
        <div className="inventory-header">
          <h1>📦 Inventory Management Dashboard</h1>
          <button 
            className="btn-refresh"
            onClick={fetchInventoryData}
            title="Refresh Data"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Summary Cards */}
        {inventorySummary && (
          <div className="inventory-cards">
            <div className="card-item">
              <h3>Total Products</h3>
              <p className="card-value">{inventorySummary.total_products || 0}</p>
              <small>In Stock</small>
            </div>
            <div className="card-item">
              <h3>Total Units</h3>
              <p className="card-value">{inventorySummary.total_units || 0}</p>
              <small>All Items</small>
            </div>
            <div className="card-item">
              <h3>Inventory Value</h3>
              <p className="card-value">${inventorySummary.total_value?.toFixed(2) || "0.00"}</p>
              <small>Total Worth</small>
            </div>
            <div className="card-item critical">
              <h3>Critical Items</h3>
              <p className="card-value">{inventorySummary.critical_items || 0}</p>
              <small>{inventorySummary.low_stock_items || 0} Low Stock</small>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === "levels" ? "active" : ""}`}
            onClick={() => setActiveTab("levels")}
          >
            📈 Stock Levels
          </button>
          <button 
            className={`tab ${activeTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("alerts")}
          >
            ⚠️ Low Stock Alerts
          </button>
          <button 
            className={`tab ${activeTab === "adjustments" ? "active" : ""}`}
            onClick={() => setActiveTab("adjustments")}
          >
            ✏️ Adjustments
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            {stockByCategory.length > 0 && (
              <div className="chart-container">
                <h3>Stock Distribution by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockByCategory}>
                    <CartesianGrid stroke="#333" />
                    <XAxis dataKey="category" stroke="#f2dddd" />
                    <YAxis stroke="#e4d8d8" />
                    <Tooltip 
                      contentStyle={{ background: "#1f2b3a", border: "1px solid #444" }}
                    />
                    <Legend />
                    <Bar dataKey="total_stock" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {stockByCategory.length > 0 && (
              <div className="chart-container">
                <h3 style={{ color: "blue" }}>Inventory Value by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockByCategory}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stockByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {stockByCategory.length > 0 && (
              <div className="table-container">
                <h3 style={{ color: "blue" }}>Category Summary</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Products</th>
                      <th>Total Stock</th>
                      <th>Avg Stock</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockByCategory.map((cat, idx) => (
                      <tr key={idx}>
                        <td>{cat.category}</td>
                        <td>{cat.products}</td>
                        <td>{cat.total_stock}</td>
                        <td>{cat.avg_stock?.toFixed(0) || 0}</td>
                        <td>${cat.value?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stock Levels Tab */}
        {activeTab === "levels" && (
          <div className="tab-content">
            <div className="table-container">
              <h3 style={{ color: "blue" }}>All Product Stock Levels</h3>
              {stockLevels.length > 0 ? (
                <div className="stock-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product Code</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockLevels.map((product, idx) => (
                        <tr key={idx} className={`status-${product.status.toLowerCase()}`}>
                          <td>{product.code}</td>
                          <td>{product.name}</td>
                          <td>{product.category || "N/A"}</td>
                          <td>${product.price?.toFixed(2) || "0.00"}</td>
                          <td className="stock-badge">
                            {product.stock}
                            <span 
                              className="status-indicator"
                              style={{ backgroundColor: getStatusColor(product.status) }}
                            />
                          </td>
                          <td>
                            <span className={`badge badge-${product.status.toLowerCase()}`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No stock data available</p>
              )}
            </div>
          </div>
        )}

        {/* Low Stock Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="tab-content">
            <div className="threshold-control">
              <label>Alert Threshold:</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
              />
            </div>

            <div className="table-container">
              <h3 style={{ color: "blue" }}>Low Stock Alerts (Threshold: {threshold})</h3>
              {lowStockAlerts.length > 0 ? (
                <div className="alerts-wrapper">
                  {lowStockAlerts.map((alert, idx) => (
                    <div key={idx} className={`alert-card alert-${alert.severity}`}>
                      <div className="alert-header">
                        <div className="alert-title">{alert.name}</div>
                        <div className="alert-severity">{getSeverityBadge(alert.severity)}</div>
                      </div>
                      <div className="alert-details">
                        <div className="detail">
                          <span>Code:</span>
                          <strong>{alert.code}</strong>
                        </div>
                        <div className="detail">
                          <span>Current Stock:</span>
                          <strong>{alert.current_stock}</strong>
                        </div>
                        <div className="detail">
                          <span>Units Needed:</span>
                          <strong>{alert.units_needed}</strong>
                        </div>
                        <div className="detail">
                          <span>Price:</span>
                          <strong>${alert.price?.toFixed(2) || "0.00"}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-alerts">✅ No low stock alerts! All items are well stocked.</p>
              )}
            </div>
          </div>
        )}

        {/* Adjustments Tab */}
        {activeTab === "adjustments" && (
          <div className="tab-content">
            <div className="table-container">
<h3 style={{ color: "blue" }}>Stock Adjustments History (Last 50)</h3>              {stockAdjustments.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Qty Change</th>
                      <th>Reason</th>
                      <th>Adjusted By</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockAdjustments.map((adj, idx) => (
                      <tr key={idx} className={adj.quantity_change > 0 ? "add" : "remove"}>
                        <td>{new Date(adj.date).toLocaleDateString()}</td>
                        <td>{adj.product_code}</td>
                        <td>{adj.product_name}</td>
                        <td className="qty-change">
                          <span className={adj.quantity_change > 0 ? "positive" : "negative"}>
                            {adj.quantity_change > 0 ? "+" : ""}{adj.quantity_change}
                          </span>
                        </td>
                        <td>{adj.reason}</td>
                        <td>{adj.adjusted_by}</td>
                        <td>{adj.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No adjustment records available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
