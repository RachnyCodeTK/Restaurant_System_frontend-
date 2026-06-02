import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/dashboard.css";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    if (location.pathname.startsWith("/products") || location.pathname === "/add-product") {
      setActiveSubmenu("menu");
    }
  }, [location.pathname]);

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <h2>🍴 Foodie Kitchen</h2>

      {/* Navigation Menu */}
      <ul className="menu">
        <li
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => handleNavigation("/")}
        >
          Dashboard
        </li>

        {/* Menu with Submenu */}
        <li onClick={() => toggleSubmenu("menu")}>
          <div className="menu-item">
            Product <span>{activeSubmenu === "menu" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "menu" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/add-product")}>Add Product</li>
              <li onClick={() => handleNavigation("/products-list")}>Actions/ List</li>
              <li onClick={() => handleNavigation("/adjustment")}>Adjustment</li>
            </ul>
          )}
        </li>

        {/* Order List with Submenu */}
        <li onClick={() => toggleSubmenu("orders")}> 
          <div className="menu-item">
          Orders<span>{activeSubmenu === "orders" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "orders" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/order-history")}>Online Orders</li>
              <li onClick={() => handleNavigation("/report")}>POS Order</li>
            </ul>
          )}
        </li>

        {/* POS Sale */}
        <li onClick={() => handleNavigation("/pos")}>
          <div className="menu-item">
            POS Sale
          </div>
        </li>

        {/* Analytics */}
        <li onClick={() => toggleSubmenu("analytics")}>
          <div className="menu-item">
            Analytics <span>{activeSubmenu === "analytics" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "analytics" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/analytics")}>Analytics Dashboard</li>
              <li onClick={() => handleNavigation("/report")}>Sales Report</li>
              <li onClick={() => handleNavigation("/report/details")}>Sale Details</li>
            </ul>
          )}
        </li>

        {/* Inventory */}
        <li onClick={() => toggleSubmenu("inventory")}>
          <div className="menu-item">
            Inventory <span>{activeSubmenu === "inventory" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "inventory" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/inventory")}>Inventory Dashboard</li>
              <li onClick={() => handleNavigation("/stock-level")}>Stock Levels</li>
              <li onClick={() => handleNavigation("/stock-alert")}>Low Stock Alerts</li>
            </ul>
          )}
        </li>

        {/* Purchase */}
        <li onClick={() => toggleSubmenu("purchase")}>
          <div className="menu-item">
            Purchase <span>{activeSubmenu === "purchase" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "purchase" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/supplier-management")}>Supplier Management</li>
              <li onClick={() => handleNavigation("/purchase-order")}> Add Purchase</li>
              <li onClick={() => handleNavigation("/purchase-list")}>Purchase List</li>
            </ul>
          )}
        </li>

        {/* Report */}
        <li className="report-btn" onClick={() => toggleSubmenu("report")}>
          <div className="menu-item">
            Report <span>{activeSubmenu === "report" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "report" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/report/details")}>Sales Details Report</li>
              <li onClick={() => handleNavigation("/supplier-management")}>Supplier Management</li>
              <li onClick={() => handleNavigation("/purchase-list")}>Purchase Lists</li>
            </ul>
          )}
        </li>

        {/* Settings */}
        <li onClick={() => toggleSubmenu("settings")}>
          <div className="menu-item">
            Settings <span>{activeSubmenu === "settings" ? "▲" : "▼"}</span>
          </div>
          {activeSubmenu === "settings" && (
            <ul className="submenu">
              <li onClick={() => handleNavigation("/profile-settings")}>Profile Settings</li>
              <li onClick={() => handleNavigation("/system-settings")}>System Settings</li>
              <li onClick={() => handleNavigation("/user-settings")}>User Settings</li>
            </ul>
          )}
        </li>

        <li className="logout-btn" onClick={() => handleNavigation("/login")}>
          Log out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;