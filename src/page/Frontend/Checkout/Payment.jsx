import React, { useState } from "react";
import { placeOrder } from "../../../services/api";

const rate = 4100;

const Payment = ({ cart, setShowReceipt, setPaymentData, onReset }) => {
  const [usd, setUsd] = useState(0);
  const [khr, setKhr] = useState(0);
  const [discount, setDiscount] = useState(0);

  /**
   * 💰 Calculate total
   */
  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  /**
   * ➖ Apply discount
   */
  const finalTotal = total - discount;

  /**
   * 💵 Convert payment
   */
  const paid = usd + khr / rate;

  const change = paid - finalTotal;
  
  /**
   * 💱 Convert change to both currencies
   */
  const changeUSD = change > 0 ? change : 0;
  const changeKHR = changeUSD * rate;

  /**
   * 🧾 Handle Pay
   */
  const handlePay = async () => {
    if (paid < finalTotal) {
      alert("Not enough money!");
      return;
    }

    const invoice = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const description = cart.map(item => `${item.prd_name || item.name} x${item.qty}`).join(', ');

    const orderPayload = {
      cust_email: "pos@foodiekitchen.local",
      delivery_address: "POS Sale",
      items: cart.map((item) => ({
        prd_id: item.prd_id || item.id,
        item_qty: item.qty,
        item_price: item.price
      })),
      total_amount: finalTotal,
      discount_amount: discount,
      paid_amount: paid,
      change_amount: changeUSD,
      currency: "USD",
      payment_method_code: usd > 0 ? "CARD" : khr > 0 ? "CASH" : "CASH",
      invoice_number: invoice,
      description
    };

    try {
      const response = await placeOrder(orderPayload);
      const savedOrder = response.data;

      setPaymentData({
        invoice,
        description,
        discount,
        total,
        finalTotal,
        paid,
        changeUSD,
        changeKHR,
        orderId: savedOrder.order_id,
        paymentMethod: usd > 0 ? "CARD" : khr > 0 ? "CASH" : "CASH"
      });

      setShowReceipt(true);
    } catch (err) {
      console.error("POS order save failed:", err);
      alert(`Failed to save sale: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="payment">
      <h3>Total: ${total.toFixed(2)}</h3>

      <label className="input-label">Discount Amount ($)</label>
      <input
        type="number"
        placeholder="0.00"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        step="0.01"
        min="0"
      />

      <h3>Final: ${finalTotal.toFixed(2)}</h3>

      <label className="input-label">USD Amount</label>
      <input
        type="number"
        placeholder="0.00"
        value={usd}
        onChange={(e) => setUsd(Number(e.target.value))}
        step="0.01"
        min="0"
      />
      
      <label className="input-label">KHR Amount (៛)</label>
      <input
        type="number"
        placeholder="0"
        value={khr}
        onChange={(e) => setKhr(Number(e.target.value))}
        step="1"
        min="0"
      />

      <div className="change-display">
        <h3>Change:</h3>
        <p className="change-usd">${changeUSD.toFixed(2)}</p>
        <p className="change-khr">៛{changeKHR.toLocaleString()}</p>
      </div>

      <button className="pay-btn" onClick={handlePay}>
        💳 Pay Now
      </button>
    </div>
  );
};

export default Payment;