import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLoginPage.css"; // Import your CSS file for styling
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../api"; // Import login function
import { Snackbar, Alert } from "@mui/material";
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(""); // Changed username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
  
      const { id, email: userEmail, name, role } = response.user;
  
      // Ensure only admins can login here
      if (role !== 'admin') {
        setSnackbar({ open: true, message: "Only admins can log in here.", severity: "error" });
        return;
      }
  
      // Store admin details and token
      localStorage.setItem("adminToken", response.token);
      localStorage.setItem("adminUser", JSON.stringify({ _id: id, email: userEmail, name, role }));
  
      console.log("Admin login token:", response.token);
      console.log("Stored admin in localStorage:", localStorage.getItem("adminUser"));
  
      setSnackbar({ open: true, message: "Admin login successful!", severity: "success" });
      setTimeout(() => navigate("/", { replace: true }), 1000);
  
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid email or password.";
      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLoginPage;