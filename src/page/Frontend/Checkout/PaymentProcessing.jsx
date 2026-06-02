import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const PaymentProcessing = ({ cartItems, formData, orderSummary, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      // Validation
      if (formData.paymentMethod === "credit-card") {
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
          throw new Error("Please fill in all card details");
        }
        if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
          throw new Error("Card number must be 16 digits");
        }
      } else if (formData.paymentMethod === "paypal") {
        if (!formData.paypalEmail) {
          throw new Error("Please enter your PayPal email");
        }
      }

      // Prepare order payload
      const orderPayload = {
        cust_id: formData.cust_id || null,
        cust_email: formData.email,
        delivery_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        items: cartItems.map(item => ({
          prd_id: item.id,
          item_qty: item.qty || 1,
          item_price: item.price
        })),
        total_amount: orderSummary.total,
        payment_method_code: getPaymentMethodCode(formData.paymentMethod),
        description: cartItems.map(item => `${item.name || item.prd_name || 'Item'} x${item.qty || 1}`).join(', ')
      };

      // Send to backend
      const response = await fetch("http://localhost:3000/api/customer/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Payment processing failed");
      }

      const result = await response.json();

      // Success
      setPaymentStatus("success");
      
      if (onPaymentSuccess) {
        onPaymentSuccess({
          order_id: result.data.order_id,
          subtotal: orderSummary.subtotal,
          tax: orderSummary.tax,
          total: orderSummary.total,
          customer: formData,
          items: cartItems,
          paymentMethod: formData.paymentMethod
        });
      }

    } catch (err) {
      console.error("Payment error:", err);
      setPaymentStatus("error");
      setErrorMessage(err.message || "Payment processing failed");
      setIsProcessing(false);
    }
  };

  const getPaymentMethodCode = (method) => {
    const methodMap = {
      "credit-card": "CARD",
      "paypal": "PAYPAL",
      "cash": "CASH"
    };
    return methodMap[method] || "CARD";
  };

  if (paymentStatus === "success") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
        <div style={{ textAlign: "center", backgroundColor: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", maxWidth: "500px", width: "100%" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px", animation: "bounce 0.6s" }}>✅</div>
          <h1 style={{ marginBottom: "12px", color: "#4CAF50", fontSize: "1.8rem" }}>Payment Processing</h1>
          <p style={{ color: "#666", marginBottom: "20px", fontSize: "1rem" }}>Your order is being processed...</p>
          <div style={{ padding: "16px", backgroundColor: "#f0f8f0", borderRadius: "8px", marginBottom: "20px" }}>
            <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
              Order ID: <strong>#{orderSummary.orderId}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          <div style={{ flex: 1, height: "8px", background: "#4CAF50", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "8px", background: "#4CAF50", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "8px", background: "#4CAF50", borderRadius: "4px" }}></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px" }}>
          {/* Payment Form */}
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
            <h2 style={{ marginBottom: "30px", color: "#333" }}>💳 Payment Details</h2>

            {errorMessage && (
              <div style={{ background: "#ffebee", color: "#c62828", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <div>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>Payment Failed</p>
                  <p style={{ margin: "0", fontSize: "0.9rem" }}>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Payment Method Display */}
            <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", borderLeft: "4px solid #FF6B35" }}>
              <p style={{ margin: "0", color: "#666" }}>
                <strong>Selected Payment Method:</strong>
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "1.1rem", color: "#333", fontWeight: "600" }}>
                {formData.paymentMethod === "credit-card" && "💳 Credit/Debit Card"}
                {formData.paymentMethod === "paypal" && "🅿️ PayPal"}
                {formData.paymentMethod === "cash" && "💰 Cash on Delivery"}
              </p>
            </div>

            {/* Card Details */}
            {formData.paymentMethod === "credit-card" && (
              <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ margin: "0 0 8px 0", color: "#555", fontWeight: "600" }}>Card Number</p>
                  <p style={{ margin: "0", color: "#666", fontSize: "1.1rem", letterSpacing: "2px" }}>
                    ••••  ••••  ••••  {formData.cardNumber.slice(-4)}
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div>
                    <p style={{ margin: "0 0 8px 0", color: "#555", fontWeight: "600" }}>Expiry</p>
                    <p style={{ margin: "0", color: "#666" }}>{formData.cardExpiry}</p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 8px 0", color: "#555", fontWeight: "600" }}>CVC</p>
                    <p style={{ margin: "0", color: "#666" }}>•••</p>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Details */}
            {formData.paymentMethod === "paypal" && (
              <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 8px 0", color: "#555", fontWeight: "600" }}>PayPal Email</p>
                <p style={{ margin: "0", color: "#666" }}>{formData.paypalEmail}</p>
              </div>
            )}

            {/* Cash on Delivery */}
            {formData.paymentMethod === "cash" && (
              <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f0f8f0", borderRadius: "8px", borderLeft: "4px solid #4CAF50" }}>
                <p style={{ margin: "0", color: "#2e7d32", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  💰 You will pay <strong>${orderSummary.total.toFixed(2)}</strong> when your order is delivered. Please have the exact amount ready.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("/checkout", { state: { step: 2 } })}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: "white",
                  color: "#FF6B35",
                  border: "2px solid #FF6B35",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                ← Back
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: isProcessing ? "#999" : "#FF6B35",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  opacity: isProcessing ? 0.8 : 1
                }}
              >
                {isProcessing ? "🔄 Processing Payment..." : "✓ Complete Payment"}
              </button>
            </div>

            <p style={{ marginTop: "20px", fontSize: "0.85rem", color: "#999", textAlign: "center" }}>
              ✓ Your payment information is secure and encrypted
            </p>
          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", height: "fit-content" }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Order Summary</h3>

            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.9rem" }}>
                  <div>
                    <p style={{ margin: "0", color: "#555" }}>{item.name}</p>
                    <p style={{ margin: "4px 0 0 0", color: "#999", fontSize: "0.85rem" }}>x{item.qty || 1}</p>
                  </div>
                  <div style={{ fontWeight: "600", color: "#333" }}>
                    ${((item.qty || 1) * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#666", fontSize: "0.9rem" }}>
              <span>Subtotal</span>
              <span>${orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", paddingBottom: "12px", borderBottom: "2px solid #eee", color: "#666", fontSize: "0.9rem" }}>
              <span>Tax (10%)</span>
              <span>${orderSummary.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.2rem", color: "#FF6B35" }}>
              <span>Total</span>
              <span>${orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
