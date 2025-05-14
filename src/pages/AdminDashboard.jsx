import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, IconButton,
  Dialog, DialogTitle, DialogContent,
  MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Menu,DialogActions, Button
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faDoorOpen, faCheckCircle,
  faBookmark, faWallet, faDoorClosed, faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { getRooms ,updateRoomStatus ,getAllUsers,getAllBookings} from "../api";
import { Snackbar, Alert } from "@mui/material";


const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomFilterStatus, setRoomFilterStatus] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const token = localStorage.getItem("adminToken");
  const [users, setUsers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [bookingList, setBookingList] = useState([]);
  const [newBookingCount, setNewBookingCount] = useState(0);
  const [ongoingBookingCount, setOngoingBookingCount] = useState(0);

  const handleCardClick = () => {

    navigate("/all-bookings", { state: { activeTab: "ongoing" } });
  };

  const statusStyles = {
    "active": { label: "Active", color: "#4caf50" },
    "inactive": { label: "Inactive", color: "#9e9e9e" },
    "under-maintenance": { label: "Under Maintenance", color: "#ff9800" }
  };

  const statusDisplayMap = {
    "active": "Active",
    "inactive": "Inactive",
    "under-maintenance": "Under Maintenance",
  };
  const navigate = useNavigate();

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
  const fetchBookings = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const data = await getAllBookings(token);

      // Set the booking list
      setBookingList(data);

      // Count new bookings where approveStatus is "pending"
      const newBookings = data.filter((booking) => booking.approveStatus?.toLowerCase() === "pending");
      setNewBookingCount(newBookings.length);

      // Count ongoing bookings where status is "ongoing"
      const ongoingBookings = data.filter((booking) => booking.status?.toLowerCase() === "ongoing");
      setOngoingBookingCount(ongoingBookings.length);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  fetchBookings();
}, []);

  const fetchRooms = async () => {
    try {
      const data = await getRooms(token);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  
  useEffect(() => {
    if (!token) {
      console.error("No token found, please log in.");
      return;
    }
    fetchRooms();
  }, [token]);
  

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
  



    const handleMenuOpen = (event, id) => {
      setAnchorEl(event.currentTarget);
      setSelectedRoomId(id);
    };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoomId(null);
  };

  const confirmStatusChange = (status, roomId) => {
    setSelectedStatus(status);
    setSelectedRoomId(roomId);
    setConfirmOpen(true);
  };
 
  const handleConfirmChange = async () => {
    try {
      await updateRoomStatus(selectedRoomId, selectedStatus.toLowerCase(), token);
      setSnackbar({ open: true, message: "Status updated successfully", severity: "success" });
      await fetchRooms(); // refresh rooms data
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update status.",
        severity: "error",
      });
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleDialogOpen = (filter = null) => {
    setRoomFilterStatus(filter);
    setRoomDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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


       <Paper className="card-content clickable" onClick={handleCardClick}>
      <FontAwesomeIcon icon={faCheckCircle} className="icon" />
      <div className="card-text">
        <Typography variant="h6">Ongoing Bookings</Typography>
        <Typography variant="body1" className="count">{ongoingBookingCount}</Typography>
      </div>
    </Paper>

        <Paper className="card-content clickable" onClick={() => navigate("/pending-approval")}>
  <FontAwesomeIcon icon={faBookmark} className="icon" />
  <div className="card-text">
    <Typography variant="h6">New Bookings</Typography>
    <Typography variant="body1" className="count">{newBookingCount}</Typography>
  </div>
</Paper>


        <Paper className="card-content clickable" onClick={() => handleDialogOpen("under-maintenance")}>
          <FontAwesomeIcon icon={faWallet} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Rooms Under Maintenance</Typography>
            <Typography variant="body1" className="count">
              {rooms.filter(room => room.status === "under-maintenance").length}
            </Typography>
          </div>
        </Paper>

        <Paper className="card-content clickable" onClick={() => handleDialogOpen("active")}>
          <FontAwesomeIcon icon={faDoorClosed} className="icon" />
          <div className="card-text">
            <Typography variant="h6">Active Rooms</Typography>
            <Typography variant="body1" className="count">
              {rooms.filter(room => room.status === "active").length}
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
            <TableCell>{room.title}</TableCell>
            <TableCell>
  {statusStyles[room.status] ? (
    <span style={{
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: 500,
      color: "white",
      backgroundColor: statusStyles[room.status].color
    }}>
      {statusStyles[room.status].label}
    </span>
  ) : (
    <span style={{
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: 500,
      color: "white",
      backgroundColor: "#bdbdbd"
    }}>
      Unknown
    </span>
  )}
</TableCell>

            <TableCell>{room.seats}</TableCell>
            <TableCell>
  {room.facilities && room.facilities.length > 0
    ? room.facilities.join(", ")
    : "No facilities"}
</TableCell>
            <TableCell>{room.floor}</TableCell>
            <TableCell align="right">
            <IconButton onClick={(e) => handleMenuOpen(e, room._id)}>
                <FontAwesomeIcon icon={faEllipsisV} style={{ color: "#333" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
  <MenuItem onClick={() => confirmStatusChange("under-maintenance", selectedRoomId)}>Move to Maintenance</MenuItem>
<MenuItem onClick={() => confirmStatusChange("active", selectedRoomId)}>Move to Active</MenuItem>
<MenuItem onClick={() => confirmStatusChange("inactive", selectedRoomId)}>Move to Inactive</MenuItem>
</Menu>

<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirm Status Change</DialogTitle>
  <DialogContent>
    Are you sure you want to change the room status to <strong>{statusDisplayMap[selectedStatus]}</strong>?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirmChange} variant="contained" color="primary">Confirm</Button>
  </DialogActions>
</Dialog>

</DialogContent>

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
      </Dialog>
    </>
  );
};

export default AdminDashboard;

