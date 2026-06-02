import React, { useEffect, useState } from "react";
import { getAllOrders } from "../services/api";

const SalesChart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        setOrders(response.data || []);
      } catch (err) {
        console.error("Failed to load sales report:", err);
        setError(err.message || "Unable to load sales report");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || order.paid_amount || 0), 0);
  const completedOrders = orders.filter(order => order.order_status === "completed").length;
  const progress = Math.min(100, totalSales > 0 ? (totalSales / 10000) * 100 : 0);

  return (
    <div className="sales-box">
      <h3>Sales Details</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#f87171" }}>{error}</p>
      ) : (
        <>
          <div className="circle" style={{ border: `10px solid ${progress > 60 ? "#22c55e" : "#ef4444"}` }}>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ marginTop: "1rem", color: "#ffffff" }}>
            <p style={{ margin: 0 , color: "#ffffff"}}>Total Revenue</p>
            <h2 style={{ margin: 0 , color: "#ffffff" }}>${totalSales.toFixed(2)}</h2>
            <p style={{ margin: 0, color: "#ffffff", opacity: 0.8 }}>{completedOrders} completed orders</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesChart;