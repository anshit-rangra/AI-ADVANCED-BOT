import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance"; // axios instance import
import "../styles/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Register success:", response.data);

      navigate("/login");

    } catch (err) {
      console.error("Register failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="error">{error}</p>}

        <div className="form-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="switch-link">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
