import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLoginPage.css"; // Import your CSS file for styling
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../api"; // Import login function

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(""); // Changed username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      localStorage.setItem("adminToken", response.token); // Store token
      localStorage.setItem("adminUser", JSON.stringify(response.user)); // Store user details
     
       navigate('/', { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <p>Enter your admin credentials</p>
        
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordVisible ? (
            <FaEyeSlash className="toggle-icon" onClick={togglePasswordVisibility} />
          ) : (
            <FaEye className="toggle-icon" onClick={togglePasswordVisibility} />
          )}
        </div>
        <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        <button className="btn" onClick={handleLogin}>Login</button>
        
        <p className="register-link">
          No account? <a href="/admin-register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;