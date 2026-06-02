import React from "react";
import "./Receipt.css";

/**
 * 🧾 Cambodia Style Receipt
 * props:
 * - cart
 * - onClose
 * - paymentData (includes discount, paid, change)
 */
const Receipt = ({ cart, onClose, paymentData }) => {
  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const discount = paymentData?.discount || 0;
  const finalTotal = paymentData?.finalTotal || total - discount;
  const paid = paymentData?.paid || 0;
  const changeUSD = paymentData?.changeUSD || 0;
  const changeKHR = paymentData?.changeKHR || 0;

  const date = new Date().toLocaleString();

  // 🔥 Fake invoice (you can replace with DB later)
  const invoice = "INV-" + Math.floor(Math.random() * 10000);

  /**
   * 🖨️ Print + Redirect to POS
   */
  const handlePrint = () => {
    window.print();

    setTimeout(() => {
      window.location.href = "/pos"; // 🔥 redirect to POS sale page
    }, 500);
  };

  return (
    <div className="receipt-overlay">
      <div className="receipt-paper">

        {/* 🏪 Store Info */}
        <div className="center">
          <h2>FOODIE KITCHEN</h2>
          <p>Phnom Penh, Cambodia</p>
          <p>Tel: 012 345 678</p>
        </div>

        <div className="line"></div>

        {/* Info */}
        <div className="info">
          <p>Invoice: {invoice}</p>
          <p>Date: {date}</p>
          <p>Cashier: Admin</p>
        </div>

        <div className="line"></div>

        {/* Items */}
        <div className="receipt-info">
          {/* <p>Invoice: {paymentData?.invoice || paymentData?.orderId || "N/A"}</p> */}
          {/* <p>Description: {paymentData?.description || "POS sale"}</p> */}
        </div>

        <div className="receipt-labels">
          <p>Name</p>
          <p>Qty</p>
          <p>Total</p>
        </div>

        <div className="items">
          {cart.map((i) => (
            <div key={i.prd_id || i.id} className="receipt-row">
              <div className="receipt-col name-col">
                <strong>{i.prd_name || i.name}</strong>
                <div className="item-meta">${i.price} x {i.qty}</div>
              </div>
              <div className="receipt-col qty-col">{i.qty}</div>
              <div className="receipt-col total-col">${(i.qty * i.price).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="line"></div>

        {/* Total with Discount */}
        <div className="total">
          <p>Subtotal:</p>
          <p>${total.toFixed(2)}</p>
        </div>

        {discount > 0 && (
          <div className="discount-section">
            <p>Discount:</p>
            <p>-${discount.toFixed(2)}</p>
          </div>
        )}

        <div className="line"></div>

        {/* Final Total */}
        <div className="total">
          <p>Final Total:</p>
          <p>${finalTotal.toFixed(2)}</p>
        </div>

        {/* Payment (simple now, can connect later) */}
        <div className="payment-info">
          <p>Paid (USD): ${paid.toFixed(2)}</p>
          <p>Change (USD): ${changeUSD.toFixed(2)}</p>
          <p>Change (KHR): ៛{changeKHR.toLocaleString()}</p>
        </div>

        <div className="line"></div>

        {/* Footer */}
        <div className="center">
          <p>Thank You 🙏</p>
          <p>Please come again</p>
        </div>

        {/* Buttons (not printed) */}
        <div className="receipt-actions no-print">
          <button className="btn cancel" onClick={onClose}>
            ❌ Cancel
          </button>

          <button className="btn print" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>

      </div>
    </div>
  );
};

export default Receipt;