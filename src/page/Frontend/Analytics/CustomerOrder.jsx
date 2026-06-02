import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../../services/api";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import "./SaleReport.css";

const CustomerOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        // Filter only shop orders (exclude POS orders - those without cust_email)
        const shopOrders = (response.data || []).filter(order => order.cust_email && order.cust_email !== 'POS');
        setOrders(shopOrders);
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

  const downloadCsv = (csvString, filename) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesReport = () => {
    const headers = ['Invoice', 'Date', 'Customer', 'Description', 'Payment', 'Discount', 'Total', 'Status'];
    const rows = orders.map((order) => {
      const description = (order.item_details || order.description || 'N/A').replace(/\r?\n/g, ' ');
      const total = Number(order.total_amount || order.paid_amount || 0).toFixed(2);
      return [
        order.invoice_number || `INV-${order.order_id}`,
        new Date(order.created_at).toLocaleString(),
        order.cust_email || 'N/A',
        description,
        order.payment_method_code,
        Number(order.discount_amount || 0).toFixed(2),
        total,
        order.order_status,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    downloadCsv(csvContent, `shop-orders-report-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <Header />

        {error && <div className="report-error">{error}</div>}

        {loading ? (
          <p>Loading shop orders...</p>
        ) : (
          <>
            <div className="report-summary">
              <div className="summary-card">
                <h3>Total Shop Orders</h3>
                <p><b>{totalOrders}</b></p>
              </div>
              <div className="summary-card">
                <h3>Total Sales</h3>
                <p><b>${totalSales.toFixed(2)}</b></p>
              </div>
            </div>

            <div className="report-actions">
              <button className="btn-home btn-export" onClick={exportSalesReport}>
                📤 Export Report
              </button>
              <div className="pagination-info">
                Page {currentPage} of {pageCount}
              </div>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <p>No shop orders found.</p>
              </div>
            ) : (
              <>
                <div className="report-table-wrapper">
                  <table className="sales-report-table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Description</th>
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
                          <td>{order.cust_email || "N/A"}</td>
                          <td>
                            {(order.item_details || order.description) ? (
                              (order.item_details || order.description).split(', ').map((item, index) => (
                                <div key={index}>{item}</div>
                              ))
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>{order.payment_method_code}</td>
                          <td>${Number(order.discount_amount || 0).toFixed(2)}</td>
                          <td>${Number(order.total_amount || order.paid_amount || 0).toFixed(2)}</td>
                          <td>{order.order_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
