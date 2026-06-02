import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../services/api";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useNavigate } from "react-router-dom";

import "./SaleReport.css";

const SaleReport = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchReport = async () => {
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

    fetchReport();
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || order.paid_amount || 0), 0);
  const totalOrders = orders.length;
  const pageCount = Math.max(1, Math.ceil(totalOrders / pageSize));
  const pagedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showingFrom = totalOrders === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(totalOrders, currentPage * pageSize);

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="pos-header">
          <h1>Sales Report</h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ color: "#555", fontWeight: 600 }}>Page {currentPage} / {pageCount}</span>
            <span style={{ color: "#777" }}>Showing {showingFrom}-{showingTo} of {totalOrders}</span>
            <button
              className="btn-home btn-saleDetails"
              onClick={() => navigate("/report/details")}
              title="View Sale Details"
            >
              🧾 Sale Details
            </button>

            <button
              className="btn-home btn-closeReport"
              onClick={() => navigate("/report/close")}
              title="Close Report"
            >
              📊 Close Report
            </button>

            <button
              className="btn-home"
              onClick={() => navigate("/pos")}
              title="Go to Home"
            >
              POS Sale
            </button>
          </div>
        </div>

        {error && <div className="report-error">{error}</div>}

        {loading ? (
          <p>Loading sales report...</p>
        ) : (
          <>
            <div className="report-summary">
              <div className="summary-card">
                <h3>Total Orders</h3>
                <p>{totalOrders}</p>
              </div>
              <div className="summary-card">
                <h3>Total Sales</h3>
                <p>${totalSales.toFixed(2)}</p>
              </div>
            </div>

            <table className="sales-report-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Customer</th>
                  {/* <th>Description</th> */}
                  <th>Payment</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.invoice_number || `INV-${order.order_id}`}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>{order.cust_email || "POS"}</td>
                    {/* { <td>{order.description}</td> }// Show item details if available, otherwise show description or N/A */}
                    <td>{order.payment_method_code}</td>
                    <td>${Number(order.discount_amount || 0).toFixed(2)}</td>
                    <td>${Number(order.total_amount || order.paid_amount || 0).toFixed(2)}</td>
                    <td>{order.order_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-buttons">
              <button
                className="btn-home"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <button
                className="btn-home"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaleReport;
