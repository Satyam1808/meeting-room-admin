import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", division: "", designation: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = form;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      setUsers([...users, form]);
    }
    setForm({ email: "", password: "", division: "", designation: "" });
  };

  const handleEdit = (index) => {
    setForm(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const updated = users.filter((_, i) => i !== index);
      setUsers(updated);
    }
  };

  return (
    <div className="user-management-wrapper">
       <center><h1>Manage Users</h1></center>
      <Card className="mb-6">
        <CardContent className="space-y-4 pt-6">
          <h2>{editIndex !== null ? "Edit User" : ""}</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="box_class">
              <InputLabel>Email</InputLabel>
              <Input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <InputLabel>Password</InputLabel>
              <Input name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
            <div>
              <InputLabel>Division</InputLabel>
              <Input name="division" value={form.division} onChange={handleChange} required />
            </div>
            <div>
              <InputLabel>Designation</InputLabel>
              <Input name="designation" value={form.designation} onChange={handleChange} required />
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
                        variant="outline"
                        className="edit-button"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
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
    </div>
  );
}
