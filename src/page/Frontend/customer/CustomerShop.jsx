import { useAuth } from "../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../../services/api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ShopByCollection from "./components/ShopByCollection";
import FeaturePromo from "./components/FeaturePromo";
import ProductGrid from "./components/ProductGrid";
import DealOfDay from "./components/DealOfDay";
import MenuBoard from "./components/MenuBoard";
import PersonalTouch from "./components/PersonalTouch";
import ReviewSection from "./components/ReviewSection";
import Footer from "./components/Footer";
import "./styles/customer-shop.css";

const CustomerShop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("foodieCart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("foodieTheme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  // Load shop orders for history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await getAllOrders();
        // Filter only completed shop orders (exclude POS orders)
        const shopOrders = (response.data || []).filter(order => 
          order.cust_email && 
          order.cust_email !== 'POS' &&
          order.order_status === 'completed'
        );
        setOrders(shopOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // Save cart to localStorage whenever it changes and dispatch custom event
  useEffect(() => {
    localStorage.setItem("foodieCart", JSON.stringify(cartItems));
    // Dispatch custom event so CartPage can listen for updates
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartItems }));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("foodieTheme", darkMode ? "dark" : "light");
    document.body.style.backgroundColor = darkMode ? "#0f172a" : "#ffffff";
    document.body.style.color = darkMode ? "#f8fafc" : "#111827";
  }, [darkMode]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <div className="customer-shop">
      <Navbar cartCount={cartItems.length} navigate={navigate} />
      
      {/* Order History Toggle */}
      {user && (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: darkMode ? "#111827" : "#f9f9f9", borderBottom: `1px solid ${darkMode ? "#334155" : "#ddd"}` }}>
          <button
            onClick={() => setShowOrderHistory(!showOrderHistory)}
            style={{
              padding: "10px 20px",
              background: "#FF6B35",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "600",
              marginRight: "12px"
            }}
          >
            {showOrderHistory ? "Hide" : "View"} Sales Report
          </button>
          <button
            onClick={() => setDarkMode((prevMode) => !prevMode)}
            style={{
              padding: "10px 20px",
              background: darkMode ? "#f8fafc" : "#111827",
              color: darkMode ? "#111827" : "#f8fafc",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Switch to {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      )}

      {/* Sales Report Section */}
      {showOrderHistory && user && (
        <div style={{ padding: "30px 20px", backgroundColor: "#f9f9f9" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>💰 Sales Report</h2>

            {loadingOrders ? (
              <p>Loading sales data...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: "40px" }}>No completed sales yet.</p>
            ) : (
              <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
                      <th style={{ padding: "12px 15px", textAlign: "left", fontWeight: "600", color: "#555" }}>Invoice</th>
                      <th style={{ padding: "12px 15px", textAlign: "left", fontWeight: "600", color: "#555" }}>Date</th>
                      <th style={{ padding: "12px 15px", textAlign: "left", fontWeight: "600", color: "#555" }}>Customer Name</th>
                      <th style={{ padding: "12px 15px", textAlign: "left", fontWeight: "600", color: "#555" }}>Description</th>
                      <th style={{ padding: "12px 15px", textAlign: "left", fontWeight: "600", color: "#555" }}>Payment</th>
                      <th style={{ padding: "12px 15px", textAlign: "right", fontWeight: "600", color: "#555" }}>Total</th>
                      <th style={{ padding: "12px 15px", textAlign: "center", fontWeight: "600", color: "#555" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id} style={{ borderBottom: "1px solid #eee", "&:hover": { backgroundColor: "#fafafa" } }}>
                        <td style={{ padding: "12px 15px", color: "#333" }}>
                          {order.invoice_number || `INV-${order.order_id}`}
                        </td>
                        <td style={{ padding: "12px 15px", color: "#666" }}>
                          {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: "12px 15px", color: "#333" }}>
                          {order.cust_name || order.cust_email || "N/A"}
                        </td>
                        <td style={{ padding: "12px 15px", color: "#666" }}>
                          {(order.item_details || order.description) ? (
                            (order.item_details || order.description).split(', ').slice(0, 2).map((item, idx) => (
                              <div key={idx}>{item}</div>
                            ))
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td style={{ padding: "12px 15px", color: "#555", fontWeight: "500" }}>
                          {order.payment_method_code}
                        </td>
                        <td style={{ padding: "12px 15px", color: "#FF6B35", fontWeight: "600", textAlign: "right" }}>
                          ${Number(order.total_amount || order.paid_amount || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: "12px 15px", textAlign: "center" }}>
                          <span style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            backgroundColor: order.order_status === "completed" ? "#d4edda" : "#fff3cd",
                            color: order.order_status === "completed" ? "#155724" : "#856404"
                          }}>
                            {order.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <Hero navigate={navigate} />
      <Features />
      <ShopByCollection onCategorySelect={handleCategoryFilter} selectedCategory={selectedCategory} />
      <FeaturePromo navigate={navigate} />
      <ProductGrid 
        addToCart={addToCart}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryFilter}
      />
      <DealOfDay navigate={navigate} />
      <MenuBoard />
      <PersonalTouch />
      <ReviewSection />
      <Footer />
    </div>
  );
};

export default CustomerShop;
