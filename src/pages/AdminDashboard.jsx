import React, { useState } from "react";
import {
  Box, Typography, Paper, TextField, Button, IconButton,
  Dialog, DialogTitle, DialogContent, MenuItem, Select,
  InputLabel, FormControl, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TablePagination
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faDoorOpen, faCheckCircle, faBookmark,
  faWallet, faDoorClosed, faTrash, faEdit, faWrench
} from "@fortawesome/free-solid-svg-icons";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", division: "IT", designation: "Manager" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", division: "HR", designation: "Executive" },
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, name: "Main Conference", seats: 15, facilities: "Projector, AC", floor: "1st", status: "Active" },
    { id: 2, name: "Innovation Hub", seats: 10, facilities: "Whiteboard, WiFi", floor: "2nd", status: "Active" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", division: "", designation: "" });
  const [newRoom, setNewRoom] = useState({ name: "", seats: "", facilities: "", floor: "", status: "Active" });

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password && newUser.division && newUser.designation) {
      const id = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { ...newUser, id }]);
      setNewUser({ name: "", email: "", password: "", division: "", designation: "" });
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleAddRoom = () => {
    if (newRoom.name && newRoom.seats && newRoom.facilities && newRoom.floor) {
      const id = rooms.length ? rooms[rooms.length - 1].id + 1 : 1;
      setRooms([...rooms, { ...newRoom, id }]);
      setNewRoom({ name: "", seats: "", facilities: "", floor: "", status: "Active" });
    }
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const toggleRoomStatus = (id) => {
    setRooms(rooms.map(room =>
      room.id === id ? { ...room, status: room.status === "Active" ? "Under Maintenance" : "Active" } : room
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard-grid">
      <Paper className="card-content clickable" onClick={() => navigate("/user-management")}>
         <FontAwesomeIcon icon={faUsers} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Number of Users</Typography>
            <Typography variant="body1" className="count">{users.length}</Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable" onClick={() => setRoomDialogOpen(true)}>
          <FontAwesomeIcon icon={faDoorOpen} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Total Conference Rooms</Typography>
            <Typography variant="body1" className="count">{rooms.length}</Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable">
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Ongoing Bookings</Typography>
            <Typography variant="body1" className="count">4</Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable">
          <FontAwesomeIcon icon={faBookmark} className="icon" />
          <div className="card-text">
            <Typography variant="h6">New Bookings</Typography>
            <Typography variant="body1" className="count">5</Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable">
          <FontAwesomeIcon icon={faWallet} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Rooms Under Maintenance</Typography>
            <Typography variant="body1" className="count">
              {rooms.filter(room => room.status === "Under Maintenance").length}
            </Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable">
          <FontAwesomeIcon icon={faDoorClosed} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Active Rooms</Typography>
            <Typography variant="body1" className="count">
              {rooms.filter(room => room.status === "Active").length}
            </Typography>
          </div>
        </Paper>
      </div>

   

      {/* ROOM DIALOG */}
      <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Conference Room Management</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <TextField label="Room Name" fullWidth size="small" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
            <TextField label="Number of Seats" fullWidth size="small" value={newRoom.seats} onChange={(e) => setNewRoom({ ...newRoom, seats: e.target.value })} />
            <TextField label="Facilities Available" fullWidth size="small" value={newRoom.facilities} onChange={(e) => setNewRoom({ ...newRoom, facilities: e.target.value })} />
            <TextField label="Floor" fullWidth size="small" value={newRoom.floor} onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} />
            <Button variant="contained" onClick={handleAddRoom}>Add Room</Button>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Facilities</TableCell>
                  <TableCell>Floor</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.status}</TableCell>
                    <TableCell>{room.seats}</TableCell>
                    <TableCell>{room.facilities}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => toggleRoomStatus(room.id)}><FontAwesomeIcon icon={faWrench} /></IconButton>
                      <IconButton><FontAwesomeIcon icon={faEdit} /></IconButton>
                      <IconButton onClick={() => handleDeleteRoom(room.id)}><FontAwesomeIcon icon={faTrash} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
