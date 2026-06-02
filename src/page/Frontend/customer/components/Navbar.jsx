import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ cartCount = 0 }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ===== THEME =====
  const [theme, setTheme] = useState(
    localStorage.getItem("foodieTheme") || "dark"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("foodieTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogoClick = () => {
    navigate("/shop");
  };

  const handleNavClick = (event) => {
    event.preventDefault();
    setIsMenuOpen(false);

    const target = event.target.getAttribute("href").slice(1);
    const section = document.getElementById(target);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // search logic
      setSearchQuery("");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");

    window.location.href = "/login-customer";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* ===== LOGO ===== */}
        <div
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">🍕</span>
          <span className="logo-text">FOODIE</span>
        </div>

        {/* ===== MENU ===== */}
        <ul className="nav-menu">
          <li>
            <a href="#home" onClick={handleNavClick}>
              Home
            </a>
          </li>

          <li>
            <a href="#menu" onClick={handleNavClick}>
              Menu
            </a>
          </li>

          <li>
            <a href="#about" onClick={handleNavClick}>
              About
            </a>
          </li>

          <li>
            <a href="#contact" onClick={handleNavClick}>
              Contact
            </a>
          </li>
        </ul>

        {/* ===== RIGHT SIDE ===== */}
        <div className="navbar-right">

          {/* SEARCH */}
          {/* <div className="search-box">
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="search-input"
            />

            <span className="search-icon">🔍</span>
          </div> */}

          {/* CART */}
          <button
            className="cart-btn"
            onClick={() => navigate("/CartPage")}
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </button>

          {/* HISTORY */}
          <button
            className="history-btn cart-btn"
            onClick={() => navigate("/customer/online-order")}
          >
            📜 History
          </button>

          {/* LOGIN / LOGOUT */}
          {user ? (
            <button
              className="signin-btn"
              onClick={() => {
                signOut();
                navigate("/login-customer");
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="signin-btn"
              onClick={() => navigate("/login-customer")}
            >
              Sign In
            </button>
          )}

          {/* ===== THEME TOGGLE ===== */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

        </div>

        {/* ===== HAMBURGER ===== */}
        <div
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

      {/* ===== MOBILE MENU ===== */}
      {isMenuOpen && (
        <div className="mobile-menu">

          <a href="#home" onClick={handleNavClick}>
            Home
          </a>

          <a href="#menu" onClick={handleNavClick}>
            Menu
          </a>

          <a href="#about" onClick={handleNavClick}>
            About
          </a>

          <a href="#contact" onClick={handleNavClick}>
            Contact
          </a>

          {user ? (
            <button
              className="signin-btn-mobile"
              onClick={() => {
                signOut();
                navigate("/login-customer");
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="signin-btn-mobile"
              onClick={() => {
                navigate("/login-customer");
                setIsMenuOpen(false);
              }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;