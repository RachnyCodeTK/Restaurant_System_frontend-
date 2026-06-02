
import React, { useState } from "react";
// import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => { 
    try {
      const res = await axios.post(
        "http://localhost:3000/api/customer/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("customer", JSON.stringify(res.data.customer));

      alert("Login success");
      window.location.href = "/shop";
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2 >Login</h2>

      <input
        type="email"
        placeholder="Input Your Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Input Your Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}