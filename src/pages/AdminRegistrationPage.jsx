import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Import API service
import logo from '../assets/logo.png';
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
    role: 'admin' // Ensure role is set to admin
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.division || !formData.designation || !formData.password || !formData.confirmPassword ) {
      setError("All fields are required!");
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

    console.log("Submitting form data:", formData);


    try {
      await api.post('/auth/register', formData);
      alert("Registration successful! Redirecting to login.");
      navigate('/admin-login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="admin-registration-page">
      <div className="admin-registration-container">
        <img src={logo} alt="Company Logo" className="logo" />
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
          <button className='admin-submit-button' type="submit">Register</button>
        </form>
        <p className="login-link">Already have an account? <Link to="/admin-login">Login</Link></p>
      </div>
    </div>
  );
};

export default AdminRegistrationPage;