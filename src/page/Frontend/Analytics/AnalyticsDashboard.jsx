import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import {
  getSalesSummary,
  getSalesTrend,
  getTopProducts,
  getTopCustomers,
  getPaymentMethodStats,
} from "../../../services/analyticsService";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./AnalyticsDashboard.css";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [salesSummary, setSalesSummary] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Fetch all analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryRes, trendRes, productsRes, customersRes, paymentRes] = await Promise.all([
        getSalesSummary(),
        getSalesTrend("daily"),
        getTopProducts(10),
        getTopCustomers(10),
        getPaymentMethodStats(),
      ]);

      setSalesSummary(summaryRes.data);
      setSalesTrend(trendRes.data || []);
      setTopProducts(productsRes.data || []);
      setTopCustomers(customersRes.data || []);
      setPaymentMethods(paymentRes.data || []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  if (loading) {
    return (
      <div className="container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main">
          <Header />
          <div className="loading">Loading Analytics...</div>
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

        {/* Analytics Header */}
        <div className="analytics-header">
          <h1>📊 Sales Analytics Dashboard</h1>
          <button 
            className="btn-refresh"
            onClick={fetchAnalyticsData}
            title="Refresh Data"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Summary Cards */}
        {salesSummary && (
          <div className="analytics-cards">
            <div className="card-item">
              <h3>Total Revenue</h3>
              <p className="card-value">${salesSummary.total_revenue?.toFixed(2) || "0.00"}</p>
              <small>All Time</small>
            </div>
            <div className="card-item">
              <h3>Total Orders</h3>
              <p className="card-value">{salesSummary.total_orders || 0}</p>
              <small>Completed Orders</small>
            </div>
            <div className="card-item">
              <h3>Avg. Order Value</h3>
              <p className="card-value">${salesSummary.avg_revenue?.toFixed(2) || "0.00"}</p>
              <small>Per Order</small>
            </div>
            <div className="card-item">
              <h3>Today's Revenue</h3>
              <p className="card-value">${salesSummary.today_revenue?.toFixed(2) || "0.00"}</p>
              <small>{salesSummary.today_orders || 0} Orders</small>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📈 Overview
          </button>
          <button 
            className={`tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            🛍️ Top Products
          </button>
          <button 
            className={`tab ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            👥 Top Customers
          </button>
          <button 
            className={`tab ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            💳 Payments
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="chart-container">
              <h3>Sales Trend (Daily)</h3>
              {salesTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrend}>
                    <CartesianGrid stroke="#333" />
                    <XAxis dataKey="period" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ background: "#1f2b3a", border: "1px solid #444" }}
                      cursor={{ stroke: "#666" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>No trend data available</p>
              )}
            </div>
          </div>
        )}

        {/* Top Products Tab */}
        {activeTab === "products" && (
          <div className="tab-content">
            <div className="table-container">
              <h3>Top 10 Products by Sales</h3>
              {topProducts.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Qty Sold</th>
                      <th>Times Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, idx) => (
                      <tr key={idx}>
                        <td>{product.name}</td>
                        <td>${product.price?.toFixed(2) || "0.00"}</td>
                        <td>{product.qty_sold || 0}</td>
                        <td>{product.times_sold || 0}</td>
                        <td>${product.revenue?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No product data available</p>
              )}
            </div>

            {topProducts.length > 0 && (
              <div className="chart-container">
                <h3>Product Sales Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProducts.slice(0, 6)}
                      dataKey="qty_sold"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {topProducts.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Top Customers Tab */}
        {activeTab === "customers" && (
          <div className="tab-content">
            <div className="table-container">
              <h3>Top 10 Customers</h3>
              {topCustomers.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Avg Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer, idx) => (
                      <tr key={idx}>
                        <td>{customer.name}</td>
                        <td>{customer.email || "N/A"}</td>
                        <td>{customer.phone || "N/A"}</td>
                        <td>{customer.total_orders}</td>
                        <td>${customer.total_spent?.toFixed(2) || "0.00"}</td>
                        <td>${customer.avg_spent?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No customer data available</p>
              )}
            </div>

            {topCustomers.length > 0 && (
              <div className="chart-container">
                <h3>Top Customers by Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCustomers.slice(0, 10)}>
                    <CartesianGrid stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ background: "#1f2b3a", border: "1px solid #444" }}
                    />
                    <Bar dataKey="total_spent" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payments" && (
          <div className="tab-content">
            <div className="table-container">
              <h3>Payment Methods Analysis</h3>
              {paymentMethods.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Payment Method</th>
                      <th>Transactions</th>
                      <th>Total Amount</th>
                      <th>Avg Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((method, idx) => (
                      <tr key={idx}>
                        <td>{method.method}</td>
                        <td>{method.transactions}</td>
                        <td>${method.total?.toFixed(2) || "0.00"}</td>
                        <td>${method.avg?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No payment data available</p>
              )}
            </div>

            {paymentMethods.length > 0 && (
              <div className="chart-container">
                <h3>Payment Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      dataKey="total"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
