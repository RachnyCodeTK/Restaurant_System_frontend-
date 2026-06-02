import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage and listen for changes
  useEffect(() => {
    // Load cart on mount
    const loadCart = () => {
      const storedCart = localStorage.getItem("foodieCart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
        }
      }
    };

    loadCart();

    // Listen for storage changes from other components
    const handleStorageChange = () => {
      loadCart();
    };

    // Listen for visibility changes (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Save cart to localStorage whenever it changes (but skip initial empty state)
  useEffect(() => {
    // Only save if cartItems has been explicitly modified (not initial state)
    const storedCart = localStorage.getItem("foodieCart");
    const currentCart = JSON.stringify(cartItems);
    if (storedCart !== currentCart && cartItems.length > 0) {
      localStorage.setItem("foodieCart", currentCart);
    }
  }, [cartItems]);

  const removeItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQty = (productId, action) => {
    setCartItems(cartItems.map(item => {
      if (item.id === productId) {
        const newQty = action === "inc" ? (item.qty || 1) + 1 : Math.max(1, (item.qty || 1) - 1);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "20px", backgroundColor: "#f5f5f5" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🛒</div>
          <h1 style={{ marginBottom: "10px", color: "#333" }}>Your Cart is Empty</h1>
          <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>Add some delicious food to get started!</p>
          <button
            onClick={() => navigate("/shop")}
            style={{
              padding: "12px 30px",
              background: "#FF6B35",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "30px", color: "#333" }}>🛒 Shopping Cart</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px", marginBottom: "30px" }}>
          {/* Cart Items */}
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: "20px", color: "#555" }}>Order Items ({cartItems.length})</h3>

            <div style={{ display: "flex", gap: "20px", paddingBottom: "15px", borderBottom: "2px solid #eee", marginBottom: "15px", fontWeight: "600", color: "#666" }}>
              <div style={{ flex: 1 }}>Name</div>
              <div style={{ width: "80px" }}>Qty</div>
              <div style={{ width: "100px" }}>Subtotal</div>
              <div style={{ width: "50px" }}></div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "20px", paddingBottom: "15px", borderBottom: "1px solid #eee", marginBottom: "15px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <p style={{ fontSize: "0.9rem", color: "#999", margin: "5px 0" }}>${item.price} x {item.qty || 1}</p>
                </div>

                <div style={{ width: "80px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
                    <button
                      onClick={() => updateQty(item.id, "dec")}
                      style={{
                        flex: 1,
                        padding: "5px",
                        background: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      −
                    </button>
                    <span style={{ flex: 1, textAlign: "center", fontSize: "0.9rem" }}>{item.qty || 1}</span>
                    <button
                      onClick={() => updateQty(item.id, "inc")}
                      style={{
                        flex: 1,
                        padding: "5px",
                        background: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ width: "100px", textAlign: "right" }}>
                  <strong>${((item.qty || 1) * item.price).toFixed(2)}</strong>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    width: "50px",
                    padding: "5px",
                    background: "#ffebee",
                    border: "none",
                    color: "#c62828",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1.2rem"
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", height: "fit-content" }}>
            <h3 style={{ marginBottom: "20px", color: "#555" }}>Order Summary</h3>

            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", color: "#666" }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", color: "#666" }}>
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div style={{ marginBottom: "20px", paddingTop: "15px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "1.1rem" }}>
              <span>Total:</span>
              <span style={{ color: "#FF6B35" }}>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate(user ? "/checkout" : "/login", { state: { from: "/checkout" } })}
              style={{
                width: "100%",
                padding: "12px",
                background: "#FF6B35",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600",
                marginBottom: "10px"
              }}
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>

            <button
              onClick={() => navigate("/shop")}
              style={{
                width: "100%",
                padding: "12px",
                background: "white",
                color: "#FF6B35",
                border: "1px solid #FF6B35",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
