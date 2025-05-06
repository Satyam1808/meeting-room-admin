
import { FaPencilAlt } from "react-icons/fa";
import "./AdminMyView.css";
import React, { useState, useEffect } from "react";

const AdminMyView = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    division: "",
    designation: "",
    lastLogin: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData({
        fullName: storedUser.name || "",
        email: storedUser.email || "",
        division: storedUser.division || "",
        designation: storedUser.designation || "",
        lastLogin: storedUser.lastLogin || new Date().toLocaleString(),
      });
    }
  }, []);

  const toggleEdit = () => setIsEditable(!isEditable);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = () => {
    // Send updated data to the server if needed
    localStorage.setItem("user", JSON.stringify(userData));
    setIsEditable(false);
    alert("Profile updated successfully.");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/admin-login";
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Account Details</h1>

        <div className="profile-header">
          <div className="user-info">
            <h2>{userData.fullName}</h2>
            <p>UserID: --- abcd123</p>
          </div>
          <button className="edit-btn" onClick={toggleEdit}>Edit</button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={userData.fullName} onChange={handleChange} disabled={!isEditable} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditable} />
          </div>

          <div className="form-group">
            <label>Division</label>
            <input type="text" name="division" value={userData.division} onChange={handleChange} disabled={!isEditable} />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input type="text" name="designation" value={userData.designation} onChange={handleChange} disabled={!isEditable} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type="password" placeholder="••••••••" disabled />
              <FaPencilAlt className="edit-icon" />
            </div>
          </div>

          <div className="form-group">
            <label>Last Login</label>
            <input type="text" value={userData.lastLogin} disabled />
          </div>

          {isEditable && <button className="update-btn" onClick={handleUpdate}>Update</button>}
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default AdminMyView;