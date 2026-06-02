import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const OrderSuccess = ({ orderData }) => {
  const navigate = useNavigate();
  const [printReady, setPrintReady] = useState(false);

  useEffect(() => {
    // Clear cart from localStorage
    localStorage.removeItem("foodieCart");
    // Save last order
    localStorage.setItem("lastOrder", JSON.stringify(orderData));
    setPrintReady(true);
  }, [orderData]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    localStorage.removeItem("lastOrder");
    navigate("/shop");
  };

  if (!orderData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Loading order confirmation...</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Success Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px", animation: "bounce 0.6s", animationIterationCount: "1" }}>
            ✅
          </div>
          <h1 style={{ marginBottom: "12px", color: "#4CAF50", fontSize: "2rem" }}>
            Payment Successful!
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "8px" }}>
            Thank you for your order
          </p>
          <p style={{ color: "#999", fontSize: "0.95rem" }}>
            Your order has been confirmed and will be delivered soon.
          </p>
        </div>

        {/* Receipt Content */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {/* Receipt Header */}
          <div style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)", color: "white", padding: "30px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🍕 FOODIE</div>
            <h2 style={{ margin: "0", fontSize: "1.3rem" }}>Order Receipt</h2>
          </div>

          {/* Receipt Body */}
          <div style={{ padding: "30px" }}>
            {/* Order & Date Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px", paddingBottom: "30px", borderBottom: "2px solid #eee" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", color: "#999", fontSize: "0.9rem", textTransform: "uppercase" }}>Order Number</p>
                <p style={{ margin: "0", fontSize: "1.8rem", fontWeight: "700", color: "#FF6B35" }}>
                  #{orderData.order_id}
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 8px 0", color: "#999", fontSize: "0.9rem", textTransform: "uppercase" }}>Order Date</p>
                <p style={{ margin: "0", fontSize: "1.1rem", color: "#333", fontWeight: "600" }}>
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{ marginBottom: "40px", paddingBottom: "30px", borderBottom: "2px solid #eee" }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#333", textTransform: "uppercase", fontSize: "0.9rem", fontWeight: "700" }}>
                📍 Delivery Address
              </h3>
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #FF6B35" }}>
                <p style={{ margin: "0", color: "#333", fontWeight: "600" }}>
                  {orderData.customer.firstName} {orderData.customer.lastName}
                </p>
                <p style={{ margin: "8px 0 0 0", color: "#666", lineHeight: "1.6" }}>
                  {orderData.customer.address}<br />
                  {orderData.customer.city}, {orderData.customer.zipCode}<br />
                  📞 {orderData.customer.phone}<br />
                  📧 {orderData.customer.email}
                </p>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: "40px", paddingBottom: "30px", borderBottom: "2px solid #eee" }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#333", textTransform: "uppercase", fontSize: "0.9rem", fontWeight: "700" }}>
                🍕 Order Items
              </h3>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#666", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" }}>Item</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#666", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", width: "80px" }}>Qty</th>
                    <th style={{ padding: "12px", textAlign: "right", color: "#666", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", width: "100px" }}>Price</th>
                    <th style={{ padding: "12px", textAlign: "right", color: "#666", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", width: "100px" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", textAlign: "left", color: "#333", fontWeight: "500" }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#666" }}>
                        {item.qty || 1}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#666" }}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#FF6B35" }}>
                        ${((item.qty || 1) * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ marginBottom: "40px", paddingBottom: "30px", borderBottom: "2px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "150px", marginBottom: "12px" }}>
                <span style={{ color: "#666" }}>Subtotal</span>
                <span style={{ color: "#333", fontWeight: "600", width: "120px", textAlign: "right" }}>
                  ${orderData.subtotal.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "150px", marginBottom: "16px" }}>
                <span style={{ color: "#666" }}>Tax (10%)</span>
                <span style={{ color: "#333", fontWeight: "600", width: "120px", textAlign: "right" }}>
                  ${orderData.tax.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "150px", padding: "16px 0", borderTop: "2px solid #eee", borderBottom: "2px solid #eee" }}>
                <span style={{ color: "#FF6B35", fontSize: "1.2rem", fontWeight: "700" }}>Total</span>
                <span style={{ color: "#FF6B35", fontSize: "1.2rem", fontWeight: "700", width: "120px", textAlign: "right" }}>
                  ${orderData.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: "40px", paddingBottom: "30px", borderBottom: "2px solid #eee" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #FF6B35" }}>
                <p style={{ margin: "0 0 8px 0", color: "#999", fontSize: "0.9rem", textTransform: "uppercase" }}>Payment Method</p>
                <p style={{ margin: "0", fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>
                  {orderData.paymentMethod === "credit-card" && "💳 Credit/Debit Card"}
                  {orderData.paymentMethod === "paypal" && "🅿️ PayPal"}
                  {orderData.paymentMethod === "cash" && "💰 Cash on Delivery"}
                </p>
              </div>
            </div>

            {/* Status & Message */}
            <div style={{ backgroundColor: "#f0fdf4", borderLeft: "4px solid #4CAF50", padding: "20px", borderRadius: "8px", marginBottom: "30px", textAlign: "center" }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "1.1rem", fontWeight: "600", color: "#2e7d32" }}>
                ✓ Payment Confirmed
              </p>
              <p style={{ margin: "0", color: "#555", lineHeight: "1.6" }}>
                Your order has been successfully processed. <br />
                We will prepare your order and deliver it shortly. <br />
                You will receive updates via email.
              </p>
            </div>

            {/* Reference Info */}
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "30px", fontSize: "0.9rem", color: "#666", textAlign: "center", borderLeft: "4px solid #FF6B35" }}>
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Order Reference:</strong> {orderData.order_id}
              </p>
              <p style={{ margin: "0" }}>
                Please keep this receipt for your records. You can track your order using the order number above.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ padding: "30px", backgroundColor: "#f8fafc", borderTop: "2px solid #eee", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={handlePrintReceipt}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "16px 24px",
                background: "#FF6B35",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🖨️ Print Receipt
            </button>
            <button
              onClick={handleContinueShopping}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "16px 24px",
                background: "white",
                color: "#FF6B35",
                border: "2px solid #FF6B35",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🛒 Continue Shopping
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: "center", marginTop: "30px", color: "#999", fontSize: "0.9rem" }}>
          <p>Thank you for your business! 🙏</p>
          <p>Questions? Contact us at support@foodie.com or call 1-800-FOODIE</p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background-color: white;
            margin: 0;
            padding: 0;
          }
          * {
            box-shadow: none;
          }
          button {
            display: none;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
