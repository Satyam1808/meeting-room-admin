import React, { useState, useEffect } from "react";
import { Card, CardContent, Input, Button, InputLabel, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons
import { addUser, deleteUser, getAllUsers } from "../api";
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "Password@123@",
    division: "",
    designation: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("adminToken"); // or however you're storing token

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      console.log("Fetched users:", data);
      if (data && Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        // Update user
        const updatedUsers = [...users];
        updatedUsers[editIndex] = form;
        setUsers(updatedUsers);
        setEditIndex(null);
      } else {
        // Add new user — corrected parameter order
        await addUser(
          form.fullName,      // Correct: fullName first
          form.email,         // email second
          form.division,      // division third
          form.designation,   // designation fourth
          form.password,      // password fifth
          token               // token last
        );
        setSnackbar({ open: true, message: "User added successfully", severity: "success" });
      }
      setForm({ fullName: "", email: "", password: "Password@123@", division: "", designation: "" }); // Reset form
      await fetchUsers();
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message,
        severity: "error",
      });
    }
  };
  

  const handleEdit = (index) => {
    setForm(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(users[deleteIndex]._id, token);
      const updatedUsers = users.filter((_, i) => i !== deleteIndex);
      setUsers(updatedUsers);
      setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete user", severity: "error" });
    }
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="user-management-wrapper">
      <center><h1>Manage Users</h1></center>
      <Card className="mb-6">
        <CardContent className="space-y-4 pt-6">
          <h2>{editIndex !== null ? "Edit User" : "Add User"}</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="box_class">

            <InputLabel>Full Name</InputLabel>
              <div className="password-input-container">
                <Input name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>

              <InputLabel>Email</InputLabel>
              <div className="email-input-container">
                <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <InputLabel>Password</InputLabel>
              <div className="password-input-container">
                <Input
                  name="password"
                  type={passwordVisible ? "text" : "password"} // Toggle password type
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {passwordVisible ? (
                  <FaEyeSlash className="toggle-icon" onClick={togglePasswordVisibility} />
                ) : (
                  <FaEye className="toggle-icon" onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>
            <div>
              <InputLabel>Division</InputLabel>
              <div className="password-input-container">
                <Input name="division" value={form.division} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <InputLabel>Designation</InputLabel>
              <div className="password-input-container">
                <Input name="designation" value={form.designation} onChange={handleChange} required />
              </div>
             
            </div>
            <div className="user-form">
              <Button type="submit" className="submit-button">
                {editIndex !== null ? "Update User" : "Add User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div className="overflow-auto">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Division</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.email}</td>
                    <td>{user.division}</td>
                    <td>{user.designation}</td>
                    <td className="user-actions">
                    
                      <Button
                        size="small"
                        variant="destructive"
                        className="delete-button"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="no-users">
                      No users added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={cancelDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}