import React, { useEffect, useState } from "react";
import "./PendingApproval.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faEllipsisV, faList } from "@fortawesome/free-solid-svg-icons";
import { Snackbar, Alert } from "@mui/material";
import { approveBookingAPI ,rejectBookingAPI,getPendingBookings } from "../api";

const PendingApproval = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ New state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("adminToken");

  const [bookings, setBookings] = useState([ ]);

  const approveBooking = async (index) => {
    try {
      const bookingId = bookings[index].id;
      await approveBookingAPI(bookingId, token);
  
      // update local state after successful approval
      setBookings((prev) =>
        prev.map((booking, i) =>
          i === index ? { ...booking, status: "upcoming", approveStatus: "approved" } : booking
        )
      );
  
      setSnackbar({ open: true, message: "Booking approved successfully", severity: "success" });
      setMenuOpen(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to approve booking.",
        severity: "error",
      });
    }
  };

  
  const rejectBooking = async (index) => {
    try {
      const bookingId = bookings[index].id;
      await rejectBookingAPI(bookingId, token);
  
      // update local state after rejection
      setBookings((prev) =>
        prev.map((booking, i) =>
          i === index ? { ...booking, approveStatus: "rejected" } : booking
        )
      );
  
      setSnackbar({ open: true, message: "Booking rejected successfully", severity: "success" });
      setMenuOpen(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to reject booking.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getPendingBookings(token);
  
        const formattedBookings = data.map((booking) => ({
          id: booking._id,
          room: booking.roomId.title || "N/A",  // roomName should be populated in backend OR fallback
          employee: booking.userName,
          from: new Date(booking.fromDateTime).toLocaleString(),
          to: new Date(booking.toDateTime).toLocaleString(),
          status: booking.approveStatus.charAt(0).toUpperCase() + booking.approveStatus.slice(1),
          approveStatus: booking.approveStatus,
          description: booking.description || "-",
          date: new Date(booking.fromDateTime).toLocaleDateString(), // for searchTerm filtering
        }));
  
        setBookings(formattedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
  
    fetchBookings();
  }, []);
  
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter bookings by status and search
  const filteredBookings = bookings
    .filter((booking) => activeTab === "All" || booking.status === activeTab)
    .filter((booking) => {
      const search = searchTerm.toLowerCase();
      return (
        booking.room.toLowerCase().includes(search) ||
        booking.employee.toLowerCase().includes(search) ||
        booking.description.toLowerCase().includes(search) ||
        booking.date.toLowerCase().includes(search) ||
        booking.status.toLowerCase().includes(search)
      );
    });

  const toggleMenu = (index) => setMenuOpen(menuOpen === index ? null : index);

  return (
    <div className="approval-container" onClick={() => setMenuOpen(null)}>
      <h1>Pending For Approval</h1>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ Handle search input
        />
        <div className="icons">
          <FontAwesomeIcon
            icon={viewMode === "table" ? faThLarge : faList}
            onClick={() =>
              setViewMode(viewMode === "table" ? "grid" : "table")
            }
          />
        </div>
      </div>

      {viewMode === "table" ? (
        <table>
          <thead>
            <tr>
              <th>Room Booked</th>
              <th>Employee Name</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.room}</td>
                  <td>{booking.employee}</td>
                  <td>{booking.from}</td>
                  <td>{booking.to}</td>
                  <td>{booking.approveStatus}</td>
                  <td className="action" onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                    {menuOpen === index && (
                      <div className="dropdown-menu">
                        {booking.status === "Pending" && (
                          <>
                            <div onClick={() => approveBooking(index)}>Approve</div>
                            <div onClick={() => rejectBooking(index)}>Reject</div>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No pending requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="grid-view">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div key={index} className="grid-item">
                <h3>{booking.room}</h3>
                <p><strong>Employee:</strong> {booking.employee}</p>
                <p><strong>From:</strong> {booking.from}</p>
                <p><strong>To:</strong> {booking.to}</p>
                <p><strong>Status:</strong> {booking.status}</p>

                {booking.status === "Pending" && (
                  <div className="grid-actions">
                    <button onClick={() => approveBooking(index)}>Approve</button>
                    <button onClick={() => rejectBooking(index)}>Reject</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No pending requests.
            </div>
          )}
        </div>
      )}
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

export default PendingApproval;
