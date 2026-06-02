import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { placeOrder, createKHQR } from "../../../services/api";
import OrderReview from "./OrderReview";
import PaymentProcessing from "./PaymentProcessing";
import OrderSuccess from "./OrderSuccess";
import QRCode from "react-qr-code";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: delivery, 2: payment, 3: confirmation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    paypalEmail: ""
  });

  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, completed
  const [showToast, setShowToast] = useState(false);
  const [khqrString, setKhqrString] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("foodieCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDeliveryInfo = () => {
    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      alert("Please fill in all required fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    // Email is always required (for guest or logged-in customers)
    if (!formData.email) {
      alert("Please enter your email address");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
        alert("Please fill in all card details");
        return false;
      }
      if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Card number must be 16 digits");
        return false;
      }
    } else if (formData.paymentMethod === "paypal") {
      if (!formData.paypalEmail) {
        alert("Please enter your PayPal email");
        return false;
      }
    }
    return true;
  };

  const handleDeliveryNext = () => {
    if (validateDeliveryInfo()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSubmit = () => {
    if (validatePayment()) {
      processPayment();
    }
  };

  const processPayment = async () => {
    setPaymentStatus("processing");

    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      // Prepare order data for API
      const orderPayload = {
        cust_id: user?.customer_id || user?.cust_id || null,
        cust_email: user?.email || user?.cust_email || formData.email,
        delivery_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        items: cartItems.map(item => ({
          prd_id: item.prd_id || item.id,
          item_qty: item.qty || 1,
          item_price: item.price
        })),
        total_amount: Number(total.toFixed(2)),
        paid_amount: Number(total.toFixed(2)),
        payment_method_code: getPaymentMethodCode(formData.paymentMethod),
        description: cartItems.map(item => `${item.name} x${item.qty || 1}`).join(', ')
      };

      const result = await placeOrder(orderPayload);

      // Success - create order data for confirmation
      const invoice = `INV-${result.data.order_id}`;
      const date = new Date().toLocaleString();

      const newOrder = {
        invoice,
        date,
        order_id: result.data.order_id,
        customer: formData,
        items: cartItems,
        subtotal,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
        status: "completed"
      };

      setOrderData(newOrder);
      setPaymentStatus("completed");
      setCurrentStep(3);

      // Save order and clear cart
      localStorage.setItem("lastOrder", JSON.stringify(newOrder));
      localStorage.removeItem("foodieCart");
      setCartItems([]);

    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus("pending");
      alert(`Payment Failed: ${err.message}\n\nPlease try again.`);
    }
  };

  // Helper function to get payment method code
  const getPaymentMethodCode = (method) => {
    const methodMap = {
      'credit-card': 'CARD',
      'paypal': 'PAYPAL',
      'cash': 'CASH',
      'khqr': 'KHQR'
    };
    return methodMap[method] || 'CARD';
  };

  const handlePrintBill = () => {
    try {
      window.print();
    } catch (err) {
      console.warn("Print not available in this environment", err);
    }

    setToastMessage("Bill printed — returning to home...");
    setShowToast(true);

    // Keep the toast visible for 3 seconds, then clear storage and redirect
    setTimeout(() => {
      localStorage.removeItem("foodieCart");
      localStorage.removeItem("lastOrder");
      setShowToast(false);
      navigate("/shop");
    }, 3000);
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
        <div style={{ textAlign: "center", backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", maxWidth: "500px", width: "100%" }}>
          <h1 style={{ marginBottom: "16px" }}>Sign In Required</h1>
          <p style={{ color: "#555", marginBottom: "24px" }}>You must be signed in to complete checkout.</p>
          <button
            onClick={() => navigate("/login", { state: { from: "/checkout" } })}
            style={{ padding: "12px 24px", background: "#FF6B35", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
        <div style={{ textAlign: "center", backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", maxWidth: "500px", width: "100%" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🛒</div>
          <h1 style={{ marginBottom: "16px" }}>Your Cart is Empty</h1>
          <p style={{ color: "#555", marginBottom: "24px" }}>Add items before proceeding to checkout.</p>
          <button
            onClick={() => navigate("/shop")}
            style={{ padding: "12px 24px", background: "#FF6B35", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Order Confirmation
  if (currentStep === 3 && orderData) {
    return (
      <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
          {paymentStatus === "completed" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
                <h1 style={{ marginBottom: "8px", color: "#4CAF50" }}>Payment Successful!</h1>
                <p style={{ color: "#555", marginBottom: "8px" }}>Thank you for your order, {user?.email}</p>
                <p style={{ color: "#999" }}>Your order has been confirmed and will be delivered soon.</p>
              </div>

              <div style={{ backgroundColor: "#b8e0e9", borderRadius: "12px", padding: "30px", marginBottom: "30px", border: "2px solid #261818" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
                  <div>
                    <h3 style={{ color: "#333", marginBottom: "12px" }}>Order Details</h3>
                    <p style={{ margin: "8px 0", color: "#555" }}><strong>Invoice:</strong> {orderData.invoice}</p>
                    <p style={{ margin: "8px 0", color: "#555" }}><strong>Date:</strong> {orderData.date}</p>
                    <p style={{ margin: "8px 0", color: "#555" }}><strong>Status:</strong> <span style={{ color: "#4CAF50", fontWeight: "700" }}>Confirmed</span></p>
                  </div>
                  <div>
                    <h3 style={{ color: "#333", marginBottom: "12px" }}>Delivery Info</h3>
                    <p style={{ margin: "8px 0", color: "#555" }}>{orderData.customer.firstName} {orderData.customer.lastName}</p>
                    <p style={{ margin: "8px 0", color: "#555" }}>{orderData.customer.address}</p>
                    <p style={{ margin: "8px 0", color: "#555" }}>{orderData.customer.city}, {orderData.customer.zipCode}</p>
                    <p style={{ margin: "8px 0", color: "#555" }}>{orderData.customer.phone}</p>
                  </div>
                </div>

                <div style={{ borderTop: "2px solid #433a3a", paddingTop: "20px" }}>
                  <h3 style={{ color: "#333", marginBottom: "12px" }}>Items Ordered</h3>
                  {orderData.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #514444" }}>
                      <div>
                        <strong>{item.name}</strong>
                        {/* <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#666" }}>{item.qty} x ${item.price.toFixed(2)}</p> */}
                      </div>
                      <div style={{ fontWeight: "600" }}>${(item.qty * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "2px solid #ddd", paddingTop: "20px", marginTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span>Tax (10%)</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.2rem", color: "#FF6B35" }}>
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "white", borderRadius: "8px", borderLeft: "4px solid #FF6B35" }}>
                  <p style={{ margin: "0", color: "#555" }}><strong>Payment Method:</strong> {orderData.paymentMethod.replace("-", " ").toUpperCase()}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={handlePrintBill}
                  style={{ flex: 1, minWidth: "200px", padding: "14px 24px", background: "#FF6B35", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}
                >
                  🖨️ Print Bill
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  style={{ flex: 1, minWidth: "200px", padding: "14px 24px", background: "white", color: "#FF6B35", border: "2px solid #FF6B35", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
        {showToast && (
          <div style={{ position: "fixed", right: "20px", bottom: "20px", background: "#333", color: "white", padding: "12px 18px", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 9999 }}>
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // Step 2: Payment
  if (currentStep === 2) {
    return (
      <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Progress Bar */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
            <div style={{ flex: 1, height: "8px", background: "#4CAF50", borderRadius: "4px" }}></div>
            <div style={{ flex: 1, height: "8px", background: "#FF6B35", borderRadius: "4px" }}></div>
            <div style={{ flex: 1, height: "8px", background: "#ddd", borderRadius: "4px" }}></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px" }}>
            {/* Payment Form */}
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <h2 style={{ marginBottom: "30px", color: "#333" }}>💳 Payment Details</h2>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ color: "#555", marginBottom: "15px" }}>Select Payment Method</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  {["credit-card", "paypal", "cash"].map((method) => (
                    <label key={method} style={{ display: "flex", alignItems: "center", padding: "16px", border: formData.paymentMethod === method ? "2px solid #FF6B35" : "1px solid #ddd", borderRadius: "8px", cursor: "pointer", backgroundColor: formData.paymentMethod === method ? "#fff8f5" : "white" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                        style={{ marginRight: "12px", cursor: "pointer", width: "18px", height: "18px" }}
                      />
                      <span style={{ fontWeight: "600", color: "#333" }}>
                        {method === "credit-card" && "💳 Credit/Debit Card"}

                        {method === "paypal" && "🅿️ PayPal"}

                        {method === "cash" && "💰 Cash on Delivery"}

                        {method === "khqr" && "📱 KHQR Payment"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === "credit-card" && (
                <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>Expiry Date</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>CVC</label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="3"
                        style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === "paypal" && (
                <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>PayPal Email</label>
                  <input
                    type="email"
                    name="paypalEmail"
                    value={formData.paypalEmail}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                  />
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem", color: "#666" }}>You will be redirected to PayPal to complete the payment.</p>
                </div>
              )}
              {formData.paymentMethod === "khqr" && (

                <div
                  style={{
                    marginBottom: "30px",
                    padding: "20px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >

                  <button
                    onClick={async () => {

                      try {

                        const subtotal =
                          cartItems.reduce(
                            (sum, item) =>
                              sum + (item.price * (item.qty || 1)),
                            0
                          );

                        const tax = subtotal * 0.1;

                        const total = subtotal + tax;

                        const response =
                          await createKHQR({

                            amount: total.toFixed(2),

                            billNumber:
                              `INV-${Date.now()}`,

                            accountName:
                              "Foodie Restaurant"
                          });

                        if (response.success) {

                          setKhqrString(
                            response.qr
                          );
                        }

                      } catch (err) {

                        console.error(err);

                        alert(
                          "Failed to generate KHQR"
                        );
                      }
                    }}

                    style={{
                      padding: "14px 20px",
                      background: "#FF6B35",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "700",
                      width: "100%"
                    }}
                  >
                    📱 Generate KHQR
                  </button>

                  {khqrString && (

                    <div
                      style={{
                        marginTop: "20px"
                      }}
                    >
                      <QRCode
                        value={khqrString}
                        size={220}
                      />

                      <p
                        style={{
                          marginTop: "15px",
                          color: "#666"
                        }}
                      >
                        Scan with ABA, ACLEDA,
                        Wing, Bakong...
                      </p>
                    </div>
                  )}

                </div>
              )}

              {formData.paymentMethod === "cash" && (
                <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <p style={{ margin: "0", color: "#666" }}>💰 Please have the exact amount ready for the delivery person. They will collect the payment upon delivery.</p>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setCurrentStep(1)}
                  style={{ flex: 1, padding: "14px 24px", background: "white", color: "#FF6B35", border: "2px solid #FF6B35", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}
                >
                  ← Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={paymentStatus === "processing"}
                  style={{ flex: 1, padding: "14px 24px", background: "#FF6B35", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: paymentStatus === "processing" ? "not-allowed" : "pointer", fontSize: "1rem", opacity: paymentStatus === "processing" ? 0.7 : 1 }}
                >
                  {paymentStatus === "processing" ? "🔄 Processing..." : "✓ Complete Purchase"}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", height: "fit-content" }}>
              <h3 style={{ marginBottom: "20px", color: "#333" }}>Order Summary</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #eee", marginBottom: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0", fontSize: "0.9rem", color: "#555" }}>{item.name}</p>
                      {/* <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#999" }}>{item.qty}x ${item.price.toFixed(2)}</p> */}
                    </div>
                    <div style={{ fontWeight: "600", color: "#333" }}>${(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "2px solid #eee", paddingTop: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#666" }}>
                  <span>Subtotal</span>
                  <span>${cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#666" }}>
                  <span>Tax (10%)</span>
                  <span>${(cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) * 0.1).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.1rem", color: "#FF6B35" }}>
                  <span>Total</span>
                  <span>${(cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Delivery Information
  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          <div style={{ flex: 1, height: "8px", background: "#FF6B35", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "8px", background: "#ddd", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "8px", background: "#ddd", borderRadius: "4px" }}></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px" }}>
          {/* Delivery Form */}
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
            <h2 style={{ marginBottom: "30px", color: "#333" }}>📍 Delivery Information</h2>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ color: "#555", marginBottom: "15px" }}>Personal Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="rachny@example.com"
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+8 (55) 123-4567"
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "25px", paddingTop: "25px", borderTop: "2px solid #eee" }}>
              <h3 style={{ color: "#555", marginBottom: "15px" }}>Delivery Address</h3>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Phnom Penh"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: "600" }}>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("/cart")}
                style={{ flex: 1, padding: "14px 24px", background: "white", color: "#FF6B35", border: "2px solid #FF6B35", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}
              >
                ← Back to Cart
              </button>
              <button
                onClick={handleDeliveryNext}
                style={{ flex: 1, padding: "14px 24px", background: "#FF6B35", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}
              >
                Continue to Payment →
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", height: "fit-content" }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Order Summary</h3>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #eee", marginBottom: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>{item.name}</p>
                    {/* <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#999" }}>{item.qty}x ${item.price.toFixed(2)}</p> */}
                  </div>
                  <div style={{ fontWeight: "600", color: "#FF6B35" }}>${(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "2px solid #eee", paddingTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#666" }}>
                <span>Subtotal</span>
                <span>${cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#666" }}>
                <span>Tax (10%)</span>
                <span>${(cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) * 0.1).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.2rem", color: "#FF6B35", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                <span>Total</span>
                <span>${(cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
