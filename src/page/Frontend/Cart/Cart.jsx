
import React from "react";

const Cart = ({ cart, removeItem, updateQty }) => {
  return (
    <div className="cart">
      <h3>Order Items</h3>

      <div className="cart-items-list">
        {cart.map((item) => (
          <div key={item.prd_id} className="cart-item-row">

            {/* NAME */}
            <div>
              <strong>{item.name}</strong>
              <p>${item.price}</p>
            </div>

            {/* QTY */}
            <div>
              <button onClick={() => updateQty(item.prd_id, "dec")}>
                -
              </button>

              <span style={{ margin: "0 10px" }}>
                {item.qty}
              </span>

              <button onClick={() => updateQty(item.prd_id, "inc")}>
                +
              </button>
            </div>

            {/* TOTAL */}
            <div>
              <strong>
                ${(item.qty * item.price).toFixed(2)}
              </strong>

              <button
                onClick={() => removeItem(item.prd_id)}
                style={{ marginLeft: "10px" }}
              >
                ❌
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;