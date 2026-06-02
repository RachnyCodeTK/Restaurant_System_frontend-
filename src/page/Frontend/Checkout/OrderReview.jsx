import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const OrderReview = ({ cartItems, formData, onConfirm }) => {
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * (item.qty || 1),
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    setOrderSummary({ subtotal, tax, total });
  }, [cartItems]);

  const handleEdit = () => {
    navigate("/checkout", { state: { step: 1 } });
  };

  const handleProceed = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          <div style={{ flex: 1, height: "8px", background: "#4CAF50", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "8px", background: "#4CAF50", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "8px", background: "#FF6B35", borderRadius: "4px" }}></div>
        </div>

        <h1 style={{ marginBottom: "30px", color: "#333" }}>📋 Review Your Order</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px" }}>
          {/* Order Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Delivery Section */}
            <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: "0", color: "#333", fontSize: "1.2rem" }}>📍 Delivery Address</h2>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "8px 16px",
                    background: "white",
                    color: "#FF6B35",
                    border: "1px solid #FF6B35",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}
                >
                  Edit
                </button>
              </div>
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #FF6B35" }}>
                <p style={{ margin: "8px 0", color: "#555" }}>
                  <strong>{formData.firstName} {formData.lastName}</strong>
                </p>
                <p style={{ margin: "8px 0", color: "#666" }}>{formData.address}</p>
                <p style={{ margin: "8px 0", color: "#666" }}>{formData.city}, {formData.zipCode}</p>
                <p style={{ margin: "8px 0", color: "#666" }}>📞 {formData.phone}</p>
                <p style={{ margin: "8px 0", color: "#666" }}>📧 {formData.email}</p>
              </div>
            </div>

            {/* Items Section */}
            <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              <h2 style={{ marginBottom: "20px", color: "#333", fontSize: "1.2rem" }}>🍕 Order Items</h2>
              <div style={{ display: "flex", gap: "20px", paddingBottom: "15px", borderBottom: "2px solid #eee", marginBottom: "15px", fontWeight: "600", color: "#666" }}>
                <div style={{ flex: 1 }}>Item</div>
                <div style={{ width: "80px", textAlign: "center" }}>Qty</div>
                <div style={{ width: "100px", textAlign: "right" }}>Price</div>
                <div style={{ width: "100px", textAlign: "right" }}>Subtotal</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "20px", paddingBottom: "12px", borderBottom: "1px solid #eee", marginBottom: "12px", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: "#333" }}>{item.name}</strong>
                  </div>
                  <div style={{ width: "80px", textAlign: "center", color: "#666" }}>
                    {item.qty || 1}
                  </div>
                  <div style={{ width: "100px", textAlign: "right", color: "#666" }}>
                    ${item.price.toFixed(2)}
                  </div>
                  <div style={{ width: "100px", textAlign: "right", fontWeight: "600", color: "#FF6B35" }}>
                    ${((item.qty || 1) * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Section */}
            <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: "0", color: "#333", fontSize: "1.2rem" }}>💳 Payment Method</h2>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "8px 16px",
                    background: "white",
                    color: "#FF6B35",
                    border: "1px solid #FF6B35",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}
                >
                  Change
                </button>
              </div>
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #FF6B35" }}>
                <p style={{ margin: "0", color: "#555", fontSize: "1rem", fontWeight: "600" }}>
                  {formData.paymentMethod === "credit-card" && "💳 Credit/Debit Card"}
                  {formData.paymentMethod === "paypal" && "🅿️ PayPal"}
                  {formData.paymentMethod === "cash" && "💰 Cash on Delivery"}
                </p>
                {formData.paymentMethod === "cash" && (
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                    Payment will be collected at delivery
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", height: "fit-content" }}>
            <h3 style={{ marginBottom: "20px", color: "#333", fontSize: "1.1rem" }}>💰 Order Summary</h3>

            <div style={{ marginBottom: "15px", paddingBottom: "12px", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#666" }}>
                <span>Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                <span>Tax (10%)</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.3rem", color: "#FF6B35", marginBottom: "30px" }}>
              <span>Total</span>
              <span>${orderSummary.total.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleProceed}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#FF6B35",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ✓ Proceed to Payment
              </button>
              <button
                onClick={handleEdit}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "white",
                  color: "#FF6B35",
                  border: "2px solid #FF6B35",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ← Back
              </button>
            </div>

            {/* Order Info */}
            <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", fontSize: "0.85rem", color: "#666", textAlign: "center" }}>
              <p style={{ margin: "0", lineHeight: "1.5" }}>
                Your order will be prepared and delivered to the address provided.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
