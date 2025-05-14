import React, { useState, useEffect } from "react";
import "./History.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import { getAllBookings } from "../api"; // assuming this is your api call

const History = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [bookings, setBookings] = useState([]);
   const [statusFilter, setStatusFilter] = useState("All"); // ✅ initialize bookings as []

useEffect(() => {
  const fetchBookings = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const data = await getAllBookings(token);
      console.log("Received bookings data from API:", data); // 👈 log here
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  fetchBookings();
}, []);

const getStatusColor = (status) => {
  if (!status) return "gray";
  switch (status.toLowerCase()) {
    case "completed":
      return "green";
    case "rejected":
      return "red";

    default:
      return "gray";
  }
};
const getDisplayStatus = (booking) => {
  // If booking.status is 'approved' or 'rejected', use approveStatus
  if (["rejected"].includes(booking.approveStatus?.toLowerCase())) {
    return booking.approveStatus;
  }
  return booking.status;
};

const filteredBookings = bookings.filter((booking) => {
  if (statusFilter === "All") return true;
if (statusFilter.toLowerCase() === "rejected") return booking.approveStatus === "rejected";
if (statusFilter.toLowerCase() === "completed") return booking.status === "completed";
return true;
});

  return (
    <div className="history-container">
      <h1>Booking History</h1>

      {/* Tabs and Toggle */}
      <div className="tabs-row">
        <div className="tabs">
          {["All", "Rejected", "Completed"].map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setStatusFilter(tab);
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="grid-toggle">
          <FontAwesomeIcon
            icon={viewMode === "table" ? faThLarge : faList}
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
          />
        </div>
      </div>

      {/* Table or Grid */}
      {viewMode === "table" ? (
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Employee</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.roomId?.title}</td>
                <td>{booking.userName}</td>
                <td>{new Date(booking.fromDateTime).toLocaleString()}</td>
                <td>{new Date(booking.toDateTime).toLocaleString()}</td>
               <td style={{ color: getStatusColor(getDisplayStatus(booking)) }}>
  {getDisplayStatus(booking)}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid-view">
          {filteredBookings.map((booking, index) => (
            <div key={index} className="grid-item">
              <img
                src={booking.roomId?.image}
                alt={booking.roomId?.title}
                className="room-image"
              />
              <h3>{booking.roomId?.title}</h3>
              <p><strong>Employee:</strong> {booking.userName}</p>
              <p><strong>From:</strong> {new Date(booking.fromDateTime).toLocaleString()}</p>
              <p><strong>To:</strong> {new Date(booking.toDateTime).toLocaleString()}</p>
             <p style={{ color: getStatusColor(getDisplayStatus(booking)) }}>
  <strong>Status:</strong> {getDisplayStatus(booking)}
</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
