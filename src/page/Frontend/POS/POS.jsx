
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../ProductDetail/ProductList";
import Cart from "../Cart/Cart";
import Payment from "../Checkout/Payment";
import Receipt from "../Checkout/Receipt"; 
import "./POS.css";

const POS = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  /**
   * ✅ ADD TO CART
   */
  const addToCart = (product) => {
    const exist = cart.find((i) => i.prd_id === product.prd_id);

    if (exist) {
      setCart(
        cart.map((i) =>
          i.prd_id === product.prd_id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
        },
      ]);
    }
  };

  /**
   * ❌ REMOVE ITEM
   */
  const removeItem = (id) => {
    setCart(cart.filter((i) => i.prd_id !== id));
  };

  /**
   * 🔼🔽 UPDATE QTY
   */
  const updateQty = (id, type) => {
    setCart(
      cart
        .map((i) => {
          if (i.prd_id === id) {
            if (type === "inc") {
              return { ...i, qty: i.qty + 1 };
            }

            if (type === "dec") {
              return { ...i, qty: i.qty - 1 };
            }
          }
          return i;
        })
        .filter((i) => i.qty > 0) // remove if 0
    );
  };

  /**
   * 🔄 RESET POS
   */
  const handleResetPOS = () => {
    setCart([]);
    setShowReceipt(false);
  };

  return (
    <div className="pos-wrapper">
      {/* HEADER */}
      <div className="pos-header">
        <h1>POS Sale System</h1>

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
          onClick={() => navigate("/")}
          title="Go to Home"
        >
          🏠 Home
        </button>
      </div>

      {/* BODY */}
      <div className="pos-container">
        <ProductList addToCart={addToCart} />

        <Cart
          cart={cart}
          removeItem={removeItem}
          updateQty={updateQty}
        />

        <Payment
          cart={cart}
          setShowReceipt={setShowReceipt}
          setPaymentData={setPaymentData}
          onReset={handleResetPOS}
        />

        {showReceipt && (
          <Receipt
            cart={cart}
            paymentData={paymentData}
            onClose={() => {
              setShowReceipt(false);
              handleResetPOS();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default POS;