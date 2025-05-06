import React, { useState } from "react";
import {
  Box, Typography, Paper, IconButton,
  Dialog, DialogTitle, DialogContent,
  MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Menu
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faDoorOpen, faCheckCircle,
  faBookmark, faWallet, faDoorClosed, faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", division: "IT", designation: "Manager" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", division: "HR", designation: "Executive" },
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, name: "Main Conference", seats: 15, facilities: "Projector, AC", floor: "1st", status: "Active" },
    { id: 2, name: "Innovation Hub", seats: 10, facilities: "Whiteboard, WiFi", floor: "2nd", status: "Under Maintenance" },
    { id: 3, name: "Board Room", seats: 12, facilities: "Screen, HDMI", floor: "3rd", status: "Active" },
  ]);

  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomFilterStatus, setRoomFilterStatus] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const navigate = useNavigate();

  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoomId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoomId(null);
  };

  const handleStatusChange = (status) => {
    if (selectedRoomId !== null) {
      const updatedRooms = rooms.map(room =>
        room.id === selectedRoomId ? { ...room, status } : room
      );
      setRooms(updatedRooms);
    }
    handleMenuClose();
  };

  const handleDialogOpen = (filter = null) => {
    setRoomFilterStatus(filter);
    setRoomDialogOpen(true);
  };

  const filteredRooms = roomFilterStatus
    ? rooms.filter(room => room.status === roomFilterStatus)
    : rooms;

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

        <Paper className="card-content clickable" onClick={() => handleDialogOpen(null)}>
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

        <Paper className="card-content clickable" onClick={() => navigate("/pending-approval")}>
  <FontAwesomeIcon icon={faBookmark} className="icon" />
  <div className="card-text">
    <Typography variant="h6">New Bookings</Typography>
    <Typography variant="body1" className="count">5</Typography>
  </div>
</Paper>


        <Paper className="card-content clickable" onClick={() => handleDialogOpen("Under Maintenance")}>
          <FontAwesomeIcon icon={faWallet} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Rooms Under Maintenance</Typography>
            <Typography variant="body1" className="count">
              {rooms.filter(room => room.status === "Under Maintenance").length}
            </Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable" onClick={() => handleDialogOpen("Active")}>
          <FontAwesomeIcon icon={faDoorClosed} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Active Rooms</Typography>
            <Typography variant="body1" className="count">
              {rooms.filter(room => room.status === "Active").length}
            </Typography>
          </div>
        </Paper>
      </div>

      <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {roomFilterStatus ? `${roomFilterStatus} Rooms` : "All Conference Rooms"}
        </DialogTitle>
        <DialogContent>
  <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
    <Table size="small">
      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Seats</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Facilities</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Floor</TableCell>
          <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredRooms.map((room, index) => (
          <TableRow
            key={room.id}
            sx={{
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
              '&:hover': { backgroundColor: "#f0f8ff" }
            }}
          >
            <TableCell>{room.name}</TableCell>
            <TableCell>
              <span style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "white",
                backgroundColor:
                  room.status === "Active" ? "#4caf50" :
                  room.status === "Under Maintenance" ? "#ff9800" :
                  "#9e9e9e"
              }}>
                {room.status}
              </span>
            </TableCell>
            <TableCell>{room.seats}</TableCell>
            <TableCell>{room.facilities}</TableCell>
            <TableCell>{room.floor}</TableCell>
            <TableCell align="right">
              <IconButton onClick={(e) => handleMenuOpen(e, room.id)}>
                <FontAwesomeIcon icon={faEllipsisV} style={{ color: "#333" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
    <MenuItem onClick={() => handleStatusChange("Under Maintenance")}>Move to Maintenance</MenuItem>
    <MenuItem onClick={() => handleStatusChange("Active")}>Move to Active</MenuItem>
    <MenuItem onClick={() => handleStatusChange("Inactive")}>Move to Inactive</MenuItem>
  </Menu>
</DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
