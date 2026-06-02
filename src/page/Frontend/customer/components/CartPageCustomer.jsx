import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import Navbar from './Navbar';
import '../styles/CartPage.css';

const CartPageCustomer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage and listen for updates
  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem('foodieCart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (err) {
          console.error('Invalid cart data in localStorage:', err);
          localStorage.removeItem('foodieCart');
        }
      }
    };

    // Load on mount
    loadCart();

    // Listen for storage changes from other tabs/components
    const handleStorageChange = () => {
      loadCart();
    };

    // Listen for visibility changes (when user switches back to this tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCart();
      }
    };

    // Listen for custom cartUpdated event from CustomerShop
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Save cart to localStorage only when explicitly modified
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('foodieCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const removeItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQty = (productId, action) => {
    setCartItems(cartItems.map(item => {
      if (item.id !== productId) return item;
      const currentQty = item.qty || item.quantity || 1;
      const nextQty = action === 'inc' ? currentQty + 1 : Math.max(1, currentQty - 1);
      return { ...item, qty: nextQty, quantity: nextQty };
    }));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price || item.prd_price || 0);
    const qty = Number(item.qty || item.quantity || 1);
    return acc + price * qty;
  }, 0);
  const shipping = 5.00;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <Navbar cartCount={0} navigate={navigate} />
        <div className="cart-empty-message">
          <h2>Your cart is empty</h2>
          <p>Add items from the shop before checking out.</p>
          <button onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <Navbar cartCount={cartItems.length} navigate={navigate} />

      <div className="cart-container-main">
        <div className="cart-content-card">
          <div className="cart-left-section">
            <div className="cart-header">
              <h1>Shopping Cart</h1>
              <span className="item-count">{cartItems.length} Items</span>
            </div>

            <div className="table-header">
              <span className="col-details">PRODUCT DETAILS</span>
              <span className="col-qty">QUANTITY</span>
              <span className="col-price">PRICE</span>
              <span className="col-total">TOTAL</span>
            </div>

            <div className="items-list">
              {cartItems.map((item) => {
                const quantity = item.qty || item.quantity || 1;
                return (
                  <div key={item.id || item.name} className="cart-row">
                    <div className="col-details product-cell">
                      <div className="product-icon">
                        {(item.photo || item.prd_photo) ? (
                          <img
                            src={item.photo || item.prd_photo}
                            alt={item.name || item.title || 'Product'}
                            className="cart-product-image"
                          />
                        ) : '🍕'}
                      </div>
                      <div className="product-meta">
                        <h3>{item.name || item.title || item.productName || 'Food Item'}</h3>
                        {item.category && <p>{item.category}</p>}
                        <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                      </div>
                    </div>

                    <div className="col-qty qty-cell">
                      <button className="qty-ctrl" onClick={() => updateQty(item.id, 'dec')}>-</button>
                      <span className="qty-num">{quantity}</span>
                      <button className="qty-ctrl" onClick={() => updateQty(item.id, 'inc')}>+</button>
                    </div>

                    <div className="col-price price-cell">${(Number(item.price || item.prd_price || 0)).toFixed(2)}</div>
                    <div className="col-total total-cell">${(Number(item.price || item.prd_price || 0) * quantity).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            <button className="back-to-shop" onClick={() => navigate('/shop')}>
              ← Continue Shopping
            </button>
          </div>

          <aside className="cart-right-summary">
            <h2>Order Summary</h2>
            <hr className="divider" />

            <div className="summary-row">
              <span>ITEMS {cartItems.length}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-input-group">
              <label>SHIPPING</label>
              <select className="summary-select" value="standard" disabled>
                <option value="standard">Standard Delivery - $5.00</option>
                
              </select>
            </div>

            <div className="summary-footer">
              <hr className="divider" />
              <div className="total-row">
                <span>TOTAL COST</span>
                <span>${(subtotal + shipping).toFixed(2)}</span>
              </div>
              <button
                className="checkout-action-btn"
                onClick={() => navigate(user ? '/checkout' : '/login', { state: { from: '/checkout' } })}
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPageCustomer;
