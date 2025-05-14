
import { FaPencilAlt } from "react-icons/fa";
import "./AdminMyView.css";
import React, { useState, useEffect } from "react";
import { getUserById ,editUser} from "../api";
import { Snackbar, Alert } from "@mui/material";

const AdminMyView = () => {
  const [isEditable, setIsEditable] = useState(false);
   const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    division: "",
    designation: "",
    password: "",
    lastLogin: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("adminUser"));
        const token = localStorage.getItem("adminToken");
        console.log("Stored user in localStorage:", localStorage.getItem("adminUser"));
        if (storedUser && storedUser._id && token) {
          const data = await getUserById(storedUser._id, token);
          if (data && data.user) {
            setUserData({
              fullName: data.user.fullName || "",
              email: data.user.email || "",
              division: data.user.division || "",
              designation: data.user.designation || "",
              password: "",
              lastLogin: storedUser.lastLogin || new Date().toLocaleString(),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch user details.",
          severity: "error",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const storedUser = JSON.parse(localStorage.getItem("adminUser"));
      
      const updatedDetails = {
        fullName: userData.fullName,
        division: userData.division,
        designation: userData.designation,
      };

      if (userData.password) {
        updatedDetails.password = userData.password;
      }

      await editUser(storedUser._id, updatedDetails, token);

      setSnackbar({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });
      setIsEditable(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  const toggleEdit = () => setIsEditable(!isEditable);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Account Details</h1>

        <div className="profile-header">
          <div className="user-info">
          <h2>{userData.fullName}</h2>
          <p>UserID:  {JSON.parse(localStorage.getItem("user"))?._id || "Not available"}</p>
          </div>
          <button className="edit-btn" onClick={toggleEdit}>
            {isEditable ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={userData.email} disabled />
          </div>

          <div className="form-group">
            <label>Division</label>
            <input
              type="text"
              name="division"
              value={userData.division}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={userData.designation}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>


          <div className="form-group">
            <label>Last Login</label>
            <input type="text" value={userData.lastLogin} disabled />
          </div>
           
  

          {isEditable && (
            <button className="update-btn" onClick={handleUpdate}>
              Update
            </button>
          )}
         
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminMyView;