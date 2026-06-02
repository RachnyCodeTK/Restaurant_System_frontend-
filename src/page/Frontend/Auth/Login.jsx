import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// IMPORT API SERVICE
import { loginCustomer } from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ ប្តូរពី "/login" ទៅ "/" ដើម្បីការពារកុំឱ្យវា Redirect មកទំព័រដដែលនាំឱ្យគាំង
  const from = location.state?.from || "/"; 

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // ============================================
  // LOGIN WITH BACKEND API
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      // CALL BACKEND LOGIN API
      const data = await loginCustomer(credentials);

      // STORE USER DATA
      const userData = {
        ...data.data,
        customer_id: data.data?.cust_id, // ប្រើ optional chaining (?.) ដើម្បីការពារកុំឱ្យបាក់កូដបើគ្មាន cust_id
      };

      signIn(userData);

      // REDIRECT AFTER LOGIN
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      // បង្ហាញសារកំហុសដែលឆ្លើយតបមកពី Backend API បើមាន
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ប្រសិនបើបាន Login រួចរាល់ហើយ
  if (user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>You are already logged in</h2>
          <button 
            onClick={() => navigate("/")}
            style={{ padding: "12px 24px", borderRadius: "8px", border: "none", background: "#FF6B35", color: "white", cursor: "pointer", fontWeight: "600" }}
          >
            Go To Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "20px" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", width: "100%", maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <h1 style={{ color: "black", textAlign: "center", marginBottom: "24px" }}>Customer Login</h1>

          {error && (
            <div style={{ background: "#ffebee", color: "#c62828", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={credentials.email}
              onChange={handleChange}
              disabled={isLoading}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: "100%", 
              padding: "14px", 
              background: "#FF6B35", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              fontSize: "1rem", 
              fontWeight: "600", 
              cursor: isLoading ? "not-allowed" : "pointer", 
              opacity: isLoading ? 0.7 : 1 
            }}
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;