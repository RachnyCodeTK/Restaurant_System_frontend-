import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { loginCustomer } from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginCustomer(credentials);

      const userData = {
        ...data.data,
        customer_id: data.data?.cust_id,
      };

      signIn(userData);

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              color: "#1e293b",
            }}
          >
            You are already logged in
          </h2>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "10px",
              background: "#FF6B35",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Go To Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #fff7ed 0%, #f8fafc 50%, #eff6ff 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "8px",
              color: "#0f172a",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              marginBottom: "30px",
            }}
          >
            Sign in to your account
          </p>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#334155",
                fontWeight: "500",
              }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              disabled={isLoading}
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #dbe2ea",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#334155",
                fontWeight: "500",
              }}
            >
              Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 14px",
                  borderRadius: "12px",
                  border: "1px solid #dbe2ea",
                  outline: "none",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#FF6B35",
              color: "#fff",
              fontWeight: "600",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "all 0.3s ease",
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