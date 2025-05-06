// File: UserManagement.jsx
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
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">{editIndex !== null ? "Edit User" : "Add User"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
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
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Division</th>
                  <th className="py-2 pr-4">Designation</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 pr-4">{user.email}</td>
                    <td className="py-2 pr-4">{user.division}</td>
                    <td className="py-2 pr-4">{user.designation}</td>
                    <td className="py-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(index)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted-foreground">
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