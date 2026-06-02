import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = {
      email,
      role: "admin",
    };

    signIn(userData);

    navigate("/admin/dashboard");
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Admin Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default AdminLogin;