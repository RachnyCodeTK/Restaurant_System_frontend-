import React, { useEffect, useState } from "react";
import { getAllOrders } from "../services/api";

const OrderChart = () => {
  const [counts, setCounts] = useState({ completed: 0, pending: 0, cancelled: 0, other: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        const orders = response.data || [];
        const statusCounts = orders.reduce(
          (acc, order) => {
            const status = (order.order_status || "other").toLowerCase();
            if (status.includes("completed")) acc.completed += 1;
            else if (status.includes("pending")) acc.pending += 1;
            else if (status.includes("cancel")) acc.cancelled += 1;
            else acc.other += 1;
            return acc;
          },
          { completed: 0, pending: 0, cancelled: 0, other: 0 }
        );
        setCounts(statusCounts);
      } catch (err) {
        console.error("Failed to load order chart data:", err);
        setError(err.message || "Unable to load order chart data");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const maxCount = Math.max(...Object.values(counts), 1);
  const barHeight = (value) => Math.max(12, Math.round((value / maxCount) * 100));

  return (
    <div className="order-box">
      <h3>Order Chart</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#f87171" }}>{error}</p>
      ) : (
        <div className="bars">
          {[
            { label: "Completed", value: counts.completed, color: "#22c55e" },
            { label: "Pending", value: counts.pending, color: "#f59e0b" },
            { label: "Cancelled", value: counts.cancelled, color: "#ef4444" },
            { label: "Other", value: counts.other, color: "#3b82f6" },
          ].map((item) => (
            <div key={item.label} className="bar" style={{ height: `${barHeight(item.value)}%`, background: item.color }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "#fff" }}>{item.value}</span>
              <small style={{ display: "block", marginTop: "0.5rem", color: "#d1d5db" }}>{item.label}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderChart;