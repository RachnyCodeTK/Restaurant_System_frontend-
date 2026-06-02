import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import "../styles/CustomerLogin.css";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = {
      email,
      role: "customer",
    };

    signIn(userData);

    navigate("/shop");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        
        {/* LEFT SIDE */}
        <div className="login-card">
          <div className="logo-box">
            <h1>Foodle 🍔</h1>
            <p>Made with love ❤️</p>
          </div>

          <h2>Login</h2>
          <span>in as Customer</span>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <input
                type="email"
                placeholder="Enter Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="image-section">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/960px-Good_Food_Display_-_NCI_Visuals_Online.jpg"
            alt="burger"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;