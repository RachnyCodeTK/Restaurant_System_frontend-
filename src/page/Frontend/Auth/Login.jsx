// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, signIn } = useAuth();
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const from = location.state?.from || "/shop";

//   const handleChange = (e) => {
//     setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!credentials.email || !credentials.password) {
//       setError("Please enter both email and password.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/api/customer/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Login failed. Please try again.");
//         setIsLoading(false);
//         return;
//       }

//       // Store user data with customer_id from backend
//       const userData = {
//         ...data.data,
//         email: data.data.cust_email || credentials.email,
//         customer_id: data.data.cust_id,
//       };

//       signIn(userData);
//       navigate(from, { replace: true });
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Connection error. Please make sure the server is running.");
//       setIsLoading(false);
//     }
//   };

//   if (user) {
//     return (
//       <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "20px" }}>
//         <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "420px", width: "100%" }}>
//           <h1 style={{ marginBottom: "16px", color: "#333" }}>You are already signed in</h1>
//           <p style={{ color: "#555", marginBottom: "24px" }}>Continue shopping or sign out from the app first.</p>
//           <button
//             onClick={() => navigate("/shop")}
//             style={{ padding: "12px 24px", borderRadius: "8px", border: "none", background: "#FF6B35", color: "white", cursor: "pointer", fontWeight: "600" }}
//           >
//             Go to Menu
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "20px" }}>
//       <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", maxWidth: "420px", width: "100%" }}>
//         <h1 style={{ marginBottom: "16px", color: "#333" }}>Sign In</h1>
//         <p style={{ color: "#555", marginBottom: "32px" }}>Use your email to continue to Foodie.</p>

//         {error && (
//           <div style={{ background: "#ffebee", color: "#c62828", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
//             ⚠️ {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "8px", color: "#555" }}>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={credentials.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               required
//               disabled={isLoading}
//               style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
//             />
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{ display: "block", marginBottom: "8px", color: "#555" }}>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={credentials.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               required
//               disabled={isLoading}
//               style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem" }}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             style={{ width: "100%", padding: "14px", background: "#FF6B35", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
//           >
//             {isLoading ? "🔄 Signing in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

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

  const from = location.state?.from || "/login";

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

      // STORE USER DATA IN LOCAL STORAGE
      const userData = {
        ...data.data,
        customer_id: data.data.cust_id,
      };

      signIn(userData);

      // REDIRECT AFTER LOGIN
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>
          <h2>You are already logged in</h2>
          <button onClick={() => navigate("/")}>Go To Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "400px" }}>
         <h1 style={{color: "black", textAlign: "center"}}>Customer Login</h1>  {/*// Change title to "Customer Login" */}

        {error && (
          <div style={{ color: "black", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={credentials.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "12px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={credentials.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "12px" }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{ width: "100%", padding: "12px" }}
        >
          {isLoading ? "Signing In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
