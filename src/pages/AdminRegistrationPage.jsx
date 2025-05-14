import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Import API service
import logo from '../assets/logo.png';
import { Snackbar, Alert } from "@mui/material";
import './AdminRegistrationPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminRegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    division: '',
    designation: '',
    password: '',
    confirmPassword: '',
    secretCode: '', // New field for secret key
    role: 'admin'  // Ensure role is admin
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    if (!formData.fullName || !formData.email || !formData.division || !formData.designation 
        || !formData.password || !formData.confirmPassword || !formData.secretCode) {
      setError("All fields are required including Secret Key!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await api.post('/auth/register-admin', formData);
      setSnackbar({ open: true, message: "Admin registration successful!", severity: 'success' });
      navigate('/admin-login', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };


  return (
    <div className="admin-registration-page">
      <div className="admin-registration-container">
        
        <h2>Register as Admin</h2>
        <p>Please enter your details to register</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" type="text" value={formData.fullName} onChange={handleChange} required />
          <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
          <input name="division" placeholder="Division" type="text" value={formData.division} onChange={handleChange} required />
          <input name="designation" placeholder="Designation" type="text" value={formData.designation} onChange={handleChange} required />
          
          <div className="admin-password-container">
            <input name="password" placeholder="Password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <div className="admin-password-container">
            <input name="confirmPassword" placeholder="Confirm Password" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <input 
            name="secretCode" 
            placeholder="Admin Secret Key" 
            type="password" 
            value={formData.secretCode} 
            onChange={handleChange} 
            required 
          />

          <button className='admin-submit-button' type="submit">Register</button>
        </form>

        <p className="login-link">Already have an account? <Link to="/admin-login">Login</Link></p>
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

export default AdminRegistrationPage;
